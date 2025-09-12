import { initTerraform, run, dirname } from "./util.mjs";
import path from "path";

try {
    initTerraform();
    const tfDir = path.resolve(dirname, "../tf");
    run("terraform apply", { cwd: tfDir });
} catch (err) {
    console.error("Deployment failed: ", err);
}