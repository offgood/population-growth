interface IFormattedResult {
  [country: string]: {
    value: number;
    bulletSettings: string;
  };
}

interface IGroupedByYear {
  [year: number]: IFormattedResult;
}

interface IRangeLineProps {
  val: number;
}

interface IStartStop {
  onStop: () => void;
  onStart: () => void;
}

export type { IFormattedResult, IGroupedByYear, IRangeLineProps, IStartStop };
