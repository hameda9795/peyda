const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const os = require("os");

const DEFAULT_PATH = path.resolve(
    __dirname,
    "..",
    "data",
    "steden_en_wijken_nederland_selectie.csv"
);

const filePath = process.argv[2] || DEFAULT_PATH;

const slugify = (value) =>
    value
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

const loadRows = (content) => {
    const lines = content.split(/\r?\n/).filter(Boolean);
    if (lines.length === 0) return [];
    const rows = [];
    for (let i = 1; i < lines.length; i += 1) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = line.split("\t");
        if (parts.length < 2) continue;
        const city = parts[0].trim();
        const neighborhood = parts[1].trim();
        if (!city || !neighborhood) continue;
        rows.push({ city, neighborhood });
    }
    return rows;
};

const escapeSql = (value) => value.replace(/'/g, "''");

const buildSql = (cityMap) => {
    const lines = ["BEGIN;"];
    let cityCount = 0;
    let neighborhoodCount = 0;

    for (const [cityName, neighborhoods] of cityMap.entries()) {
        const citySlug = slugify(cityName);
        if (!citySlug) continue;
        const cityNameEscaped = escapeSql(cityName);
        const citySlugEscaped = escapeSql(citySlug);

        lines.push(
            `INSERT INTO "cities" ("id","name","slug","createdAt","updatedAt") VALUES (gen_random_uuid()::text,'${cityNameEscaped}','${citySlugEscaped}',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)` +
            ` ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "updatedAt" = CURRENT_TIMESTAMP;`
        );
        cityCount += 1;

        for (const neighborhoodName of neighborhoods) {
            const neighborhoodSlug = slugify(neighborhoodName);
            if (!neighborhoodSlug) continue;
            const neighborhoodNameEscaped = escapeSql(neighborhoodName);
            const neighborhoodSlugEscaped = escapeSql(neighborhoodSlug);

            lines.push(
                `INSERT INTO "neighborhoods" ("id","name","slug","cityId","createdAt","updatedAt") VALUES (` +
                `gen_random_uuid()::text,'${neighborhoodNameEscaped}','${neighborhoodSlugEscaped}',` +
                `(SELECT "id" FROM "cities" WHERE "slug" = '${citySlugEscaped}' LIMIT 1),` +
                `CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)` +
                ` ON CONFLICT ("cityId","slug") DO UPDATE SET "name" = EXCLUDED."name", "updatedAt" = CURRENT_TIMESTAMP;`
            );
            neighborhoodCount += 1;
        }
    }

    lines.push("COMMIT;");
    return { sql: lines.join("\n"), cityCount, neighborhoodCount };
};

function runPrismaExecute(sqlFilePath) {
    const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

    if (!databaseUrl) {
        throw new Error("DIRECT_URL or DATABASE_URL is required to run prisma db execute.");
    }

    const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx";
    const command = `${npxCmd} prisma db execute --file "${sqlFilePath}" --url "${databaseUrl}"`;

    execSync(command, { stdio: "inherit", shell: true });
}

function main() {
    if (!fs.existsSync(filePath)) {
        throw new Error(`CSV file not found: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, "utf8");
    const rows = loadRows(content);

    if (!rows.length) {
        console.log("No rows found in CSV.");
        return;
    }

    const cityMap = new Map();
    for (const row of rows) {
        if (!cityMap.has(row.city)) {
            cityMap.set(row.city, new Set());
        }
        cityMap.get(row.city).add(row.neighborhood);
    }

    const { sql, cityCount, neighborhoodCount } = buildSql(cityMap);
    const sqlPath = path.join(os.tmpdir(), "import-cities.sql");
    fs.writeFileSync(sqlPath, sql, "utf8");

    runPrismaExecute(sqlPath);
    console.log(`Imported ${cityCount} cities and ${neighborhoodCount} neighborhoods.`);
}

try {
    main();
} catch (error) {
    console.error(error);
    process.exit(1);
}
