import { AnsiFormatter } from "./ansi";
import { TextFormatter } from "./text";
import { UrlFormatter } from "./url";

import type { OutputFormatter } from "@/types/formatters";

const formatters: OutputFormatter[] = [
  new UrlFormatter(),
  new AnsiFormatter(),
  new TextFormatter(),
];

export { formatters };
export * from "@/types/formatters";
