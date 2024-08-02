"use client";
import { RangeLineProps } from "@/interface";
import style from "@/styles/rangLine.module.scss";
import React, { useEffect, useState } from "react";

const RangeLine: React.FC<RangeLineProps> = ({ val }) => {
  const [value, setValue] = useState<number>(val);

  useEffect(() => {
    setValue(val);
  }, [val]);

  // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setValue(Number(event.target.value));
  // };

  return (
    <div className={`${style.timelineContainer} w-full text-slate-900`}>
      <input
        type="range"
        min="1950"
        max="2021"
        value={value}
        // onChange={handleInputChange}
        className={`${style.timelineSlider} w-full`}
      />
      <div className={style.tickMarks}>
        {Array.from({ length: 72 }, (_, i) => (
          <div key={i} className={style.tickMark}></div>
        ))}
      </div>
      <div className={style.timelineLabels}>
        {Array.from({ length: 8 }, (_, i) => 1950 + i * 10).map((year) => (
          <span key={year} className={`${style.timelineLabel} text-slate-900`}>
            {year}
          </span>
        ))}
        <span className={`${style.timelineLabel} text-slate-900`}>2021</span>
      </div>
      <div
        className={`${style.triangle} text-slate-600`}
        style={{ left: `${((value - 1950) / 72) * 100}%` }}
      >
        ▼
      </div>
    </div>
  );
};

export default RangeLine;
