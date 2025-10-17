import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
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
