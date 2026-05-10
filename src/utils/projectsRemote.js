/**
 * Dynamic projects from a spreadsheet (Excel → CSV/JSON hosted online)
 * ====================================================================
 *
 * Why not use the OneDrive share link (1drv.ms / Excel) directly?
 * - Browser `fetch()` cannot reliably load Office workbook URLs: redirects,
 *   authentication, and CORS block anonymous reads from a React SPA.
 *
 * How updates sync automatically:
 * - Export your workbook as **CSV (UTF-8)** or maintain a **JSON** file that
 *   mirrors your sheet columns. Upload it to any **public HTTPS URL** that
 *   sends `Access-Control-Allow-Origin` (or same-origin under `/public`).
 * - Replace the file whenever the Excel sheet changes (manual upload, CI job,
 *   or Power Automate “when row modified → upload file”). On each visit / cache
 *   expiry, this app refetches the URL and re-renders cards — no redeploy needed.
 *
 * Recommended Excel → publish loop:
 * 1. Excel / Excel Online: File → Save As → CSV UTF-8.
 * 2. Host CSV at e.g. GitHub raw, Cloudflare R2, S3 static site, or `public/projects-data.csv`
 *    copied during deploy.
 * 3. Set `REACT_APP_PROJECTS_DATA_URL` to override (see `.env.example`).
 *    Leave unset to use the default published Google Sheets CSV URL in code.
 *
 * Google Sheets: File → Share → Publish to web → CSV. The published `pub?output=csv`
 * URL is fetchable from the browser (unlike OneDrive workbook links).
 *
 * Column headers (CSV row 1 or JSON keys) — flexible aliases supported:
 * - Project Name (also: title, name…)
 * - Description (also: desc, summary…)
 * - Github repo (also: github, repository…)
 * - image (also: project image, thumbnail…) — use **full https image URLs**
 * - liveurl (also: live demo url, website…) — optional
 *
 * Image assets:
 * - Remote rows should use **absolute URLs** (CDN, GitHub raw, etc.).
 * - Images bundled with the app stay under `src/assets/images/…` and are used
 *   only from **static** `portfolio.js` projects (Webpack `require`), not from Excel.
 */

export const PROJECTS_REMOTE_CACHE_KEY = "portfolio_projects_remote_v1";

/** Published “Publish to web” CSV for the portfolio sheet (override via env). */
export const DEFAULT_PROJECTS_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vShEDo5O8uahJRUdHYaSXkFxavCl3blDy2If_mXKNzszTE100rT2NGqbinpzUMdPeiJtOWtfvSxzB6f/pub?output=csv";

export function getProjectsDataUrl() {
  const raw = process.env.REACT_APP_PROJECTS_DATA_URL;
  if (raw != null) {
    const t = String(raw).trim();
    if (t === "" || /^default$/i.test(t)) {
      return DEFAULT_PROJECTS_SHEET_CSV_URL;
    }
    if (/^(none|static|off)$/i.test(t)) {
      return "";
    }
    return t;
  }
  return DEFAULT_PROJECTS_SHEET_CSV_URL;
}

/** Cache TTL in ms; 0 disables sessionStorage cache (still avoids duplicate in-flight requests via hook). */
export function getProjectsCacheTtlMs() {
  const raw = process.env.REACT_APP_PROJECTS_CACHE_MS;
  const n = raw != null ? parseInt(String(raw).trim(), 10) : NaN;
  if (!Number.isFinite(n) || n < 0) {
    return 5 * 60 * 1000;
  }
  return n;
}

/** Same rules as social links: relative hosts become https. */
export function ensureHttpsUrl(url) {
  if (!url || typeof url !== "string") {
    return "";
  }
  const trimmed = url.trim();
  if (!trimmed) {
    return "";
  }
  if (/^mailto:/i.test(trimmed)) {
    return trimmed;
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed.replace(/^\/+/, "")}`;
}

function readCache(ttlMs) {
  if (ttlMs === 0) {
    return null;
  }
  try {
    const raw = sessionStorage.getItem(PROJECTS_REMOTE_CACHE_KEY);
    if (!raw) {
      return null;
    }
    const {ts, payload} = JSON.parse(raw);
    if (!payload || typeof ts !== "number") {
      return null;
    }
    if (Date.now() - ts > ttlMs) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

function writeCache(payload, ttlMs) {
  if (ttlMs === 0) {
    return;
  }
  try {
    sessionStorage.setItem(
      PROJECTS_REMOTE_CACHE_KEY,
      JSON.stringify({ts: Date.now(), payload})
    );
  } catch {
    /* quota / private mode */
  }
}

/** Minimal RFC 4180-style CSV parser (handles quoted fields and commas). */
export function parseCSV(text) {
  const rows = [];
  let row = [];
  let cur = "";
  let inQuotes = false;
  const s = text.replace(/^\uFEFF/, "");

  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(cur);
      cur = "";
    } else if (c === "\n") {
      row.push(cur);
      rows.push(row);
      row = [];
      cur = "";
    } else if (c === "\r") {
      /* skip; handle CRLF on \n */
    } else {
      cur += c;
    }
  }
  row.push(cur);
  if (row.some(cell => String(cell).trim() !== "")) {
    rows.push(row);
  }
  return rows;
}

function normalizeHeaderKey(key) {
  return String(key || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function rowObjectFromCsvRow(headers, cells) {
  const obj = {};
  headers.forEach((h, i) => {
    obj[normalizeHeaderKey(h)] = cells[i] != null ? String(cells[i]).trim() : "";
  });
  return obj;
}

function pick(normObj, aliases) {
  for (let i = 0; i < aliases.length; i++) {
    const key = aliases[i].toLowerCase().replace(/\s+/g, " ");
    const v = normObj[key];
    if (v != null && String(v).trim() !== "") {
      return String(v).trim();
    }
  }
  return "";
}

export function normalizeRemoteRow(obj, index) {
  const keys = Object.keys(obj).reduce((acc, k) => {
    acc[normalizeHeaderKey(k)] = obj[k];
    return acc;
  }, {});

  const projectName = pick(keys, [
    "project name",
    "projectname",
    "name",
    "title",
    "project"
  ]);
  if (!projectName) {
    return null;
  }

  const imageRaw = pick(keys, [
    "project image",
    "projectimage",
    "image",
    "image url",
    "imageurl",
    "thumbnail",
    "screenshot",
    "picture"
  ]);

  const githubUrl = pick(keys, [
    "github repo",
    "githubrepo",
    "github repository url",
    "githubrepositoryurl",
    "github url",
    "githuburl",
    "github",
    "repository url",
    "repository",
    "repo url",
    "repo"
  ]);

  const liveDemoUrl = pick(keys, [
    "liveurl",
    "live url",
    "live demo url",
    "livedemourl",
    "demo url",
    "website",
    "deploy",
    "production url",
    "demo"
  ]);

  const projectDesc = pick(keys, [
    "description",
    "desc",
    "details",
    "summary",
    "about"
  ]);

  return {
    id: `remote-${index}-${slugId(projectName)}`,
    projectName,
    projectDesc,
    image: imageRaw || null,
    githubUrl,
    liveDemoUrl,
    featured: false,
    source: "remote"
  };
}

function slugId(name) {
  return String(name)
    .slice(0, 32)
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .toLowerCase();
}

export function normalizeRemotePayload(parsed) {
  let rows = [];
  if (Array.isArray(parsed)) {
    rows = parsed;
  } else if (parsed && typeof parsed === "object") {
    if (Array.isArray(parsed.projects)) {
      rows = parsed.projects;
    } else if (Array.isArray(parsed.rows)) {
      rows = parsed.rows;
    }
  }

  const out = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row || typeof row !== "object") {
      continue;
    }
    const norm = normalizeRemoteRow(row, i);
    if (norm) {
      out.push(norm);
    }
  }
  return out;
}

export function csvToProjects(rows) {
  if (!rows.length) {
    return [];
  }
  const headers = rows[0].map(normalizeHeaderKey);
  const out = [];
  for (let r = 1; r < rows.length; r++) {
    const obj = rowObjectFromCsvRow(headers, rows[r]);
    const norm = normalizeRemoteRow(obj, r - 1);
    if (norm) {
      out.push(norm);
    }
  }
  return out;
}

export async function fetchRemoteProjects(signal) {
  const url = getProjectsDataUrl();
  if (!url) {
    return {projects: [], fromCache: false};
  }

  const ttlMs = getProjectsCacheTtlMs();
  const cached = readCache(ttlMs);
  if (cached && Array.isArray(cached)) {
    return {projects: cached, fromCache: true};
  }

  const res = await fetch(url, {
    signal,
    credentials: "omit",
    cache: "no-store"
  });

  if (!res.ok) {
    throw new Error(`Projects data HTTP ${res.status}`);
  }

  const ct = res.headers.get("content-type") || "";
  const text = (await res.text()).replace(/^\uFEFF/, "").trim();

  let projects = [];

  const looksJson =
    /json/i.test(ct) || text.startsWith("{") || text.startsWith("[");

  if (looksJson && (text.startsWith("{") || text.startsWith("["))) {
    try {
      projects = normalizeRemotePayload(JSON.parse(text));
    } catch {
      projects = csvToProjects(parseCSV(text));
    }
  } else {
    projects = csvToProjects(parseCSV(text));
  }

  if (ttlMs > 0 && projects.length) {
    writeCache(projects, ttlMs);
  }

  return {projects, fromCache: false};
}

/** Maps legacy `portfolio.js` project shape to the unified card model. */
export function normalizeStaticPortfolioProject(project, index) {
  const links = project.footerLink || [];
  let githubUrl = "";
  let liveDemoUrl = "";

  for (let i = 0; i < links.length; i++) {
    const name = String(links[i].name || "").toLowerCase();
    const url = String(links[i].url || "").trim();
    if (!url) {
      continue;
    }
    if (name.includes("github")) {
      githubUrl = url;
    } else if (
      name.includes("website") ||
      name.includes("demo") ||
      name.includes("live") ||
      name.includes("visit")
    ) {
      liveDemoUrl = url;
    }
  }

  if (!liveDemoUrl && links[0] && links[0].url) {
    liveDemoUrl = String(links[0].url).trim();
  }

  return {
    id: `static-${index}-${slugId(project.projectName || "project")}`,
    projectName: project.projectName || "Project",
    projectDesc: project.projectDesc || "",
    image: project.image || null,
    githubUrl,
    liveDemoUrl,
    featured: Boolean(project.featured),
    source: "static"
  };
}
