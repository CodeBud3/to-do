export const formattedDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "short", // "Wed"
    month: "long", // "April"
    day: "numeric", // "2"
  }).format(date);
