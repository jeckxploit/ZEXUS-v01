# 📁 ZEXUS File Upload Guide

## Overview

ZEXUS uses **AWS S3** for secure, scalable file storage with presigned URLs for direct browser uploads.

### Features

- ✅ Presigned URL uploads (direct to S3)
- ✅ Direct server-side uploads
- ✅ File type validation
- ✅ Size limits enforcement
- ✅ Progress tracking
- ✅ Delete functionality
- ✅ Error tracking with Sentry
- ✅ TypeScript support

---

## Setup

### 1. AWS S3 Bucket Setup

#### Create S3 Bucket

1. Go to [AWS Console](https://console.aws.amazon.com/s3)
2. Click **Create bucket**
3. Bucket name: `your-app-name-uploads`
4. Region: Choose closest to your users
5. **Uncheck** "Block all public access"
6. Check "Bucket owner prefers S3 ACLs"
7. Click **Create bucket**

#### Configure CORS

In S3 Console > Your Bucket > Permissions > CORS:

```json
{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3600
    }
  ]
}
```

#### Create IAM User

1. Go to IAM Console > Users > **Create user**
2. User name: `zexus-uploader`
3. Attach policy:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::your-bucket-name",
        "arn:aws:s3:::your-bucket-name/*"
      ]
    }
  ]
}
```
4. Create access key
5. Copy **Access Key ID** and **Secret Access Key**

### 2. Configure Environment

Add to `.env.local`:

```bash
# AWS Credentials
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

---

## File Types & Limits

| Type | Extensions | Max Size |
|------|------------|----------|
| **Image** | .jpg, .jpeg, .png, .gif, .webp | 5 MB |
| **Document** | .pdf, .doc, .docx | 10 MB |
| **Video** | .mp4, .webm, .mov | 100 MB |
| **Audio** | .mp3, .wav, .ogg | 20 MB |

---

## Usage

### Basic Upload Component

```tsx
import FileUpload from '@/components/FileUpload';

function MyPage() {
  return (
    <FileUpload
      accept={['image']}
      maxSize={5 * 1024 * 1024} // 5MB
      multiple={false}
      onUpload={(result) => {
        console.log('Uploaded:', result.url);
      }}
      onError={(error) => {
        console.error('Upload error:', error);
      }}
    />
  );
}
```

### Multiple File Types

```tsx
<FileUpload
  accept={['image', 'document']}
  maxSize={10 * 1024 * 1024}
  multiple={true}
  onUpload={(result) => {
    // Handle uploaded file
    setFileUrl(result.url);
  }}
/>
```

### With Form

```tsx
function PostForm() {
  const [coverImage, setCoverImage] = useState('');

  return (
    <form>
      <FileUpload
        accept={['image']}
        onUpload={(result) => setCoverImage(result.url)}
      />
      
      {coverImage && (
        <img src={coverImage} alt="Cover" />
      )}
    </form>
  );
}
```

---

## API Routes

### POST /api/upload/presigned

Get presigned URL for direct upload.

**Request:**
```json
{
  "fileName": "image.jpg",
  "fileType": "image/jpeg",
  "type": "image"
}
```

**Response:**
```json
{
  "success": true,
  "uploadUrl": "https://bucket.s3.amazonaws.com/...",
  "fileUrl": "https://bucket.s3.amazonaws.com/images/...",
  "key": "images/123-uuid.jpg",
  "expiresAt": "2025-01-01T12:00:00.000Z"
}
```

### POST /api/upload/direct

Direct server-side upload.

**Request:** `multipart/form-data`
```
file: [binary]
```

**Response:**
```json
{
  "success": true,
  "file": {
    "url": "https://bucket.s3.amazonaws.com/...",
    "key": "images/123-uuid.jpg",
    "size": 12345,
    "contentType": "image/jpeg",
    "uploadedAt": "2025-01-01T12:00:00.000Z"
  }
}
```

### DELETE /api/upload/delete?key=xxx

Delete file from S3.

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

---

## Utility Functions

### Validate File

```typescript
import { validateFile } from '@/lib/upload';

const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
const result = validateFile(file);

if (!result.valid) {
  console.error(result.error);
} else {
  console.log('File type:', result.fileType);
}
```

### Get Presigned URL

```typescript
import { getUploadPresignedUrl } from '@/lib/upload';

const { uploadUrl, fileUrl, key } = await getUploadPresignedUrl(
  'image.jpg',
  'image/jpeg',
  'image'
);

// Upload using fetch
await fetch(uploadUrl, {
  method: 'PUT',
  body: file,
  headers: { 'Content-Type': 'image/jpeg' },
});

console.log('File URL:', fileUrl);
```

### Upload File (Server-side)

```typescript
import { uploadFile } from '@/lib/upload';

const result = await uploadFile(
  buffer, // File buffer
  'image.jpg',
  'image/jpeg',
  'image'
);

console.log('Public URL:', result.publicUrl);
```

### Delete File

```typescript
import { deleteFile } from '@/lib/upload';

await deleteFile('images/123-uuid.jpg');
```

---

## Direct Upload Example (Browser)

```tsx
async function handleFileSelect(file: File) {
  // 1. Get presigned URL
  const response = await fetch('/api/upload/presigned', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
    }),
  });

  const { uploadUrl, fileUrl } = await response.json();

  // 2. Upload directly to S3
  await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  });

  // 3. Use the file URL
  console.log('Uploaded to:', fileUrl);
}
```

---

## Cloudinary Alternative

If you prefer Cloudinary over S3:

### Setup

```bash
# .env.local
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Upload to Cloudinary

```typescript
async function uploadToCloudinary(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'your-preset');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await response.json();
  return data.secure_url;
}
```

---

## Best Practices

### 1. Client-side Validation

```tsx
// ✅ Good - Validate before upload
const validation = validateFile(file);
if (!validation.valid) {
  toast.error(validation.error);
  return;
}
```

### 2. Use Presigned URLs

```tsx
// ✅ Good - Direct to S3 (faster, less server load)
const { uploadUrl } = await getUploadPresignedUrl(...);
await fetch(uploadUrl, { method: 'PUT', body: file });

// ❌ Bad - Server relay (slower, more server load)
await fetch('/api/upload', { method: 'POST', body: file });
```

### 3. Handle Errors

```tsx
try {
  const result = await uploadFile(...);
} catch (error) {
  Sentry.captureException(error);
  toast.error('Upload failed, please try again');
}
```

### 4. Optimize Images

```tsx
// Compress before upload
async function compressImage(file: File, quality = 0.8) {
  const img = await createImageBitmap(file);
  const canvas = new OffscreenCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx?.drawImage(img, 0, 0);
  const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality });
  return new File([blob], file.name, { type: 'image/jpeg' });
}
```

---

## Troubleshooting

### CORS Errors

```
Access to fetch at 's3.amazonaws.com' from origin has been blocked by CORS policy
```

**Solution:** Add CORS configuration to S3 bucket (see Setup section).

### Access Denied

```
Error: Access Denied
```

**Solution:** 
1. Check IAM user has correct permissions
2. Check bucket policy allows uploads
3. Verify ACLs are enabled

### File Too Large

```
Error: File size exceeds maximum
```

**Solution:** Increase `maxSize` in component or compress file before upload.

---

## Security

### 1. Validate on Server

Always validate file type and size on server even with client validation.

### 2. Use IAM Roles

For EC2/Lambda, use IAM roles instead of access keys.

### 3. Limit CORS Origins

```json
"AllowedOrigins": ["https://yourdomain.com"]
```

### 4. Set Expiration

Presigned URLs expire after 1 hour by default.

---

## Resources

- [AWS S3 Docs](https://docs.aws.amazon.com/s3/)
- [AWS SDK Docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [S3 CORS Setup](https://docs.aws.amazon.com/AmazonS3/latest/userguide/enabling-cors-examples.html)

---

## Commands

```bash
# Test upload endpoint
curl -X POST http://localhost:3000/api/upload/presigned \
  -H "Content-Type: application/json" \
  -d '{"fileName":"test.jpg","fileType":"image/jpeg"}'
```
