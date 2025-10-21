export async function GET() {
  try {
    const response = await fetch(
      "https://data.gov.il/api/3/action/datastore_search?" +
        new URLSearchParams({
          resource_id: "b7cf8f14-64a2-4b33-8d4b-edb286fdbd37",
          limit: "1500", // Get all cities (there are ~1273 cities)
        }),
      {
        next: { revalidate: 86400 }, // Cache for 24 hours
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch cities from data.gov.il");
    }

    const data = await response.json();

    // Arabic name mapping for major cities
    const arabicNames: Record<string, string> = {
      ירושלים: "القدس",
      "תל אביב-יפו": "تل أبيب-يافا",
      חיפה: "حيفا",
      "באר שבע": "بئر السبع",
      נצרת: "الناصرة",
      עכו: "عكا",
      לוד: "اللد",
      רמלה: "الرملة",
      יפו: "يافا",
      חדרה: "الخضيرة",
      אשדוד: "أشدود",
      אשקלון: "عسقلان",
      רחובות: "رحوفوت",
      "פתח תקווה": "بيتح تكفا",
      "ראשון לציון": "ريشون لتسيون",
      "בני ברק": "بني براك",
      נתניה: "نتانيا",
      טבריה: "طبريا",
      צפת: "صفد",
      עפולה: "العفولة",
      אילת: "إيلات",
      דימונה: "ديمونا",
    };

    // Transform the data to a simpler format
    const cities = data.result.records.map((city: any) => {
      const hebrewName = city["שם_ישוב"] || city["name"];
      return {
        name: hebrewName, // Hebrew name
        englishName: city["שם_ישוב_לועזי"] || city["name_en"], // English name
        arabicName: arabicNames[hebrewName] || null, // Arabic name if available
        code: city["סמל_ישוב"] || city["symbol"],
      };
    });

    // Sort alphabetically by Hebrew name
    cities.sort((a: any, b: any) => a.name.localeCompare(b.name, "he"));

    return Response.json({
      cities,
      total: data.result.total,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching cities:", error);
    return Response.json(
      { error: "Failed to fetch cities", success: false },
      { status: 500 }
    );
  }
}
