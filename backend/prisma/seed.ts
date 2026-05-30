import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 12);

  const user = await prisma.user.upsert({
    where: { email: 'demo@blog.com' },
    update: {},
    create: {
      name: 'Demo Author',
      email: 'demo@blog.com',
      password: hashedPassword,
    },
  });

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'technology' },
      update: {},
      create: { name: 'Technology', slug: 'technology' },
    }),
    prisma.category.upsert({
      where: { slug: 'lifestyle' },
      update: {},
      create: { name: 'Lifestyle', slug: 'lifestyle' },
    }),
    prisma.category.upsert({
      where: { slug: 'travel' },
      update: {},
      create: { name: 'Travel', slug: 'travel' },
    }),
  ]);

  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'react' },
      update: {},
      create: { name: 'React', slug: 'react' },
    }),
    prisma.tag.upsert({
      where: { slug: 'nodejs' },
      update: {},
      create: { name: 'Node.js', slug: 'nodejs' },
    }),
    prisma.tag.upsert({
      where: { slug: 'typescript' },
      update: {},
      create: { name: 'TypeScript', slug: 'typescript' },
    }),
  ]);

  const posts = [
    {
      title: 'Getting Started with React and TypeScript',
      content: `React and TypeScript together create a powerful development experience. TypeScript adds static typing to JavaScript, catching errors before they reach production.

In this guide, we'll explore how to set up a new React project with TypeScript, configure your development environment, and build your first typed components.

Key benefits include better IDE support, improved refactoring capabilities, and self-documenting code through type definitions.`,
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      featured: true,
      categoryId: categories[0].id,
      tagIds: [tags[0].id, tags[2].id],
    },
    {
      title: 'Building REST APIs with Node.js and Express',
      content: `Node.js has revolutionized backend development by bringing JavaScript to the server. Combined with Express.js, you can build robust REST APIs quickly and efficiently.

We'll cover routing, middleware, error handling, and best practices for structuring your API. Whether you're building a simple CRUD application or a complex microservice, these patterns will serve you well.

Express middleware is the backbone of request processing — learn how to chain authentication, validation, and logging middleware effectively.`,
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
      featured: true,
      categoryId: categories[0].id,
      tagIds: [tags[1].id, tags[2].id],
    },
    {
      title: 'The Art of Minimalist Living',
      content: `Minimalism isn't about having nothing — it's about having exactly what you need and love. In our consumer-driven world, embracing minimalism can lead to greater clarity, reduced stress, and more meaningful experiences.

Start small: declutter one drawer, one shelf, one room at a time. Ask yourself if each item adds value to your life. You'll be surprised how liberating it feels to let go of things that no longer serve you.

The journey to minimalism is personal and unique. There's no right timeline — only your path toward intentional living.`,
      image: 'https://images.unsplash.com/photo-1484101403633-56289189fcc2?w=800',
      featured: false,
      categoryId: categories[1].id,
      tagIds: [],
    },
    {
      title: 'Hidden Gems: Exploring Southeast Asia',
      content: `Beyond the well-trodden paths of Bangkok and Bali lie countless hidden gems waiting to be discovered. From the misty mountains of Sapa to the pristine beaches of Palawan, Southeast Asia offers adventures for every type of traveler.

Local markets burst with flavors you've never tasted. Temples whisper centuries of history. And the warmth of local hospitality makes every journey unforgettable.

Pack light, stay curious, and let the region reveal its secrets one village at a time.`,
      image: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?w=800',
      featured: true,
      categoryId: categories[2].id,
      tagIds: [],
    },
  ];

  for (const postData of posts) {
    const { categoryId, tagIds, ...rest } = postData;
    await prisma.post.create({
      data: {
        ...rest,
        authorId: user.id,
        categories: { connect: [{ id: categoryId }] },
        tags: tagIds.length ? { connect: tagIds.map((id) => ({ id })) } : undefined,
      },
    });
  }

  console.log('Seed data created successfully');
  console.log('Demo user: demo@blog.com / password123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
