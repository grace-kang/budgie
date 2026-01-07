import { Month } from '../types';

export const getMonthFromDate = (dateStr: string, months: Month[]): Month | undefined => {
  const dateObj = new Date(dateStr);
  return months.find((m) => m.month === dateObj.getMonth() + 1 && m.year === dateObj.getFullYear());
};
