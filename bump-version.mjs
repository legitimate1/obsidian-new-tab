// 版本号 bump：manifest.json 为权威源，递增后写回 manifest.json + versions.json + package.json + package-lock.json
// 用法：node bump-version.mjs patch|minor|major
import { readFileSync, writeFileSync } from "node:fs";

const level = process.argv[2] ?? "patch";
if (!["patch", "minor", "major"].includes(level)) {
	console.error(`invalid level: ${level} (expected patch|minor|major)`);
	process.exit(1);
}

/** @param {string} filepath */
function readJson(filepath) {
	return JSON.parse(readFileSync(filepath, "utf8"));
}

/** @param {string} filepath @param {object} jsonObj */
function writeJson(filepath, jsonObj) {
	writeFileSync(filepath, JSON.stringify(jsonObj, null, "\t") + "\n");
}

const manifest = readJson("manifest.json");
const [major, minor, patch] = manifest.version.split(".").map(Number);
const next =
	level === "major" ? `${major + 1}.0.0` :
	level === "minor" ? `${major}.${minor + 1}.0` :
	`${major}.${minor}.${patch + 1}`;

manifest.version = next;
writeJson("manifest.json", manifest);

const versions = readJson("versions.json");
versions[next] = manifest.minAppVersion;
writeJson("versions.json", versions);

const pkg = readJson("package.json");
pkg.version = next;
writeJson("package.json", pkg);

const lock = readJson("package-lock.json");
lock.version = next;
lock.packages[""].version = next;
writeJson("package-lock.json", lock);

console.log(`version: ${manifest.version} -> ${next} (${level})`);
