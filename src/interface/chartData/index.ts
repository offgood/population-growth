interface FormattedResult {
  [country: string]: {
    value: number;
    bulletSettings: string;
  };
}

interface GroupedByYear {
  [year: number]: FormattedResult;
}

export type { FormattedResult, GroupedByYear };
