import { publicTranslations } from "./publicTranslations.js";
import { privateTranslations } from "./privateTranslations.js";

const translations = { ...publicTranslations, ...privateTranslations };

export { translations };
