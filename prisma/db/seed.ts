import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@zexus.local' },
    update: {},
    create: {
      email: 'admin@zexus.local',
      name: 'Admin User',
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  // Create moderator user
  const moderatorUser = await prisma.user.upsert({
    where: { email: 'mod@zexus.local' },
    update: {},
    create: {
      email: 'mod@zexus.local',
      name: 'Moderator User',
      role: 'MODERATOR',
      emailVerified: new Date(),
    },
  });

  // Create regular user
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@zexus.local' },
    update: {},
    create: {
      email: 'user@zexus.local',
      name: 'Regular User',
      role: 'USER',
      emailVerified: new Date(),
    },
  });

  console.log('✓ Created users:', {
    admin: adminUser.email,
    moderator: moderatorUser.email,
    user: regularUser.email,
  });

  // Create categories
  const techCategory = await prisma.category.upsert({
    where: { slug: 'technology' },
    update: {},
    create: {
      name: 'Technology',
      slug: 'technology',
      description: 'Latest in tech and innovation',
    },
  });

  const designCategory = await prisma.category.upsert({
    where: { slug: 'design' },
    update: {},
    create: {
      name: 'Design',
      slug: 'design',
      description: 'UI/UX and creative design',
    },
  });

  const aiCategory = await prisma.category.upsert({
    where: { slug: 'artificial-intelligence' },
    update: {},
    create: {
      name: 'Artificial Intelligence',
      slug: 'artificial-intelligence',
      description: 'AI, ML, and the future of work',
    },
  });

  console.log('✓ Created categories');

  // Create tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'nextjs' },
      update: {},
      create: { name: 'Next.js', slug: 'nextjs' },
    }),
    prisma.tag.upsert({
      where: { slug: 'react' },
      update: {},
      create: { name: 'React', slug: 'react' },
    }),
    prisma.tag.upsert({
      where: { slug: 'typescript' },
      update: {},
      create: { name: 'TypeScript', slug: 'typescript' },
    }),
    prisma.tag.upsert({
      where: { slug: 'tailwind' },
      update: {},
      create: { name: 'Tailwind CSS', slug: 'tailwind' },
    }),
    prisma.tag.upsert({
      where: { slug: 'prisma' },
      update: {},
      create: { name: 'Prisma', slug: 'prisma' },
    }),
  ]);

  console.log('✓ Created tags');

  // Create sample posts
  const post1 = await prisma.post.create({
    data: {
      title: 'Getting Started with ZEXUS',
      slug: 'getting-started-with-zexus',
      excerpt: 'Learn how to set up and use the ZEXUS platform for your next project.',
      content: `
# Welcome to ZEXUS

ZEXUS is a modern, production-ready web application scaffold that combines the best technologies in the React ecosystem.

## Features

- ⚡ **Next.js 16** - The React Framework for production
- 📘 **TypeScript** - Type-safe development
- 🎨 **Tailwind CSS** - Utility-first styling
- 🧩 **shadcn/ui** - Beautiful components
- 🗄️ **Prisma** - Type-safe database ORM
- 🔐 **NextAuth.js** - Authentication made easy

## Quick Start

\`\`\`bash
# Install dependencies
bun install

# Start development server
bun run dev

# Setup database
bun run db:push
\`\`\`

Happy coding! 🚀
      `.trim(),
      published: true,
      featured: true,
      authorId: adminUser.id,
      categories: {
        connect: [{ id: techCategory.id }],
      },
      tags: {
        connect: tags.map(tag => ({ id: tag.id })),
      },
      views: 1234,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'Building Modern UIs with React and Tailwind',
      slug: 'building-modern-uis-react-tailwind',
      excerpt: 'Explore best practices for creating beautiful user interfaces.',
      content: `
# Building Modern UIs

Learn how to create stunning, responsive user interfaces using React and Tailwind CSS.

## Why Tailwind CSS?

Tailwind CSS is a utility-first CSS framework that provides low-level utility classes.

## Best Practices

1. Use semantic HTML
2. Leverage component composition
3. Keep accessibility in mind
4. Test on multiple devices

## Example

\`\`\`tsx
function Button({ children, variant = 'primary' }) {
  return (
    <button className={cn(
      "px-4 py-2 rounded-md font-medium",
      variant === 'primary' && "bg-blue-500 text-white",
      variant === 'secondary' && "bg-gray-200 text-gray-800"
    )}>
      {children}
    </button>
  );
}
\`\`\`
      `.trim(),
      published: true,
      featured: false,
      authorId: moderatorUser.id,
      categories: {
        connect: [{ id: designCategory.id }],
      },
      tags: {
        connect: [
          { id: tags.find(t => t.slug === 'react')?.id },
          { id: tags.find(t => t.slug === 'tailwind')?.id },
        ],
      },
      views: 567,
    },
  });

  const post3 = await prisma.post.create({
    data: {
      title: 'The Future of AI in Web Development',
      slug: 'future-of-ai-web-development',
      excerpt: 'How AI is transforming the way we build websites and applications.',
      content: `
# AI in Web Development

Artificial Intelligence is revolutionizing how developers build applications.

## AI-Powered Tools

- **Code Generation**: GitHub Copilot, Cursor, Z.ai
- **Testing**: Automated test generation
- **Design**: AI-generated UI components
- **Content**: Automated content creation

## The Future

AI won't replace developers, but developers who use AI will replace those who don't.

## Getting Started

1. Try AI coding assistants
2. Automate repetitive tasks
3. Focus on architecture and design
4. Keep learning and adapting
      `.trim(),
      published: false,
      featured: true,
      authorId: adminUser.id,
      categories: {
        connect: [{ id: aiCategory.id }],
      },
      tags: {
        connect: [
          { id: tags.find(t => t.slug === 'typescript')?.id },
          { id: tags.find(t => t.slug === 'prisma')?.id },
        ],
      },
      views: 89,
    },
  });

  console.log('✓ Created posts:', {
    post1: post1.title,
    post2: post2.title,
    post3: post3.title,
  });

  console.log('\n✅ Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Users: ${await prisma.user.count()}`);
  console.log(`   - Categories: ${await prisma.category.count()}`);
  console.log(`   - Tags: ${await prisma.tag.count()}`);
  console.log(`   - Posts: ${await prisma.post.count()}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
