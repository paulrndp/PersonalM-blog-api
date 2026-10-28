import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding PersonalM API database...");

  const existingAdmin = await prisma.account.findUnique({
    where: { username: "admin" },
  });

  const hashedPassword = await bcrypt.hash("password", 10);

  if (!existingAdmin) {
    await prisma.account.create({
      data: {
        username: "admin",
        password: hashedPassword,
        firstname: "Hannah",
        lastname: "Montemayor",
        desc: "Writer, storyteller, and creator of worlds. Welcome to my personal blog where I share my novels, reflections, and candid thoughts.",
      },
    });
    console.log("Admin account created (username: admin, password: password)");
  }

  const storiesCount = await prisma.story.count();
  if (storiesCount === 0) {
    await prisma.story.create({
      data: {
        title: "The Whispering Pines",
        desc: "A heartfelt story of discovering one's roots and the unexpected journeys that define who we become.",
        genre: "Romance & Drama",
        tags: "#novel #romance #journey",
        views: 142,
        totalChapters: 2,
        chapters: {
          create: [
            {
              title: "Chapter 1: A Cold Beginning",
              content:
                "<p>The winter air held a crisp promise. Hannah tightened her woolen scarf around her neck and looked up at the quiet canopy of tall pine trees.</p>",
              views: 89,
            },
            {
              title: "Chapter 2: Footsteps in the Snow",
              content:
                "<p>By mid-afternoon, the sun barely broke through the thick gray clouds. Ahead lay an old cabin with light spilling from a frosted window.</p>",
              views: 53,
            },
          ],
        },
      },
    });
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
