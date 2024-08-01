import path from "path";
import fs from "fs";
import csv from "csv-parser";
import { NextResponse } from "next/server";
import { GroupedByYear } from "@/interface";
import { countryToCode } from "@/util/countryToCode";
// import iso from "iso-3166-1";

async function GET() {
  const filePath = path.join(
    process.cwd(),
    "src/assets/csv/population-and-demography.csv"
  );

  const results: any[] = [];

  const csvData = new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve())
      .on("error", (error) => reject(error));
  });

  await csvData;

  const byYear = results.reduce<GroupedByYear>((acc, current) => {
    const year = current["Year"];
    const country = current["Country name"];
    const population = parseInt(current["Population"]);

    if (!acc[year]) {
      acc[year] = {};
    }

    // Filter country
    else if (
      acc[year] &&
      country !== "World" &&
      country.indexOf("UN") == -1 &&
      country.indexOf("countries") == -1 &&
      country.indexOf("income") == -1 &&
      country.indexOf("developed") == -1
    ) {
      const shortness = countryToCode[country as keyof typeof countryToCode];

      if (!acc[year][country]) {
        acc[year][country] = {
          value: population,
          bulletSettings: "",
        };
      }
      acc[year][country].value = population;
      acc[year][
        country
      ].bulletSettings = `https://public.flourish.studio/country-flags/svg/${shortness?.toLowerCase()}.svg`;
    }

    return acc;
  }, {});

  // Limit data to 12 countries per year
  for (const year in byYear) {
    const countries = Object.entries(byYear[year]);
    countries.sort(([, popA], [, popB]) => popB.value - popA.value);
    if (countries.length > 12) {
      byYear[year] = Object.fromEntries(countries.slice(0, 12));
    }
  }

  return NextResponse.json({
    message: "Data retrieved successfully",
    data: byYear,
  });
}

async function POST() {
  return NextResponse.json({
    code: 400,
    message: "Error POST Data",
  });
}

export { GET, POST };
