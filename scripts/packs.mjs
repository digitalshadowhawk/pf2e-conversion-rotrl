/**
 * scripts/packs.mjs
 *
 * Converts between compiled Foundry VTT compendium packs (LevelDB, in packs/<name>/)
 * and their plaintext JSON source (in packs/_source/<name>/*.json).
 *
 * Usage:
 *   node scripts/packs.mjs unpack   # LevelDB -> JSON  (run after editing packs in Foundry)
 *   node scripts/packs.mjs pack     # JSON -> LevelDB   (run before loading the module in Foundry / before release)
 *
 * Version stamping: any string field in the JSON source (macro `command`
 * text, journal page HTML, etc.) containing the literal placeholder
 * "{{MODULE_VERSION}}" gets that placeholder replaced with the current
 * module.json "version" value whenever `pack` runs. Locally that's usually
 * still the literal "#{VERSION}#" release-token (replaced for real by the
 * release workflow before it runs `npm run pack`) - see .github/workflows/main.yml.
 */

import { compilePack, extractPack } from "@foundryvtt/foundryvtt-cli";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SOURCE_ROOT = path.join(ROOT, "packs", "_source");
const VERSION_PLACEHOLDER = "{{MODULE_VERSION}}";

async function loadModuleJson() {
    return JSON.parse(await fs.readFile(path.join(ROOT, "module.json"), "utf8"));
}

async function loadPacks() {
    const moduleJson = await loadModuleJson();
    if (!Array.isArray(moduleJson.packs) || moduleJson.packs.length === 0) {
        throw new Error("No packs found in module.json");
    }
    return moduleJson.packs.map((p) => ({
        name: p.name,
        type: p.type,
        compiledDir: path.join(ROOT, p.path),
        sourceDir: path.join(SOURCE_ROOT, p.name),
    }));
}

async function pathExists(p) {
    try {
        await fs.access(p);
        return true;
    } catch {
        return false;
    }
}

async function tryClean(dir) {
    try {
        await fs.rm(dir, { recursive: true, force: true });
    } catch (err) {
        console.warn(`Could not clean ${path.basename(dir)} (${err.code ?? err.message}); updating in place instead.`);
    }
    await fs.mkdir(dir, { recursive: true });
}

function stampVersion(node, version) {
    if (Array.isArray(node)) {
        for (let i = 0; i < node.length; i++) {
            if (typeof node[i] === "string") {
                if (node[i].includes(VERSION_PLACEHOLDER)) node[i] = node[i].split(VERSION_PLACEHOLDER).join(version);
            } else if (node[i] && typeof node[i] === "object") {
                stampVersion(node[i], version);
            }
        }
    } else if (node && typeof node === "object") {
        for (const key of Object.keys(node)) {
            const val = node[key];
            if (typeof val === "string") {
                if (val.includes(VERSION_PLACEHOLDER)) node[key] = val.split(VERSION_PLACEHOLDER).join(version);
            } else if (val && typeof val === "object") {
                stampVersion(val, version);
            }
        }
    }
}

async function unpack() {
    const packs = await loadPacks();
    for (const pack of packs) {
        if (!(await pathExists(pack.compiledDir))) {
            console.warn(`Skipping "${pack.name}": no compiled pack at ${pack.compiledDir}`);
            continue;
        }
        await tryClean(pack.sourceDir);

        const expandAdventures = pack.type === "Adventure";
        console.log(`Unpacking "${pack.name}" (${pack.type}) -> ${path.relative(ROOT, pack.sourceDir)}${expandAdventures ? " [expanding adventure]" : ""}`);
        await extractPack(pack.compiledDir, pack.sourceDir, {
            log: true,
            folders: true,
            expandAdventures,
        });
    }
}

async function pack() {
    const moduleJson = await loadModuleJson();
    const version = moduleJson.version;
    const packs = await loadPacks();
    for (const pack of packs) {
        if (!(await pathExists(pack.sourceDir))) {
            console.warn(`Skipping "${pack.name}": no JSON source at ${pack.sourceDir}`);
            continue;
        }
        await tryClean(pack.compiledDir);

        console.log(`Packing "${pack.name}" -> ${path.relative(ROOT, pack.compiledDir)} (version ${version})`);
        await compilePack(pack.sourceDir, pack.compiledDir, {
            log: true,
            recursive: true,
            transformEntry: (entry) => {
                stampVersion(entry, version);
            },
        });
    }
}

async function main() {
    const mode = process.argv[2];
    if (mode === "unpack") {
        await unpack();
    } else if (mode === "pack") {
        await pack();
    } else {
        console.error("Usage: node scripts/packs.mjs <unpack|pack>");
        process.exit(1);
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
