import path from "node:path";
import { fileURLToPath } from "node:url";
import { destroy, getEnvSafe } from "../../../scripts/util.mjs";

export const filename = fileURLToPath(import.meta.url);
export const dirname = path.dirname(filename);

const vars = {
    serpApiApiKey: getEnvSafe("SERP_API_API_KEY"),
    openAiApiKey: getEnvSafe("OPEN_AI_API_KEY"),
};

destroy(dirname, { lambda_secrets: JSON.stringify(vars) });
