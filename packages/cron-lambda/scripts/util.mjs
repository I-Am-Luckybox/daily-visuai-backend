import { execSync } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

export const filename = fileURLToPath(import.meta.url);
export const dirname = path.dirname(filename);

export function run(cmd, opts = {}) {
    return execSync(cmd, { stdio: "inherit", ...opts });
}

function getOutput(dir, outputName) {
    const cmd = `terraform output -raw ${outputName}`;
    return execSync(cmd, { cwd: dir }).toString().trim();
}

export function initTerraform() {
    const bootstrapDir = path.resolve(dirname, "../../../bootstrap");
    const bucketId = getOutput(bootstrapDir, "bucket_id");
    const bucketRegion = getOutput(bootstrapDir, "bucket_region");
    const tfDir = path.resolve(dirname, "../tf");
    console.log(`TF State = { bucket: ${bucketId}, region: ${bucketRegion} }`);
    run(`terraform init -backend-config="bucket=${bucketId}" -backend-config="region=${bucketRegion}"`, { cwd: tfDir });
}