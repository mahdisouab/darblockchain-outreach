#!/usr/bin/env node
/**
 * Cartes d'isolation pour le paquet Premiere : une copie d'index.html par couche, qui n'affiche
 * QUE cette couche sur fond transparent (les autres groupes en display:none, les <audio> retirés).
 * Rendues ensuite en séquences PNG RGBA à 25 i/s :
 *   npx hyperframes render -c premiere-cards/layer-<couche>.html --format png-sequence -f 25 \
 *       --workers auto --browser-gpu -o renders/premiere/png/<couche>
 *
 *   node tools/premiere-cards.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const src = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const OUT = path.join(ROOT, "premiere-cards");
fs.mkdirSync(OUT, { recursive: true });

const ALL = ["#vwrap", "#dim", "#behind", "#cutwrap", "#around", "#takeover", "#foot", "#cap"];
const KEEP = { around: "#around", behind: "#behind", takeover: "#takeover", foot: "#foot", captions: "#cap" };

for (const [name, keep] of Object.entries(KEEP)) {
  const hide = ALL.filter((s) => s !== keep).map((s) => "#reel " + s).join(", ");
  const style = `
      /* ==== PASSE D ISOLATION PREMIERE : ${name} ==== */
      html, body, #reel, #reel #stage { background: transparent !important; }
      #reel .reel-bg { display: none !important; }
      ${hide} { display: none !important; }
`;
  let html = src.replace("</style>", style + "</style>");
  html = html.replace(/<audio [^>]*><\/audio>\s*/g, "");
  if (html === src) throw new Error("index.html : balise </style> introuvable");
  fs.writeFileSync(path.join(OUT, `layer-${name}.html`), html);
  console.log(`premiere-cards/layer-${name}.html`);
}
