import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const courses = [
  {
    slug: "smc",
    title: "SMC",
    category: "Online Course",
    level: "Online",
    description: "Smart Money Concepts training for market structure, liquidity, entries, exits, and risk discipline.",
    duration: "Online access",
    mode: "Online",
    price: 9999,
    originalPrice: 9999,
    thumbnail: "/pankaj-yadav-founder-new.png",
    enrollmentCount: 1850,
  },
  {
    slug: "intraday-stock-selection",
    title: "Intraday Stock Selection",
    category: "Online Course",
    level: "Online",
    description: "A focused course on finding stronger intraday stocks, planning levels, and avoiding random trades.",
    duration: "Online access",
    mode: "Online",
    price: 4999,
    originalPrice: 4999,
    thumbnail: "/pankaj-yadav-founder-new.png",
    enrollmentCount: 1240,
  },
  {
    slug: "price-action-mastery",
    title: "Price Action Mastery",
    category: "Online Course",
    level: "Online",
    description: "Learn candlesticks, trends, support, resistance, breakouts, retests, and clean trade planning.",
    duration: "Online access",
    mode: "Online",
    price: 9999,
    originalPrice: 9999,
    thumbnail: "/pankaj-yadav-founder-new.png",
    enrollmentCount: 2110,
  },
  {
    slug: "secret-strategy",
    title: "Secret Strategy",
    category: "Online Course",
    level: "Online",
    description: "A compact strategy program focused on rules, confirmation, risk control, and repeatable execution.",
    duration: "Online access",
    mode: "Online",
    price: 3999,
    originalPrice: 3999,
    thumbnail: "/pankaj-yadav-founder-new.png",
    enrollmentCount: 960,
  },
  {
    slug: "crypto-forex",
    title: "Crypto + Forex",
    category: "Online Course",
    level: "Online",
    description: "Market structure, risk management, and practical chart reading for crypto and forex learners.",
    duration: "Online access",
    mode: "Online",
    price: 14999,
    originalPrice: 14999,
    thumbnail: "/pankaj-yadav-founder-new.png",
    enrollmentCount: 780,
  },
  {
    slug: "indian-market",
    title: "Indian",
    category: "Online Course",
    level: "Online",
    description: "Indian market education covering stocks, derivatives context, levels, and disciplined learning.",
    duration: "Online access",
    mode: "Online",
    price: 15000,
    originalPrice: 15000,
    thumbnail: "/pankaj-yadav-founder-new.png",
    enrollmentCount: 1350,
  },
  {
    slug: "all-in-one-online",
    title: "All In One",
    category: "Online + Offline Course",
    level: "Online + Offline",
    description: "Complete online and offline market training across SMC, price action, stock selection, strategy, crypto, forex, and Indian markets.",
    duration: "Online access + classroom mentorship",
    mode: "Online + Offline",
    price: 25000,
    originalPrice: 25000,
    thumbnail: "/pankaj-yadav-founder-new.png",
    enrollmentCount: 2480,
  },
];
const commonCurriculum = [
  {
    module: "Market Orientation",
    lessons: ["Indian market structure", "NSE/BSE instruments", "Trading account setup", "Risk journal template"],
  },
  {
    module: "Chartcraft",
    lessons: ["Candlesticks and volume", "Support and resistance", "Trend and range playbooks", "Multi-timeframe analysis"],
  },
  {
    module: "Execution Lab",
    lessons: ["Pre-market checklist", "Position sizing", "Trade management", "Review and improvement loop"],
  },
];

const learnings = [
  "Read Indian equity charts with a professional market structure lens",
  "Build a daily trading plan around risk-first execution",
  "Identify high-probability support, resistance, and target zones",
  "Maintain a trade journal and review system that improves decision-making",
];

const faqs = [
  { question: "Do I need prior market experience?", answer: "No. Beginner tracks start with market structure; advanced tracks assume basic chart familiarity." },
  { question: "Can I attend online?", answer: "Most courses include online access. Offline sessions are held at SCO 104, second floor, OMAXE WORLD STREET, Sector 79, Faridabad, Haryana 121004 where listed." },
  { question: "Do I get a certificate?", answer: "Yes, successful learners receive a StockWallah completion certificate where applicable." },
];

const blogs = [
  {
    slug: "what-is-nism",
    title: "What is NISM and Why It Matters for Market Professionals",
    excerpt: "A practical guide to NISM certifications, who needs them, and how they strengthen credibility in Indian markets.",
    category: "Certification",
    readMinutes: 5,
    content:
      "NISM certifications are industry-recognized credentials for market intermediaries and serious learners in India. For traders, advisors, and aspiring professionals, the certification process creates a structured understanding of products, regulations, risk disclosures, and ethical conduct. A certification does not guarantee trading profits, but it raises the quality of decision-making and client communication. StockWallah uses practical, educational learning paths so students understand both market opportunity and market responsibility.",
  },
  {
    slug: "top-5-candlestick-patterns",
    title: "Top 5 Candlestick Patterns Every Trader Should Know",
    excerpt: "Five price action signals that become useful only when combined with context, trend, volume, and risk.",
    category: "Technical Analysis",
    readMinutes: 7,
    content:
      "Candlestick patterns are not magic signals. They are visual summaries of buyer and seller behavior. Engulfing candles, hammers, shooting stars, inside bars, and strong marubozu candles can help traders spot momentum shifts. The real edge appears when these patterns form at meaningful levels, with volume confirmation and a defined invalidation point. A trader should always ask: where is the pattern forming, what is the market context, and what is the risk if the reading is wrong?",
  },
  {
    slug: "how-to-read-a-stock-chart",
    title: "How to Read a Stock Chart Like a Professional",
    excerpt: "Learn the hierarchy of trend, structure, volume, and timeframe alignment before placing a trade.",
    category: "Charts",
    readMinutes: 6,
    content:
      "A professional chart reading process starts from higher timeframe trend and moves down into execution detail. First identify whether price is trending, ranging, or transitioning. Then map major support and resistance, check volume around breakouts or breakdowns, and compare relative strength against the index. Only after this sequence should a trader plan entry, stoploss, target, and position size. The chart is a decision map, not a prediction machine.",
  },
  {
    slug: "options-risk-management",
    title: "Risk Management for Options Traders",
    excerpt: "Options offer leverage, but every strategy needs maximum loss awareness and adjustment rules before entry.",
    category: "Options",
    readMinutes: 8,
    content:
      "Options trading becomes dangerous when traders focus on premium movement without understanding Greeks and expiry behavior. Risk management starts with defined maximum loss, realistic lot sizing, and clarity about whether the trade benefits from direction, volatility, or time decay. Spreads, hedges, and stop rules help reduce emotional decisions. The best options traders are not aggressive every day; they are selective when risk-reward and market regime align.",
  },
  {
    slug: "pre-market-routine",
    title: "A 20-Minute Pre-Market Routine for Nifty and Bank Nifty",
    excerpt: "A concise routine for levels, gap context, global cues, sector leadership, and no-trade zones.",
    category: "Market Routine",
    readMinutes: 4,
    content:
      "A strong pre-market routine prevents random trading. Review global indices, SGX/GIFT Nifty cues, previous day high and low, CPR, major support and resistance, and sector momentum. Mark no-trade zones where risk-reward is poor. Decide before the open which levels matter and what invalidates the plan. The goal is not to predict every move; it is to avoid low-quality decisions when volatility rises.",
  },
  {
    slug: "position-sizing-basics",
    title: "Position Sizing Basics for Retail Traders",
    excerpt: "Your lot size should come from risk per trade, not confidence or excitement.",
    category: "Risk",
    readMinutes: 5,
    content:
      "Position sizing is the bridge between analysis and survival. A trader can be right about direction and still lose badly if the position is too large. Decide a fixed percentage or rupee amount of account risk per trade, calculate the distance to stoploss, and size accordingly. This creates consistency across different setups. Confidence is not a sizing system; risk is.",
  },
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "stockwallahtradingacademy@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!process.env.ADMIN_PASSWORD_HASH && !adminPassword) {
    throw new Error("ADMIN_PASSWORD or ADMIN_PASSWORD_HASH is required for seeding the admin user.");
  }
  const passwordHash = process.env.ADMIN_PASSWORD_HASH || (await bcrypt.hash(adminPassword!, 12));

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash, name: "StockWallah Admin" },
    create: { email: adminEmail, passwordHash, name: "StockWallah Admin" },
  });

  await prisma.course.updateMany({
    where: { slug: { notIn: courses.map((course) => course.slug) } },
    data: { active: false },
  });

  for (const course of courses) {
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: {
        ...course,
        active: true,
        curriculum: commonCurriculum,
        learnings,
        faqs,
      },
      create: {
        ...course,
        active: true,
        curriculum: commonCurriculum,
        learnings,
        faqs,
      },
    });
  }

  const settings = {
    whatsappNumber: process.env.WHATSAPP_NUMBER || "8796048066",
    youtubeChannelId: process.env.YOUTUBE_CHANNEL_ID || "UCxxxxxxxxxxxxxxxxxxxxxxxx",
    youtubeUrl: process.env.YOUTUBE_URL || "https://youtube.com/@stockwallahtradingacademy?si=Wt2kTV8YzowHVuFg",
    announcementText: "New Batch Starting June 1st — Limited Seats! Enroll Now",
    adminEmail,
    contactEmail: "stockwallahtradingacademy@gmail.com",
    address: "SCO 104, second floor, OMAXE WORLD STREET, Sector 79, Faridabad, Haryana 121004",
    mapLink: "https://maps.app.goo.gl/gsWiX3QJkSsP7VUY6",
    linkedinUrl: process.env.LINKEDIN_URL || "https://www.linkedin.com/in/stocks-wallah-trading-academy-undefined-63a71b41b/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BsQWpwNhvS%2Fm0a3QME09JJw%3D%3D",
    instagramUrl: process.env.INSTAGRAM_URL || "https://www.instagram.com/stockwallah_trading_academy?igsh=NnZoYmw3amF5dDZ4",
    facebookUrl: process.env.FACEBOOK_URL || "https://www.facebook.com/share/19FHjLM5Am/",
    telegramUrl: process.env.TELEGRAM_URL || "https://t.me/stockwallahacademy",
    playStoreUrl: process.env.PLAY_STORE_URL || "https://play.google.com/store/apps/details?id=com.lct.nbtcgqrtd",
    appStoreUrl: process.env.APP_STORE_URL || "",
    logoImage: "/stockwallah-logo.png",
    homeHeroImage: "/home-hero-exact.png",
    founderImage: "/pankaj-yadav-founder-new.png",
    anshulImage: "/team/anshul-yadav.png",
    deepAryaImage: "/team/deep-arya.png",
    upiQrImage: "/upi-qr.png",
    courseFallbackImage: "/pankaj-yadav-founder-new.png",
  };

  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  for (const post of blogs) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }

  const testimonials = [
    {
      name: "Ritika Sharma",
      course: "Price Action Mastery",
      outcome: "Built a structured swing trading routine",
      quote: "StockWallah turned chart reading from guesswork into a repeatable process. The daily levels review changed how I plan risk.",
      rating: 5,
    },
    {
      name: "Aman Verma",
      course: "SMC",
      outcome: "Moved to cleaner entries with defined risk",
      quote: "The SMC module is serious and practical. I finally understood why position sizing matters more than prediction.",
      rating: 5,
    },
    {
      name: "Neha Arora",
      course: "Intraday Stock Selection",
      outcome: "Started planning intraday trades with a checklist",
      quote: "The stock selection process helped me stop chasing random moves. The classes were clear, premium, and disciplined.",
      rating: 5,
    },
  ];
  for (const testimonial of testimonials) {
    const existing = await prisma.testimonial.findFirst({ where: { name: testimonial.name } });
    if (existing) {
      await prisma.testimonial.update({ where: { id: existing.id }, data: testimonial });
    } else {
      await prisma.testimonial.create({ data: testimonial });
    }
  }

  await prisma.youtubeSchedule.createMany({
    data: [
      { title: "Pre-market Levels Room", scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), youtubeLink: "https://youtube.com/@stockwallahtradingacademy?si=Wt2kTV8YzowHVuFg" },
      { title: "Options Expiry Risk Clinic", scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), youtubeLink: "https://youtube.com/@stockwallahtradingacademy?si=Wt2kTV8YzowHVuFg" },
    ],
    skipDuplicates: true,
  });

  const symbols = ["NIFTY", "BANKNIFTY"];
  const baseBySymbol: Record<string, number> = { NIFTY: 24200, BANKNIFTY: 52200 };
  for (let day = 0; day < 7; day += 1) {
    const date = new Date();
    date.setDate(date.getDate() - day);
    date.setHours(0, 0, 0, 0);

    for (const symbol of symbols) {
      const base = baseBySymbol[symbol] + (6 - day) * (symbol === "NIFTY" ? 18 : 55);
      const levels = [
        { price: base + 240, type: "Strong Resistance", target: base - 20, sl: base + 330, hitType: day % 3 === 0 ? "target" : null },
        { price: base + 120, type: "Resistance", target: base + 40, sl: base + 190, hitType: day % 4 === 0 ? "stoploss" : "target" },
        { price: base, type: "CPR", target: base + 90, sl: base - 70, hitType: day % 2 === 0 ? "target" : null },
        { price: base - 110, type: "Support", target: base + 20, sl: base - 180, hitType: day % 5 === 0 ? "stoploss" : "target" },
        { price: base - 250, type: "Strong Support", target: base - 60, sl: base - 330, hitType: day % 2 === 1 ? "target" : null },
      ];

      for (const [index, level] of levels.entries()) {
        const existing = await prisma.tradingLevel.findFirst({
          where: { date, symbol, levelPrice: level.price },
        });
        const data = {
          date,
          symbol,
          levelPrice: level.price,
          levelType: level.type,
          targetPrice: level.target,
          stoplossPrice: level.sl,
          notes: index === 2 ? "Central pivot range zone" : index % 2 === 0 ? "Previous day reaction area" : "Intraday liquidity level",
          isHit: Boolean(level.hitType),
          hitType: level.hitType,
          hitTime: level.hitType ? new Date(date.getTime() + (10 + index) * 60 * 60 * 1000 + 42 * 60 * 1000) : null,
        };
        if (existing) {
          await prisma.tradingLevel.update({ where: { id: existing.id }, data });
        } else {
          await prisma.tradingLevel.create({ data });
        }
      }
    }
  }

  console.log("Seed complete: admin, courses, levels, testimonials, blog posts, settings.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
