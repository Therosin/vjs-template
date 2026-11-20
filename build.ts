import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

// dist is the deployable plugin folder, rebuilt entirely from src.
const source = join(import.meta.dir, "src");
const output = join(import.meta.dir, "dist");
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });

// Copy non-code files, preserving paths for manifest, assets and behaviours.
function copyFiles(from: string, to: string): void {
    for (const entry of readdirSync(from, { withFileTypes: true })) {
        const input = join(from, entry.name);
        const destination = join(to, entry.name);
        if (entry.isDirectory()) {
            copyFiles(input, destination);
        } else if (!/\.[cm]?[jt]sx?$/.test(entry.name)) {
            mkdirSync(to, { recursive: true });
            cpSync(input, destination);
        }
    }
}
copyFiles(source, output);

let entries = 0;
for (const side of ["shared", "server", "client"]) {
    const entry = join(source, side, "main.ts");
    if (!existsSync(entry)) continue;
    const result = await Bun.build({
        entrypoints: [entry],
        outdir: output,
        naming: `${side}.js`,
        target: "browser",
        format: "esm",
        sourcemap: "linked"
    });
    if (!result.success) {
        for (const error of result.logs) console.error(error);
        process.exit(1);
    }
    entries++;
}
if (!entries) throw new Error("Add src/shared/main.ts, src/server/main.ts or src/client/main.ts");
if (!existsSync(join(output, "manifest.ini"))) throw new Error("Add src/manifest.ini");
console.log(`Built ${entries} plugin entry(s) in dist/`);
