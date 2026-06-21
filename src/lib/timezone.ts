export interface ParsedLocalDateTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

export interface UserKickoffDisplay {
  date: string;
  time: string;
  timeZone: string;
  dateTime: string;
}

function getTimeZoneOffsetMs(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "longOffset",
  }).formatToParts(date);

  const tzName = parts.find((part) => part.type === "timeZoneName")?.value ?? "GMT";
  const match = tzName.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!match) return 0;

  const sign = match[1] === "+" ? 1 : -1;
  const hours = parseInt(match[2], 10);
  const minutes = parseInt(match[3] ?? "0", 10);
  return sign * (hours * 60 + minutes) * 60 * 1000;
}

export function parseLocalDateTimeString(localDate: string): ParsedLocalDateTime | null {
  const parts = localDate?.trim().split(/\s+/) ?? [];
  const datePart = parts[0] ?? "";
  const timePart = parts[1] ?? "12:00";

  const slashMatch = datePart.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!slashMatch) return null;

  const [, monthStr, dayStr, yearStr] = slashMatch;
  const [hourStr, minuteStr = "0"] = timePart.split(":");

  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  if (
    [year, month, day, hour, minute].some((value) => Number.isNaN(value)) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }

  return { year, month, day, hour, minute };
}

export function zonedLocalToUtcIso(
  local: ParsedLocalDateTime,
  timeZone: string,
): string {
  const targetLocalMs = Date.UTC(
    local.year,
    local.month - 1,
    local.day,
    local.hour,
    local.minute,
    0,
  );

  let utcMs = targetLocalMs;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const offsetMs = getTimeZoneOffsetMs(new Date(utcMs), timeZone);
    const nextUtcMs = targetLocalMs - offsetMs;
    if (nextUtcMs === utcMs) break;
    utcMs = nextUtcMs;
  }

  return new Date(utcMs).toISOString();
}

export function formatKickoffInTimeZone(
  kickoffUtc: string,
  timeZone: string,
  locale?: string,
): UserKickoffDisplay {
  const instant = new Date(kickoffUtc);
  const resolvedLocale = locale ?? undefined;

  const dateFormatter = new Intl.DateTimeFormat(resolvedLocale, {
    timeZone,
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  const timeFormatter = new Intl.DateTimeFormat(resolvedLocale, {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const date = dateFormatter.format(instant);
  const timeWithZone = timeFormatter.format(instant);
  const timeZoneLabel =
    new Intl.DateTimeFormat(resolvedLocale, {
      timeZone,
      timeZoneName: "short",
    })
      .formatToParts(instant)
      .find((part) => part.type === "timeZoneName")?.value ?? "";

  return {
    date,
    time: timeWithZone,
    timeZone: timeZoneLabel,
    dateTime: instant.toISOString(),
  };
}

export function formatKickoffInUserTz(
  kickoffUtc: string,
  locale?: string,
): UserKickoffDisplay {
  const instant = new Date(kickoffUtc);
  const resolvedLocale = locale ?? undefined;

  const dateFormatter = new Intl.DateTimeFormat(resolvedLocale, {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  const timeFormatter = new Intl.DateTimeFormat(resolvedLocale, {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const date = dateFormatter.format(instant);
  const timeWithZone = timeFormatter.format(instant);
  const timeZone =
    new Intl.DateTimeFormat(resolvedLocale, {
      timeZoneName: "short",
    })
      .formatToParts(instant)
      .find((part) => part.type === "timeZoneName")?.value ?? "";

  return {
    date,
    time: timeWithZone,
    timeZone,
    dateTime: instant.toISOString(),
  };
}

export function formatKickoffTimeOnly(
  kickoffUtc: string,
  locale?: string,
): string {
  return formatKickoffInUserTz(kickoffUtc, locale).time;
}
