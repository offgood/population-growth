"use client";
import Play from "@/assets/svg/play";
import Stop from "@/assets/svg/stop";
import { IStartStop } from "@/interface";
import React, { useState } from "react";

const StartStop: React.FC<IStartStop> = ({ onStop, onStart }) => {
  const [playChart, setPlayChart] = useState<boolean>(false);

  return (
    <div className="w-24" onClick={() => setPlayChart(!playChart)}>
      {playChart ? <Stop /> : <Stop />}
    </div>
  );
};

export default StartStop;
