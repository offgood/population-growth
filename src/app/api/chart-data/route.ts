import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { FormattedResult, GroupedByYear } from "@/interface";

async function GET() {
  const filePath = path.join(
    process.cwd(),
    "src/assets/csv/population-and-demography.csv"
  );

  const results: any[] = [];

  const promise = new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve())
      .on("error", (error) => reject(error));
  });

  await promise;

  const formattedResults: FormattedResult[] = results.map((row) => ({
    Country: row["Country name"],
    Year: row["Year"],
    Population: row["Population"],
  }));

  const byYear = formattedResults.reduce<GroupedByYear>((acc, current) => {
    const { Year, Country, Population } = current;
    if (!acc[Year]) {
      acc[Year] = [];
    }
    acc[Year].push({
      Country,
      Population,
      Year,
    });
    return acc;
  }, {});

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
