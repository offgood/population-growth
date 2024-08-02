import React from "react";

// Define the regions and their corresponding colors
const regions = [
  { name: "Asia", color: "#5636D0" },
  { name: "Europe", color: "#7B56E3" },
  { name: "Africa", color: "#FF6F8E" },
  { name: "Oceania", color: "#FF9E00" },
  { name: "Americas", color: "#FFB85C" },
];

const RegionLegend: React.FC = () => {
  return (
    <div className="flex items-center justify-between" style={{ width: "26%" }}>
      <strong className="mr-2">Region</strong>
      {regions.map((region) => (
        <div
          key={region.name}
          className="flex items-center mr-4 justify-between"
        >
          <div
            style={{ width: "15px", height: "15px", background: region.color }}
          ></div>
          <span>{region.name}</span>
        </div>
      ))}
    </div>
  );
};

export default RegionLegend;
