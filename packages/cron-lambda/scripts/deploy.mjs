import { fileURLToPath } from "url";
import path from "path";
import { deploy, getEnvSafe } from "../../../scripts/util.mjs";

export const filename = fileURLToPath(import.meta.url);
export const dirname = path.dirname(filename);

const vars = {
    serpApiApiKey: getEnvSafe("SERP_API_API_KEY"),
    openAiApiKey: getEnvSafe("OPEN_AI_API_KEY"),
};

deploy(dirname, { lambda_secrets: JSON.stringify(vars) });
