export type Course = {
  slug: string;
  title: string;
  category: string;
  level: string;
  description: string; // Updated description for the course
  duration: string;
  mode: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  students: number;
  lessons: number;
};

export const academyMeta = {
  title: "StockWallah — Practical Stock Market Academy",
  description:
    "StockWallah Academy simplifies stock market trading and investing through structured, practical financial education focused on discipline, risk management, and real-market application.",
  keywords:
    "stock market academy, trading education, investing education, risk management, stock market classes Faridabad, practical financial education"
};

export const academyMission =
  "To make financial education simple, practical, and accessible for everyone through structured learning and real-market discipline.";

export const academyVision =
  "To provide practical, real-market-based financial education that empowers individuals to become confident traders and investors.";

export const academyDisclaimer =
  "We are not SEBI registered Research Analysts (RA). We do not provide tips, calls, advisory services, or guaranteed returns. All content is strictly for educational purposes only, and trading and investing involve risk.";

export const contactInfo = {
  phoneDisplay: "+91 87960 48066",
  phoneLink: "+918796048066",
  whatsappNumber: "8796048066",
  upiId: "stockwallah@idfcbank",
  upiPayUri: "upi://pay?pa=stockwallah@idfcbank&pn=StockWallah%20Trading%20Academy&cu=INR",
  // Place your supplied UPI QR image under `frontend/public/upi-qr.png` and it will be used here
  upiQrImage: "/upi-qr.png",
  email: "stockwallahtradingacademy@gmail.com",
  address:
    "SCO 104, second floor, OMAXE WORLD STREET, Sector 79, Faridabad, Haryana 121004",
  addressShort: "SCO 104, second floor, OMAXE WORLD STREET, Sector 79, Faridabad, Haryana 121004",
  mapQuery: "SCO 104, second floor, OMAXE WORLD STREET, Sector 79, Faridabad, Haryana 121004",
  mapLink: "https://maps.app.goo.gl/gsWiX3QJkSsP7VUY6"
};

export const socialLinks = {
  linkedin: "https://www.linkedin.com/in/stocks-wallah-trading-academy-undefined-63a71b41b/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BsQWpwNhvS%2Fm0a3QME09JJw%3D%3D",
  instagram: "https://www.instagram.com/stockwallah_trading_academy?igsh=NnZoYmw3amF5dDZ4",
  facebook: "https://www.facebook.com/share/19FHjLM5Am/",
  youtube: "https://youtube.com/@stockwallahtradingacademy?si=Wt2kTV8YzowHVuFg"
};

export const founderProfile = {
  name: "Pankaj Yadav Sir",
  role: "Founder",
  title: "Founder of StockWallah Academy",
  image: "/pankaj-yadav-founder-new.png",
  experience: "16-18 years of experience in the financial markets",
  summary:
    "Pankaj Yadav Sir leads StockWallah with practical market experience across equity, derivatives, wealth management, crypto, and forex.",
  learnersMentored: "1,700+ learners",
  focus: ["Equity", "Derivatives", "Wealth Management", "Crypto", "Forex"]
};

export const associateMentorProfile = {
  name: "Anshul Sir",
  role: "Associate Mentor",
  title: "Associate Mentor",
  image: "/team/anshul-yadav.png",
  certification: "NISM Series VIII - Equity Derivatives Certification",
  summary:
    "Anshul Sir supports learners with structured stock market, futures, and derivatives education focused on discipline and basics."
};

export const mentorProfile = {
  name: "Deep Arya Sir",
  role: "Mentor",
  title: "Mentor",
  image: "/team/deep-arya.png",
  summary:
    "Deep Arya Sir mentors traders in Smart Money Concepts, order flow, scalping, equity, derivatives, and crypto.",
  experience: ["5+ years in financial markets", "3 years in Equity and Derivatives", "200+ students mentored"],
  focus: ["Smart Money Concepts", "Order Flow", "Scalping", "Equity", "Derivatives", "Crypto"]
};

export const academyStats = [
  { value: "16-18 yrs", label: "Founder experience" },
  { value: "1,700+", label: "Learners mentored" },
  { value: "NISM VIII", label: "Associate mentor" },
  { value: "200+", label: "Students mentored" }
];

export const academyHighlights = [
  {
    title: "Founder-led learning",
    text: "Pankaj Yadav Sir leads the academy with long market experience across equity, derivatives, crypto, forex, and wealth management."
  },
  {
    title: "Structured mentorship",
    text: "Anshul Sir and Deep Arya Sir support beginners and advanced learners with practical, disciplined market education."
  },
  {
    title: "Risk-first approach",
    text: "Every learning track emphasizes position sizing, trade review, and disciplined execution over prediction."
  },
  {
    title: "Educational only",
    text: "The academy provides financial education and training, not tips, calls, or advisory services."
  }
];

export const academyPillars = ["Practical", "Risk-first", "Structured", "Consistent"];

export const courses: Course[] = [
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
    image: "/pankaj-yadav-founder-new.png",
    rating: 4.9,
    students: 1850,
    lessons: 28
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
    image: "/pankaj-yadav-founder-new.png",
    rating: 4.8,
    students: 1240,
    lessons: 18
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
    image: "/pankaj-yadav-founder-new.png",
    rating: 4.9,
    students: 2110,
    lessons: 32
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
    image: "/pankaj-yadav-founder-new.png",
    rating: 4.8,
    students: 960,
    lessons: 14
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
    image: "/pankaj-yadav-founder-new.png",
    rating: 4.9,
    students: 780,
    lessons: 36
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
    image: "/pankaj-yadav-founder-new.png",
    rating: 4.8,
    students: 1350,
    lessons: 34
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
    image: "/pankaj-yadav-founder-new.png",
    rating: 4.9,
    students: 2480,
    lessons: 72
  }
];


export const curriculum = [
  { module: "Market Orientation", lessons: ["Indian market structure", "NSE/BSE instruments", "Trading account setup", "Risk journal template"] },
  { module: "Chartcraft", lessons: ["Candlesticks and volume", "Support and resistance", "Trend and range playbooks", "Multi-timeframe analysis"] },
  { module: "Execution Lab", lessons: ["Pre-market checklist", "Position sizing", "Trade management", "Review and improvement loop"] }
];

export const testimonials = [
  {
    name: "Ritika Sharma",
    course: "Price Action Mastery",
    outcome: "Built a structured swing trading routine",
    quote: "StockWallah turned chart reading from guesswork into a repeatable process. The daily levels review changed how I plan risk.",
    rating: 5
  },
  {
    name: "Aman Verma",
    course: "SMC",
    outcome: "Moved to cleaner entries with defined risk",
    quote: "The SMC module is serious and practical. I finally understood why position sizing matters more than prediction.",
    rating: 5
  },
  {
    name: "Neha Arora",
    course: "Intraday Stock Selection",
    outcome: "Started planning intraday trades with a checklist",
    quote: "The stock selection process helped me stop chasing random moves. The classes were clear, premium, and disciplined.",
    rating: 5
  },
  {
    name: "Kunal Batra",
    course: "All In One",
    outcome: "Moved from impulsive entries to a documented trading plan",
    quote: "The mentor desk is where the process clicked. They care about what you do after the entry, not only the entry itself.",
    rating: 5
  },
  {
    name: "Simran Kaur",
    course: "Secret Strategy",
    outcome: "Started taking fewer but cleaner trades",
    quote: "The rules are simple and practical. Pehle main jaldi entry leti thi, ab setup confirm hone ka wait karti hoon.",
    rating: 5
  },
  {
    name: "Rohit Mehta",
    course: "Crypto + Forex",
    outcome: "Understood market structure across assets",
    quote: "Crypto aur forex charts pe same discipline apply karna seekha. Risk management wala part sabse useful laga.",
    rating: 5
  },
  {
    name: "Priya Nair",
    course: "SMC",
    outcome: "Improved entries around liquidity zones",
    quote: "The course helped me stop reacting to every candle. I now map liquidity first, then plan the trade.",
    rating: 5
  },
  {
    name: "Harsh Gupta",
    course: "All In One",
    outcome: "Built a complete daily trading routine",
    quote: "Basics se pro concepts tak flow clear hai. Doubts bhi practical examples se solve hote hain, random theory nahi.",
    rating: 5
  },
  {
    name: "Mehak Arora",
    course: "Intraday Stock Selection",
    outcome: "Learned how to shortlist stocks before market hours",
    quote: "Stock selection ka process clear ho gaya. Ab main market open hone ke baad panic mein trades nahi leti.",
    rating: 5
  }
];
export const blogPosts = [
  {
    slug: "what-is-nism",
    title: "What is NISM and Why It Matters for Market Professionals",
    excerpt: "A practical guide to NISM certifications, who needs them, and how they strengthen credibility in Indian markets.",
    category: "Certification",
    readMinutes: 5,
    content:
      "NISM certifications are industry-recognized credentials for market intermediaries and serious learners in India. For traders, advisors, and aspiring professionals, the certification process creates a structured understanding of products, regulations, risk disclosures, and ethical conduct. A certification does not guarantee trading profits, but it raises the quality of decision-making and client communication. StockWallah uses NISM-aligned learning paths so students understand both market opportunity and market responsibility."
  },
  {
    slug: "top-5-candlestick-patterns",
    title: "Top 5 Candlestick Patterns Every Trader Should Know",
    excerpt: "Five price action signals that become useful only when combined with context, trend, volume, and risk.",
    category: "Technical Analysis",
    readMinutes: 7,
    content:
      "Candlestick patterns are not magic signals. They are visual summaries of buyer and seller behavior. Engulfing candles, hammers, shooting stars, inside bars, and strong marubozu candles can help traders spot momentum shifts. The real edge appears when these patterns form at meaningful levels, with volume confirmation and a defined invalidation point."
  },
  {
    slug: "how-to-read-a-stock-chart",
    title: "How to Read a Stock Chart Like a Professional",
    excerpt: "Learn the hierarchy of trend, structure, volume, and timeframe alignment before placing a trade.",
    category: "Charts",
    readMinutes: 6,
    content:
      "A professional chart reading process starts from higher timeframe trend and moves down into execution detail. First identify whether price is trending, ranging, or transitioning. Then map major support and resistance, check volume around breakouts or breakdowns, and compare relative strength against the index."
  },
  {
    slug: "options-risk-management",
    title: "Risk Management for Options Traders",
    excerpt: "Options offer leverage, but every strategy needs maximum loss awareness and adjustment rules before entry.",
    category: "Options",
    readMinutes: 8,
    content:
      "Options trading becomes dangerous when traders focus on premium movement without understanding Greeks and expiry behavior. Risk management starts with defined maximum loss, realistic lot sizing, and clarity about whether the trade benefits from direction, volatility, or time decay."
  },
  {
    slug: "pre-market-routine",
    title: "A 20-Minute Pre-Market Routine for Nifty and Bank Nifty",
    excerpt: "A concise routine for levels, gap context, global cues, sector leadership, and no-trade zones.",
    category: "Market Routine",
    readMinutes: 4,
    content:
      "A strong pre-market routine prevents random trading. Review global indices, GIFT Nifty cues, previous day high and low, CPR, major support and resistance, and sector momentum. Mark no-trade zones where risk-reward is poor."
  },
  {
    slug: "position-sizing-basics",
    title: "Position Sizing Basics for Retail Traders",
    excerpt: "Your lot size should come from risk per trade, not confidence or excitement.",
    category: "Risk",
    readMinutes: 5,
    content:
      "Position sizing is the bridge between analysis and survival. A trader can be right about direction and still lose badly if the position is too large. Decide a fixed percentage or rupee amount of account risk per trade, calculate the distance to stoploss, and size accordingly."
  }
];

export const sectors = [
  { name: "Banking", change: 1.2 },
  { name: "IT", change: -0.8 },
  { name: "Auto", change: 0.5 },
  { name: "Pharma", change: 0.9 },
  { name: "FMCG", change: -0.2 },
  { name: "Metal", change: 1.6 }
];

export const logos = ["Practical", "Risk-first", "Structured", "Consistent"];
