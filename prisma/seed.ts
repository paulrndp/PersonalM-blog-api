import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Seed data definitions (exactly 1 per category)
const SEED_DATA = {
  admin: {
    username: "admin",
    password: "password",
    firstname: "Hannah",
    lastname: "Montemayor",
    desc: "Writer, storyteller, and creator of worlds. Welcome to my personal blog where I share my novels, reflections, and candid thoughts.",
  },
  story: {
    title: "The Whispering Pines",
    desc: "A heartfelt story of discovering one's roots and the unexpected journeys that define who we become.",
    genre: "Romance & Drama",
    tags: "#novel #romance #journey",
    views: 142,
  },
  chapter: {
    title: "Chapter 1: A Cold Beginning",
    content:
      "<p>The winter air held a crisp promise. Hannah tightened her woolen scarf around her neck and looked up at the quiet canopy of tall pine trees. Each step crunching beneath her boots reminded her of winters long past in the quiet countryside.</p><p>She had left the city behind, carrying nothing but a worn leather bag and a box of old letters that had arrived unaddressed to her doorstep.</p>",
    views: 89,
  },
  blog: {
    title: "The Art of Mindful Storytelling",
    content:
      "<p>Writing is more than stringing words together; it is giving life to unspoken sentiments. In this post, I reflect on what inspires the characters in my stories and how solitude sharpens creative observation.</p><p>When we pause and listen, even silence tells a tale.</p>",
    category: "Blog",
    status: "published",
    views: 64,
  },
  random: {
    title: "Midnight Coffee and Fleeting Epiphanies",
    content:
      "<p>It is 2:15 AM. The coffee is lukewarm, but the city outside is completely still. Sometimes the most honest ideas strike when the rest of the world is asleep.</p><p>Thoughts drift without a map, and perhaps that is where true imagination lives.</p>",
    category: "Random",
    status: "published",
    views: 42,
  },
};

async function main() {
  console.log("🌱 Starting smart seeding for PersonalM API database...\n");

  // 1. Smart Seed: Admin Account
  console.log("👤 [1/4] Checking Admin Account...");
  const existingAdmin = await prisma.account.findUnique({
    where: { username: SEED_DATA.admin.username },
  });

  if (existingAdmin) {
    console.log(`   ℹ️  Account '${existingAdmin.username}' already exists (ID: ${existingAdmin.id}). Skipping.`);
  } else {
    const hashedPassword = await bcrypt.hash(SEED_DATA.admin.password, 10);
    const newAdmin = await prisma.account.create({
      data: {
        username: SEED_DATA.admin.username,
        password: hashedPassword,
        firstname: SEED_DATA.admin.firstname,
        lastname: SEED_DATA.admin.lastname,
        desc: SEED_DATA.admin.desc,
      },
    });
    console.log(`   ✅ Account '${newAdmin.username}' created successfully (ID: ${newAdmin.id}).`);
  }

  // 2. Smart Seed: Story & Chapter
  console.log("\n📖 [2/4] Checking Category: Story & Chapter...");
  let targetStory = await prisma.story.findFirst({
    where: { title: SEED_DATA.story.title },
  });

  if (targetStory) {
    console.log(`   ℹ️  Story '${targetStory.title}' already exists (ID: ${targetStory.id}). Skipping story creation.`);
  } else {
    targetStory = await prisma.story.create({
      data: {
        title: SEED_DATA.story.title,
        desc: SEED_DATA.story.desc,
        genre: SEED_DATA.story.genre,
        tags: SEED_DATA.story.tags,
        views: SEED_DATA.story.views,
        totalChapters: 0,
      },
    });
    console.log(`   ✅ Story '${targetStory.title}' created successfully (ID: ${targetStory.id}).`);
  }

  // Chapter under the story
  const existingChapter = await prisma.chapter.findFirst({
    where: {
      storyId: targetStory.id,
      title: SEED_DATA.chapter.title,
    },
  });

  if (existingChapter) {
    console.log(`   ℹ️  Chapter '${existingChapter.title}' already exists under Story ID ${targetStory.id} (Chapter ID: ${existingChapter.id}). Skipping.`);
  } else {
    const newChapter = await prisma.chapter.create({
      data: {
        storyId: targetStory.id,
        title: SEED_DATA.chapter.title,
        content: SEED_DATA.chapter.content,
        views: SEED_DATA.chapter.views,
      },
    });

    const chapterCount = await prisma.chapter.count({
      where: { storyId: targetStory.id },
    });

    await prisma.story.update({
      where: { id: targetStory.id },
      data: { totalChapters: chapterCount },
    });

    console.log(`   ✅ Chapter '${newChapter.title}' created under Story ID ${targetStory.id} (Chapter ID: ${newChapter.id}).`);
  }

  // 3. Smart Seed: Blog Post (Category: Blog)
  console.log("\n✍️  [3/4] Checking Category: Blog Post...");
  const existingBlogPost = await prisma.post.findFirst({
    where: {
      category: "Blog",
      title: SEED_DATA.blog.title,
    },
  });

  if (existingBlogPost) {
    console.log(`   ℹ️  Blog post '${existingBlogPost.title}' already exists (ID: ${existingBlogPost.id}). Skipping.`);
  } else {
    const newBlogPost = await prisma.post.create({
      data: {
        title: SEED_DATA.blog.title,
        content: SEED_DATA.blog.content,
        category: SEED_DATA.blog.category,
        status: SEED_DATA.blog.status,
        views: SEED_DATA.blog.views,
      },
    });
    console.log(`   ✅ Blog post '${newBlogPost.title}' created successfully (ID: ${newBlogPost.id}).`);
  }

  // 4. Smart Seed: Random Thoughts Post (Category: Random)
  console.log("\n💭 [4/4] Checking Category: Random Thoughts Post...");
  const existingRandomPost = await prisma.post.findFirst({
    where: {
      category: "Random",
      title: SEED_DATA.random.title,
    },
  });

  if (existingRandomPost) {
    console.log(`   ℹ️  Random thought post '${existingRandomPost.title}' already exists (ID: ${existingRandomPost.id}). Skipping.`);
  } else {
    const newRandomPost = await prisma.post.create({
      data: {
        title: SEED_DATA.random.title,
        content: SEED_DATA.random.content,
        category: SEED_DATA.random.category,
        status: SEED_DATA.random.status,
        views: SEED_DATA.random.views,
      },
    });
    console.log(`   ✅ Random thoughts post '${newRandomPost.title}' created successfully (ID: ${newRandomPost.id}).`);
  }

  console.log("\n✨ Smart seeding process finished!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
