export interface RevenueExtract {
  year: string;
  organization: string;
  month: string;
  receiverId: string;
  netValue: number;
}

export interface RevenueData {
  id: string;
  organization: string;
  months: { [month: string]: { [receiverId: string]: number } };
}
