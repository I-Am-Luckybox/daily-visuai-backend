import { execSync } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

export const filename = fileURLToPath(import.meta.url);
export const dirname = path.dirname(filename);

const bootstrapDir = path.resolve(dirname, "../bootstrap");

export function run(cmd, opts = {}) {
    return execSync(cmd, { stdio: "inherit", ...opts });
}

function buildVars(vars) {
    return Object.entries(vars)
        .map(([key, value]) => `-var="${key}=${value}"`)
        .join(" ");
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