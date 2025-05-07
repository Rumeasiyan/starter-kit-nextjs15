import { PrismaClient, type Prisma } from '@prisma/client';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const main = async () => {
  try {
    const users = [
      {
        role: 'admin',
        permissions: [],
        users: [
          // {
          //   name: 'Rumeasiyan',
          //   email: 'srumeasiyan@gmail.com',
          //   password: 'Waltz0@Stegosaur2-Skincare1-Cranium5-Pants5',
          // },
          {
            name: 'Zameeh',
            email: 'jazameeh@gmail.com',
            password: 'Waltz0@Stegosaur2-Skincare1-Cranium5-Pants5',
          },
        ] as const,
      },
      {
        role: 'user',
        permissions: [],
        users: [],
      },
      {
        role: 'investor',
        permissions: [],
        users: [],
      },
    ] as const;

    const testimonial = [
      {
        quote: 'This platform has revolutionized our daily operations.',
        author: 'Alice Smith',
        role: 'Product Manager',
        company: 'TechCorp Inc.',
      },
      {
        quote: 'Absolutely fantastic experience, highly recommended!',
        author: 'Bob Johnson',
        role: 'CEO',
        company: 'Startup Hub',
      },
      {
        quote: 'A game-changer for team collaboration and productivity.',
        author: 'Carla Martinez',
        role: 'Team Lead',
        company: 'InnovateX Solutions',
      },
      {
        quote: 'The customer support is top-notch and very responsive.',
        author: 'David Lee',
        role: 'Support Engineer',
        company: 'HelpDesk Pro',
      },
      {
        quote: 'User-friendly interface paired with powerful features.',
        author: 'Eva Green',
        role: 'UX Designer',
        company: 'Creative Designs LLC',
      },
    ] as const;

    // Clear existing data
    try {
      const client = prisma as unknown as {
        userRole: { deleteMany: () => Promise<unknown> };
        user: { deleteMany: () => Promise<unknown> };
        role: { deleteMany: () => Promise<unknown> };
        testimonial: { deleteMany: () => Promise<unknown> };
      };

      await client.userRole.deleteMany();
      await client.user.deleteMany();
      await client.role.deleteMany();
      await client.testimonial.deleteMany();
    } catch (error) {
      console.warn('Error while cleaning existing data:', error);
      // Continue with seeding even if cleanup fails
    }

    // Create roles and their associated users
    for (const userData of users) {
      // Create role
      const role = await prisma.role.create({
        data: {
          name: userData.role,
          slug: userData.role.toLowerCase(),
          description: `${userData.role} role`,
        },
      });

      // Create users for this role
      if (userData.users.length > 0) {
        for (const user of userData.users) {
          const createdUser = await prisma.user.create({
            data: {
              id: crypto.randomUUID(),
              name: user.name,
              email: user.email,
              emailVerified: false,
            },
          });

          // Create user-role relationship
          await prisma.userRole.create({
            data: {
              userId: createdUser.id,
              roleId: role.id,
            },
          });

          // Create account with hashed password
          await prisma.account.create({
            data: {
              id: crypto.randomUUID(),
              userId: createdUser.id,
              accountId: createdUser.id,
              providerId: 'credentials',
              password: bcrypt.hashSync(user.password, 10),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
        }
      }
    }

    // Create testimonials
    const testimonialPromises = testimonial.map(async (test) => {
      try {
        const client = prisma as unknown as {
          testimonial: {
            create: (args: {
              data: Prisma.TestimonialCreateInput;
            }) => Promise<unknown>;
          };
        };

        return await client.testimonial.create({
          data: {
            quote: test.quote,
            author: test.author,
            role: test.role,
            company: test.company,
          },
        });
      } catch (error) {
        console.error(
          `Failed to create testimonial for ${test.author}:`,
          error
        );
        return null;
      }
    });

    await Promise.all(testimonialPromises);

    console.info(`Database has been seeded. 🌱`);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error seeding database:', error.message);
    } else {
      console.error('Error seeding database:', error);
    }
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

main().catch((err) => {
  if (err instanceof Error) {
    console.warn('Error While generating Seed: \n', err.message);
  } else {
    console.warn('Error While generating Seed: \n', err);
  }
});
