import { execSync } from "child_process";
import path from "path";

export function run(cmd, opts = {}) {
    return execSync(cmd, { stdio: "inherit", ...opts });
}

export function getBootstrapOutput(cwd) {
    const bootstrapDir = path.resolve(cwd, "../../../bootstrap");
    const rawOutput = execSync(`terraform output`, {
        cwd: bootstrapDir,
    }).toString();
    const outputs = {};
    rawOutput.split("\n").forEach((line) => {
        const [key, ...value] = line.split(" = ");
        if (key && value.length) {
            outputs[key.trim()] = value;
        }
    });
    return outputs;
}

export function initTerraform(cwd) {
    console.log("Initializing bootstrap TF...");
    const output = getBootstrapOutput(cwd);
    const { bucket_id: bucketId, bucket_region: bucketRegion } = output;
    const tfDir = path.resolve(cwd, "../tf");
    console.log(`TF State = { bucket: ${bucketId}, region: ${bucketRegion} }`);
    run(`terraform init -backend-config="bucket=${bucketId}" -backend-config="region=${bucketRegion}"`, { cwd: tfDir });
}

export function buildVars(vars) {
    return vars
        ? Object.entries(vars)
              .map(([key, value]) => `-var="${key}=${value}"`)
              .join(" ")
        : "";
}

export function deploy(cwd, vars) {
    try {
        initTerraform(cwd);
        const cmdInput = buildVars(vars);
        run(`terraform apply ${cmdInput}`, { cwd: path.resolve(cwd, "../tf") });
    } catch (err) {
        console.error("Deployment failed: ", err);
    }
}

export function destroy(cwd, vars) {
    try {
        initTerraform(cwd);
        const cmdInput = buildVars(vars);
        run(`terraform destroy ${cmdInput}`, { cwd: path.resolve(cwd, "../tf") });
    } catch (err) {
        console.error("Destroy failed: ", err);
    }
}

export function getEnvSafe(key) {
    if (!process.env[key]) {
        throw new Error(`Missing env ${key}`);
    }
    return process.env[key];
}
