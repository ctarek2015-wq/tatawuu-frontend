const formatDateTime = (value, language = "en") => {
  return new Date(value).toLocaleString(language === "ar" ? "ar-BH" : "en-GB", {
    timeZone: "Asia/Bahrain",
    calendar: "gregory",
    dateStyle: "medium",
    timeStyle: "short",
  });
};

// Bahrain is UTC+3. These values belong in datetime-local inputs.
const toDateInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return new Date(date.getTime() + 3 * 60 * 60 * 1000).toISOString().slice(0, 16);
};

const toUTC = (value) => new Date(`${value}:00+03:00`).toISOString();
const dateOnly = (value) => toDateInput(value).slice(0, 10);

export { formatDateTime, toDateInput, toUTC, dateOnly };
