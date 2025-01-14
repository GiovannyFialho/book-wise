import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(localizedFormat);

export function formatDate(date: string | Date): string {
  const now = dayjs();
  const inputDate = dayjs(date);

  if (inputDate.isToday()) {
    return "hoje";
  }

  if (inputDate.isYesterday()) {
    return "ontem";
  }

  if (inputDate.isSame(now.subtract(1, "week"), "week")) {
    return "semana passada";
  }

  if (inputDate.isSame(now, "month")) {
    return `dia ${inputDate.format("D")}`;
  }

  return inputDate.format("DD/MM/YYYY");
}
