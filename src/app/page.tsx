import { Mychart } from "@/conponents";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white">
      <div className="flex flex-col shadow shadow-lg px-4 py-8 w-full">
        <div className="text-slate-900 text-2xl font-bold">
          Population growth per country, 1950 to 2021
        </div>
        <div className="text-slate-400 text-xl font-bold">
          Click on the legend below to filter by continent
        </div>
        <div className="w-full">
          <Mychart />
        </div>
      </div>
    </main>
  );
}
