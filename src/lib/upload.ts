import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

// S3 Client Configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || '';

// File type configurations
const FILE_TYPE_CONFIGS = {
  image: {
    max_size: 5 * 1024 * 1024, // 5MB
    allowed_types: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    folder: 'images',
  },
  document: {
    max_size: 10 * 1024 * 1024, // 10MB
    allowed_types: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    folder: 'documents',
  },
  video: {
    max_size: 100 * 1024 * 1024, // 100MB
    allowed_types: ['video/mp4', 'video/webm', 'video/quicktime'],
    folder: 'videos',
  },
  audio: {
    max_size: 20 * 1024 * 1024, // 20MB
    allowed_types: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
    folder: 'audio',
  },
} as const;

export type FileType = keyof typeof FILE_TYPE_CONFIGS;

export interface UploadResult {
  key: string;
  url: string;
  publicUrl: string;
  size: number;
  contentType: string;
  uploadedAt: string;
}

export interface PresignedUrlResult {
  uploadUrl: string;
  fileUrl: string;
  key: string;
  expiresAt: Date;
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  fileType?: FileType;
}

/**
 * Validate file before upload
 */
export function validateFile(
  file: File | { size: number; type: string },
  allowedTypes?: FileType[]
): FileValidationResult {
  const { size, type } = file;

  // Determine file type
  let detectedType: FileType | undefined;
  for (const [typeKey, config] of Object.entries(FILE_TYPE_CONFIGS)) {
    if ((config.allowed_types as readonly string[]).includes(type)) {
      detectedType = typeKey as FileType;
      break;
    }
  }

  if (!detectedType) {
    return { valid: false, error: 'File type not allowed' };
  }

  // Check if type is in allowed list
  if (allowedTypes && !allowedTypes.includes(detectedType)) {
    return { valid: false, error: `File type must be one of: ${allowedTypes.join(', ')}` };
  }

  // Check file size
  const config = FILE_TYPE_CONFIGS[detectedType];
  if (size > config.max_size) {
    return {
      valid: false,
      error: `File size exceeds maximum of ${formatBytes(config.max_size)}`,
    };
  }

  return { valid: true, fileType: detectedType };
}

/**
 * Generate unique file key
 */
function generateFileKey(fileName: string, folder: string): string {
  const ext = fileName.split('.').pop() || '';
  const uuid = uuidv4();
  const timestamp = Date.now();
  return `${folder}/${timestamp}-${uuid}.${ext}`;
}

/**
 * Get presigned URL for upload
 */
export async function getUploadPresignedUrl(
  fileName: string,
  fileType: string,
  type: FileType = 'image'
): Promise<PresignedUrlResult> {
  const config = FILE_TYPE_CONFIGS[type];
  const key = generateFileKey(fileName, config.folder);

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: fileType,
    ACL: 'public-read',
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  return {
    uploadUrl,
    fileUrl: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
    key,
    expiresAt: new Date(Date.now() + 3600 * 1000),
  };
}

/**
 * Upload file directly (server-side)
 */
export async function uploadFile(
  file: Buffer,
  fileName: string,
  contentType: string,
  type: FileType = 'image'
): Promise<UploadResult> {
  const config = FILE_TYPE_CONFIGS[type];
  const key = generateFileKey(fileName, config.folder);

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
    ACL: 'public-read',
  });

  await s3Client.send(command);

  const publicUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return {
    key,
    url: publicUrl,
    publicUrl,
    size: file.length,
    contentType,
    uploadedAt: new Date().toISOString(),
  };
}

/**
 * Get presigned URL for downloading
 */
export async function getDownloadUrl(key: string, expiresIn = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Delete file from S3
 */
export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}

/**
 * List files in folder
 */
export async function listFiles(folder: string, prefix = ''): Promise<string[]> {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    Prefix: `${folder}/${prefix}`,
  });

  const response = await s3Client.send(command);
  return response.Contents?.map((obj) => obj.Key || '') || [];
}

/**
 * Format bytes to human-readable format
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Get file type from MIME type
 */
export function getFileType(mimeType: string): FileType | null {
  for (const [type, config] of Object.entries(FILE_TYPE_CONFIGS)) {
    if ((config.allowed_types as readonly string[]).includes(mimeType)) {
      return type as FileType;
    }
  }
  return null;
}

/**
 * Get allowed MIME types for file type
 */
export function getAllowedMimeTypes(type: FileType): readonly string[] {
  return FILE_TYPE_CONFIGS[type].allowed_types;
}

/**
 * Get max file size for file type
 */
export function getMaxFileSize(type: FileType): number {
  return FILE_TYPE_CONFIGS[type].max_size;
}

export default {
  validateFile,
  getUploadPresignedUrl,
  uploadFile,
  getDownloadUrl,
  deleteFile,
  listFiles,
  formatBytes,
  getFileType,
  getAllowedMimeTypes,
  getMaxFileSize,
};
