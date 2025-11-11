import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const firstNames = [
  "John",
  "Sarah",
  "Michael",
  "Emma",
  "David",
  "Lisa",
  "James",
  "Maria",
  "Robert",
  "Jennifer",
  "William",
  "Linda",
  "Richard",
  "Patricia",
  "Thomas",
];
const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
];
const companies = [
  "BuildCo",
  "HomeFix Pro",
  "Elite Services",
  "QuickRepair",
  "Master Builders",
  "Premium Works",
  "City Services",
  "ProCraft",
  "Skilled Hands",
  "TrustWorkers",
];
const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const areasOfExpertise = [
  "אינסטלציה", // Plumbing
  "חשמל", // Electrical
  "נגרות", // Carpentry
  "צביעה", // Painting
  "ריצוף", // Tiling
  "גבס", // Drywall
  "מיזוג אוויר", // Air conditioning
  "אלומיניום", // Aluminum
  "נקיון", // Cleaning
  "גינון", // Gardening
  "איטום", // Sealing/Waterproofing
  "הסעות", // Transportation
  "שיפוצים כלליים", // General renovations
  "ריהוט", // Furniture
  "זכוכית", // Glass
  "מסגרות", // Metalwork
  "הובלות", // Moving
  "חימום תת רצפתי", // Underfloor heating
  "גגות", // Roofing
  "פרגולות", // Pergolas
];
async function main() {
  // for (let i = 0; i < 15; i++) {
  //   const firstName = firstNames[i];
  //   const lastName = lastNames[i];
  //   const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;

  //   // Random off days (0-2 days)
  //   const numOffDays = Math.floor(Math.random() * 3);
  //   const shuffledDays = [...daysOfWeek].sort(() => Math.random() - 0.5);
  //   const offDays = shuffledDays.slice(0, numOffDays);
  //   const numAreas = Math.floor(Math.random() * 4) + 1;
  //   const shuffledAreas = [...areasOfExpertise].sort(() => Math.random() - 0.5);
  //   const workerAreas = shuffledAreas.slice(0, numAreas);
  //   // Random start and end times
  //   const startHour = 6 + Math.floor(Math.random() * 4); // 6-9 AM
  //   const endHour = 16 + Math.floor(Math.random() * 4); // 4-7 PM
  //   const startTime = `${startHour.toString().padStart(2, "0")}:00`;
  //   const endTime = `${endHour.toString().padStart(2, "0")}:00`;

  //   // Random years of experience
  //   const yearsExperience = Math.floor(Math.random() * 20) + 1; // 1-20 years

  //   // Random max work distance
  //   const distances = [
  //     "5 km",
  //     "10 km",
  //     "15 km",
  //     "20 km",
  //     "25 km",
  //     "30 km",
  //     "50 km",
  //   ];
  //   const maxWorkDistance =
  //     distances[Math.floor(Math.random() * distances.length)];

  //   // Create user and worker
  //   await prisma.user.create({
  //     data: {
  //       email,
  //       firstName,
  //       lastName,
  //       clerkId: `worker${i + 1}`,
  //       role: "WORKER",
  //       worker: {
  //         create: {
  //           offDays,
  //           startTime,
  //           areasOfExperience: workerAreas,
  //           endTime,
  //           companyName:
  //             i % 3 === 0
  //               ? companies[Math.floor(Math.random() * companies.length)]
  //               : null,
  //           yearsExperience: `${yearsExperience}`,
  //           availableToWork: Math.random() > 0.2, // 80% available
  //           maxWorkDistance,
  //         },
  //       },
  //     },
  //   });

  //   console.log(`Created worker ${i + 1}: ${firstName} ${lastName}`);
  // }

  // console.log("Seed completed successfully!");
  const workerCategories = [
    {
      translations: {
        create: [
          { language: "he", name: "שרברב" },
          { language: "ar", name: "سباك" },
          { language: "en", name: "Plumber" },
        ],
      },
    },
    {
      translations: {
        create: [
          { language: "he", name: "חשמלאי" },
          { language: "ar", name: "كهربائي" },
          { language: "en", name: "Electrician" },
        ],
      },
    },
    {
      translations: {
        create: [
          { language: "he", name: "נגר" },
          { language: "ar", name: "نجار" },
          { language: "en", name: "Carpenter" },
        ],
      },
    },
    {
      translations: {
        create: [
          { language: "he", name: "צבע" },
          { language: "ar", name: "دهان" },
          { language: "en", name: "Painter" },
        ],
      },
    },
    {
      translations: {
        create: [
          { language: "he", name: "טכנאי מזגנים" },
          { language: "ar", name: "فني تكييف" },
          { language: "en", name: "HVAC Technician" },
        ],
      },
    },
    {
      translations: {
        create: [
          { language: "he", name: "בנאי" },
          { language: "ar", name: "بناء" },
          { language: "en", name: "Mason" },
        ],
      },
    },
    {
      translations: {
        create: [
          { language: "he", name: "גנן" },
          { language: "ar", name: "بستاني" },
          { language: "en", name: "Gardener" },
        ],
      },
    },
    {
      translations: {
        create: [
          { language: "he", name: "מנעולן" },
          { language: "ar", name: "صانع أقفال" },
          { language: "en", name: "Locksmith" },
        ],
      },
    },
    {
      translations: {
        create: [
          { language: "he", name: "מנקה" },
          { language: "ar", name: "عامل نظافة" },
          { language: "en", name: "Cleaner" },
        ],
      },
    },
    {
      translations: {
        create: [
          { language: "he", name: "טכנאי מכונות כביסה" },
          { language: "ar", name: "فني غسالات" },
          { language: "en", name: "Appliance Repair Technician" },
        ],
      },
    },
    {
      translations: {
        create: [
          { language: "he", name: "גגן" },
          { language: "ar", name: "عامل أسقف" },
          { language: "en", name: "Roofer" },
        ],
      },
    },
    {
      translations: {
        create: [
          { language: "he", name: "רצף" },
          { language: "ar", name: "بلاط" },
          { language: "en", name: "Tiler" },
        ],
      },
    },
    {
      translations: {
        create: [
          { language: "he", name: "מרתק" },
          { language: "ar", name: "لحام" },
          { language: "en", name: "Welder" },
        ],
      },
    },
    {
      translations: {
        create: [
          { language: "he", name: "טכנאי מעליות" },
          { language: "ar", name: "فني مصاعد" },
          { language: "en", name: "Elevator Technician" },
        ],
      },
    },
    {
      translations: {
        create: [
          { language: "he", name: "מתקין חלונות" },
          { language: "ar", name: "مركب نوافذ" },
          { language: "en", name: "Window Installer" },
        ],
      },
    },
    {
      translations: {
        create: [
          { language: "he", name: "חוטר ביוב" },
          { language: "ar", name: "تنظيف مجاري" },
          { language: "en", name: "Drain Cleaner" },
        ],
      },
    },
    {
      translations: {
        create: [
          { language: "he", name: "מוביל" },
          { language: "ar", name: "نقال" },
          { language: "en", name: "Mover" },
        ],
      },
    },
    {
      translations: {
        create: [
          { language: "he", name: "טכנאי בריכות" },
          { language: "ar", name: "فني برك سباحة" },
          { language: "en", name: "Pool Technician" },
        ],
      },
    },
    {
      translations: {
        create: [
          { language: "he", name: "מדביר" },
          { language: "ar", name: "مكافح حشرات" },
          { language: "en", name: "Pest Control" },
        ],
      },
    },
    {
      translations: {
        create: [
          { language: "he", name: "מתקין פרגולות" },
          { language: "ar", name: "مركب برجولات" },
          { language: "en", name: "Pergola Installer" },
        ],
      },
    },
  ];
  for (const category of workerCategories) {
    await prisma.category.create({
      data: category,
    });
  }
}
main().finally(() => prisma.$disconnect());
