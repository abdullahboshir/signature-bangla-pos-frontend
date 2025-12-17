import { subDays, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, subYears, isWithinInterval } from "date-fns";
import { DateRange } from "react-day-picker";

export type DateFilterType = "all" | "today" | "week" | "this_month" | "last_month" | "this_year" | "last_year" | "custom";

export const filterDataByDate = <T>(
    data: T[],
    dateField: keyof T,
    filterType: string,
    customRange?: DateRange
): T[] => {
    if (filterType === "all") return data;

    const now = new Date();
    let start: Date | null = null;
    let end: Date | null = null;

    switch (filterType) {
        case "today":
            start = startOfDay(now);
            end = endOfDay(now);
            break;
        case "week":
            start = subDays(startOfDay(now), 7);
            end = endOfDay(now);
            break;
        case "this_month":
            start = startOfMonth(now);
            end = endOfMonth(now);
            break;
        case "last_month":
            start = startOfMonth(subMonths(now, 1));
            end = endOfMonth(subMonths(now, 1));
            break;
        case "this_year":
            start = startOfYear(now);
            end = endOfYear(now);
            break;
        case "last_year":
            start = startOfYear(subYears(now, 1));
            end = endOfYear(subYears(now, 1));
            break;
        case "custom":
            if (customRange?.from) {
                start = startOfDay(customRange.from);
                end = customRange.to ? endOfDay(customRange.to) : endOfDay(customRange.from);
            }
            break;
    }

    if (!start || !end) return data;

    return data.filter(item => {
        const itemDate = new Date(item[dateField] as any);
        return isWithinInterval(itemDate, { start, end: end as Date });
    });
};
