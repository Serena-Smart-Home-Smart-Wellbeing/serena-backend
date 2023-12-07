import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const dayjsIndo = (date?: Date) =>
    dayjs(date).tz("Asia/Jakarta").locale("id");
