import { fileURLToPath } from "url";
import path from "path";
import { destroy } from "../../../scripts/util.mjs";

export const filename = fileURLToPath(import.meta.url);
export const dirname = path.dirname(filename);

destroy(dirname);