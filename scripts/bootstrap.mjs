import { execSync } from "child_process";
import { buildVars } from "./util.mjs";
import { fileURLToPath } from "url";
import path from "path";

export const filename = fileURLToPath(import.meta.url);
export const dirname = path.dirname(filename);

const bootstrapDir = path.resolve(dirname, "../bootstrap");

export function run(cmd, opts = {}) {
    return execSync(cmd, { stdio: "inherit", ...opts });
}

function bootstrap() {
    run(`terraform init`, { cwd: bootstrapDir });

    const vars = buildVars({
        aws_region: process.env.AWS_REGION,
        cockroachdb_api_key: process.env.COCKROACHDB_API_KEY,
    });
    console.log(vars);

    run(`terraform apply ${vars}`, { cwd: bootstrapDir });
}

bootstrap();
