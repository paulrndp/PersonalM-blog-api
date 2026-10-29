import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Seed data definitions: 5 stories with exactly 3 chapters each, 5 blog posts, 5 random thoughts
const SEED_DATA = {
  admin: {
    username: "admin",
    password: "password",
    firstname: "Hannah",
    lastname: "Montemayor",
    desc: "Writer, storyteller, and creator of worlds. Welcome to my personal blog where I share my serialized novels, reflections, and candid thoughts.",
  },
  stories: [
    {
      title: "The Whispering Pines",
      desc: "A heartfelt story of discovering one's roots and the unexpected journeys that define who we become amidst the misty northern forests.",
      genre: "Romance & Drama",
      tags: "#novel #romance #journey #heartfelt",
      views: 142,
      chapters: [
        {
          title: "Chapter 1: A Cold Beginning",
          content:
            "<p>The winter air held a crisp promise. Hannah tightened her woolen scarf around her neck and looked up at the quiet canopy of tall pine trees. Each step crunching beneath her boots reminded her of winters long past in the quiet countryside.</p><p>She had left the city behind, carrying nothing but a worn leather bag and a box of old letters that had arrived unaddressed to her doorstep.</p>",
          views: 89,
        },
        {
          title: "Chapter 2: Footsteps in the Snow",
          content:
            "<p>By mid-afternoon, the sun barely broke through the thick gray clouds. Ahead lay an old cabin with light spilling from a frosted window. Smoke curled lazily from the stone chimney.</p><p>'Someone is still here,' she whispered to herself, feeling a mix of trepidation and curiosity wash over her.</p>",
          views: 53,
        },
        {
          title: "Chapter 3: Voices in the Hearth",
          content:
            "<p>The embers glowed softly inside the rustic fireplace. An old diary rested on the mantelpiece, its leather cover cracked with age. Hannah sat on the rocking chair and gently turned the first yellowed page.</p><p>'If you are reading this, you have finally returned home,' the handwritten ink began.</p>",
          views: 41,
        },
      ],
    },
    {
      title: "Echoes of Eternity",
      desc: "An epic tale across mystical realms, unraveling long-forgotten secrets of a hidden empire and ancient guardian stones.",
      genre: "Fantasy & Mystery",
      tags: "#fantasy #magic #chronicles #ancient",
      views: 215,
      chapters: [
        {
          title: "Prologue: The Awakening Stone",
          content:
            "<p>Deep beneath the emerald canopy of the forgotten forest, a faint blue glow resonated from the sacred obelisk. The runes, silent for five hundred years, began to pulse in rhythm with an unknown heartbeat.</p>",
          views: 120,
        },
        {
          title: "Chapter 1: The Keeper's Vow",
          content:
            "<p>Elaria drew her twin daggers and took a measured breath. The silence of the mountain pass was unnatural. No birds sang, and even the mountain winds had settled into an eerie calm.</p>",
          views: 95,
        },
        {
          title: "Chapter 2: Shadows of the Citadel",
          content:
            "<p>The twin moons cast an ethereal violet hue over the ancient ruins. Elaria navigated the crumbling stone corridor, listening intently to the distant hum of the celestial spire.</p><p>A cloaked figure stood at the threshold of the grand archive, waiting with an unsheathed obsidian blade.</p>",
          views: 68,
        },
      ],
    },
    {
      title: "Beneath the Neon Rain",
      desc: "In a sprawling dystopian megacity bathed in neon light and endless rainfall, a rogue archivist uncovers a suppressed memory file.",
      genre: "Sci-Fi & Cyberpunk",
      tags: "#cyberpunk #scifi #noir #futuristic",
      views: 178,
      chapters: [
        {
          title: "Chapter 1: Static on Sector 9",
          content:
            "<p>The holographic advertisements flickered through the sheet of relentless acid rain. Kael pulled his synthetic collar up and checked the encrypted datapad in his pocket. The transmission was genuine, and dangerous.</p>",
          views: 74,
        },
        {
          title: "Chapter 2: The Ghost Protocol",
          content:
            "<p>Rain pounded against the reinforced glass of the transit capsule. Kael jacked the neural cable into the datapad, bypassing the surveillance firewalls of Cyberdyne Tower.</p><p>Lines of green code scrolled frantically across his optic visor. The file wasn't just corporate records—it was the deleted memories of an entire city block.</p>",
          views: 58,
        },
        {
          title: "Chapter 3: Alleyway Rendezvous",
          content:
            "<p>The back alley reeked of ozone and wet pavement. A hooded informant emerged from the shadows near a flickering neon noodle kiosk.</p><p>'You shouldn't have opened that packet,' the informant warned, tossing a small encrypted drive onto Kael's palm.</p>",
          views: 47,
        },
      ],
    },
    {
      title: "Letters to the Horizon",
      desc: "A poignant journey of redemption and healing told through unsent letters left behind in an abandoned seaside lighthouse.",
      genre: "Literary Fiction",
      tags: "#drama #sliceoflife #letters #hope",
      views: 130,
      chapters: [
        {
          title: "Chapter 1: Salt and Old Parchment",
          content:
            "<p>The ocean crashed violently against the jagged cliffs below. Inside the lighthouse lantern room, boxes of cedar wood preserved decades of handwriting untouched by the salty breeze.</p>",
          views: 62,
        },
        {
          title: "Chapter 2: The Tide Recedes",
          content:
            "<p>Morning brought a calming mist over the coastline. Clara walked along the shoreline, watching the gulls dive into the foamy waves.</p><p>In her coat pocket was letter number seven, written thirty years ago by an astronomer who promised to return when Halley's comet crossed the sky.</p>",
          views: 51,
        },
        {
          title: "Chapter 3: Beacon in the Dark",
          content:
            "<p>As night fell, the stormy squall rattled the lighthouse glass. Clara climbed the spiral iron staircase with a fresh gallon of kerosene.</p><p>She struck a long match, igniting the giant Fresnel lens. As the beam swept across the black waters, a distant horn signaled through the fog.</p>",
          views: 44,
        },
      ],
    },
    {
      title: "The Clockmaker of Verona",
      desc: "In 18th-century Verona, an apprentice discovers that his master's intricate astronomical clocks can subtly alter the flow of seconds.",
      genre: "Historical & Mystery",
      tags: "#historical #mystery #italy #clockmaker",
      views: 195,
      chapters: [
        {
          title: "Chapter 1: The Brass Pendulum",
          content:
            "<p>Tick. Tack. The rhythmic precision echoed throughout the cobblestone workshop. Mateo held the magnifying glass to his eye, carefully setting the ruby jewel inside the escapement wheel.</p>",
          views: 81,
        },
        {
          title: "Chapter 2: Fractured Hours",
          content:
            "<p>The grand clock tower in the piazza chimed thirteen times at midnight. Mateo dropped his polishing cloth in disbelief. Across the workshop, every pendulum had ceased its swing simultaneously.</p><p>Outside, the carriage horses in the street were frozen mid-gallop. Time itself had paused for everyone—except him.</p>",
          views: 63,
        },
        {
          title: "Chapter 3: The Secret Escapement",
          content:
            "<p>Beneath the floorboards of the master's private study lay a locked chest wrapped in iron bands. Using a delicate skeleton key, Mateo unlocked the brass clasp.</p><p>Inside rested a sphere of interlocking golden gears, turning without any apparent spring or battery, humming with harmonic vibration.</p>",
          views: 55,
        },
      ],
    },
  ],
  blogPosts: [
    {
      title: "The Art of Mindful Storytelling",
      content:
        "<p>Writing is more than stringing words together; it is giving life to unspoken sentiments. In this post, I reflect on what inspires the characters in my stories and how solitude sharpens creative observation.</p><p>When we pause and listen, even silence tells a tale.</p>",
      category: "Blog",
      status: "published",
      views: 64,
    },
    {
      title: "Finding Joy in the Little Things",
      content:
        "<p>Life moves fast, and often we get caught up in big deadlines, huge milestones, and future plans. But today, I took an hour just sitting with a warm cup of jasmine tea, listening to the gentle drizzle against the windowpane.</p><p>True peace isn't found in reaching the destination; it is found in the quiet moments between the milestones.</p>",
      category: "Blog",
      status: "published",
      views: 88,
    },
    {
      title: "Behind the Scenes: How I Outline Serialized Novels",
      content:
        "<p>Many readers ask how I maintain continuity across dozens of chapters. The truth is a blend of color-coded index cards, detailed character sheets, and room for characters to make their own choices as the plot unfolds.</p><p>Here is a breakdown of my creative process from initial spark to final proofread.</p>",
      category: "Blog",
      status: "published",
      views: 112,
    },
    {
      title: "Overcoming the Dreaded Creative Block",
      content:
        "<p>Every writer eventually meets the blank white page and feels a wave of hesitation. Over the years, I've realized that writer's block is rarely a lack of ideas—it is often perfectionism in disguise.</p><p>Here are three simple rituals that help me write the first messy sentence without fear.</p>",
      category: "Blog",
      status: "published",
      views: 73,
    },
    {
      title: "Why Physical Books Still Hold Magic",
      content:
        "<p>In an era dominated by screens and instant notifications, opening a physical book is an act of rebellion. The weight of the paper, the scent of ink, and the tactile turning of pages anchor our attention in ways digital feeds never can.</p>",
      category: "Blog",
      status: "published",
      views: 95,
    },
  ],
  randomPosts: [
    {
      title: "Midnight Coffee and Fleeting Epiphanies",
      content:
        "<p>It is 2:15 AM. The coffee is lukewarm, but the city outside is completely still. Sometimes the most honest ideas strike when the rest of the world is asleep.</p><p>Thoughts drift without a map, and perhaps that is where true imagination lives.</p>",
      category: "Random",
      status: "published",
      views: 42,
    },
    {
      title: "Late Night Musings on Stargazing",
      content:
        "<p>Looking up at the night sky always puts everything into perspective. Light that traveled millions of years to reach our retinas reminding us that our daily anxieties are infinitesimally small in the grand cosmic dance.</p>",
      category: "Random",
      status: "published",
      views: 57,
    },
    {
      title: "Rainy Sunday Playlists",
      content:
        "<p>Lo-fi beats, gentle piano keys, and acoustic cello strings. There's a particular frequency of rain on a tin roof that makes any song sound twice as nostalgic.</p>",
      category: "Random",
      status: "published",
      views: 39,
    },
    {
      title: "The Habit of People Watching",
      content:
        "<p>Sitting at an outdoor cafe observing commuters rushing by. Each person is the main protagonist of their own sprawling drama, carrying burdens, hopes, and secrets nobody around them will ever know.</p>",
      category: "Random",
      status: "published",
      views: 61,
    },
    {
      title: "Notebook Hoarding Confessions",
      content:
        "<p>I bought another leather-bound notebook today. Do I have seven unfinished ones at home? Yes. Did this one have uniquely smooth 120gsm cream paper that practically begged for fountain pen ink? Absolutely.</p>",
      category: "Random",
      status: "published",
      views: 48,
    },
  ],
};

async function main() {
  console.log("🌱 Starting smart seeding: 5 stories with exactly 3 chapters each (15 chapters total)...\n");

  // 1. Admin Account
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

  // 2. Stories & 3 Chapters each (5 Stories, 15 Chapters total)
  console.log(`\n📖 [2/4] Checking Category: Stories & Chapters (${SEED_DATA.stories.length} stories x 3 chapters each)...`);
  for (const storyData of SEED_DATA.stories) {
    let targetStory = await prisma.story.findFirst({
      where: { title: storyData.title },
    });

    if (targetStory) {
      console.log(`   ℹ️  Story '${targetStory.title}' already exists (ID: ${targetStory.id}). Checking chapters...`);
    } else {
      targetStory = await prisma.story.create({
        data: {
          title: storyData.title,
          desc: storyData.desc,
          genre: storyData.genre,
          tags: storyData.tags,
          views: storyData.views,
          totalChapters: storyData.chapters.length,
        },
      });
      console.log(`   ✅ Story '${targetStory.title}' created (ID: ${targetStory.id}).`);
    }

    // Chapters under story
    for (const chap of storyData.chapters) {
      const existingChap = await prisma.chapter.findFirst({
        where: {
          storyId: targetStory.id,
          title: chap.title,
        },
      });

      if (existingChap) {
        console.log(`      ℹ️  Chapter '${existingChap.title}' already exists (ID: ${existingChap.id}). Skipping.`);
      } else {
        const newChap = await prisma.chapter.create({
          data: {
            storyId: targetStory.id,
            title: chap.title,
            content: chap.content,
            views: chap.views,
          },
        });
        console.log(`      ✅ Chapter '${newChap.title}' created (ID: ${newChap.id}).`);
      }
    }

    // Update totalChapters count
    const totalCount = await prisma.chapter.count({
      where: { storyId: targetStory.id },
    });
    await prisma.story.update({
      where: { id: targetStory.id },
      data: { totalChapters: totalCount },
    });
  }

  // 3. Blog Posts (5 posts)
  console.log(`\n✍️  [3/4] Checking Category: Blog Posts (${SEED_DATA.blogPosts.length} posts)...`);
  for (const blogData of SEED_DATA.blogPosts) {
    const existingBlog = await prisma.post.findFirst({
      where: {
        category: "Blog",
        title: blogData.title,
      },
    });

    if (existingBlog) {
      console.log(`   ℹ️  Blog post '${existingBlog.title}' already exists (ID: ${existingBlog.id}). Skipping.`);
    } else {
      const newBlog = await prisma.post.create({
        data: blogData,
      });
      console.log(`   ✅ Blog post '${newBlog.title}' created successfully (ID: ${newBlog.id}).`);
    }
  }

  // 4. Random Thoughts Posts (5 posts)
  console.log(`\n💭 [4/4] Checking Category: Random Thoughts Posts (${SEED_DATA.randomPosts.length} posts)...`);
  for (const randomData of SEED_DATA.randomPosts) {
    const existingRandom = await prisma.post.findFirst({
      where: {
        category: "Random",
        title: randomData.title,
      },
    });

    if (existingRandom) {
      console.log(`   ℹ️  Random post '${existingRandom.title}' already exists (ID: ${existingRandom.id}). Skipping.`);
    } else {
      const newRandom = await prisma.post.create({
        data: randomData,
      });
      console.log(`   ✅ Random thoughts post '${newRandom.title}' created successfully (ID: ${newRandom.id}).`);
    }
  }

  console.log("\n✨ Smart seeding process completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
