#!/usr/bin/env node
// Le fond noir texture du reel (.reel-bg de tokens.css) rendu en une image 1080x1920, pour la
// piste V0 du paquet Premiere : sous les scenes plein ecran, le rush et le detourage sont coupes,
// et c est ce fond que l on doit voir (retour du createur du 10/09 sur l export v2).
//   node tools/bg-still.mjs [premiere/media/bg.png]
import { writeFileSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
const out = process.argv[2] || "premiere/media/bg.png";
const tokens = readFileSync("tokens.css", "utf8");
const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${tokens}
html, body { margin: 0; background: var(--bg); }
#reel { position: relative; width: var(--reel-w); height: var(--reel-h); overflow: hidden; background: var(--bg); }
</style></head><body><div id="reel"><div class="reel-bg"></div></div></body></html>`;
const tmp = path.resolve("premiere", "bg-still.html");
writeFileSync(tmp, html);
const { chromium } = await import("playwright");
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(tmp).href);
await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1080, height: 1920 } });
await browser.close();
console.log(`fond texture → ${out}`);
