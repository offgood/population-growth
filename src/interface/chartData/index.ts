interface FormattedResult {
  Country: string;
  Year: number;
  Population: number;
}

interface GroupedByYear {
  [year: number]: FormattedResult[];
}

export type { FormattedResult, GroupedByYear };
