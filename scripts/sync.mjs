// Downloads the published guideline list and writes data/guidelines.json and data/guidelines.csv.
// Node.js 22+, no dependencies.
import { readFile, writeFile } from 'node:fs/promises';

const SOURCE = 'https://www.medicrab.com/guidelines/guidelines.json';
const ACCESS = new Set(['free', 'summary-only', 'may-need-access', 'not-confirmed']);
const RELATIONS = new Set(['replaces', 'updates']);
const isDate = (s) => {
  const parts = String(s ?? '').match(/^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/);
  if (!parts) return false;
  const [, y, m = '01', d = '01'] = parts;
  const t = new Date(`${y}-${m}-${d}T00:00:00Z`);
  return !Number.isNaN(t.getTime()) && t.toISOString().startsWith(`${y}-${m}-${d}`);
};

const res = await fetch(SOURCE, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(30_000) });
if (!res.ok) throw new Error(`${SOURCE}: HTTP ${res.status}`);
const data = await res.json();

const records = data.records;
if (!Array.isArray(records) || records.length === 0) throw new Error('No records');
if (data.count !== records.length) throw new Error(`count ${data.count} != ${records.length} records`);

// A shrinking list is reviewed by hand rather than committed automatically.
const previous = JSON.parse(await readFile('data/guidelines.json', 'utf8').catch(() => '{"records":[]}'));
if (records.length < previous.records.length) {
  throw new Error(`Record count fell from ${previous.records.length} to ${records.length}; update by hand if this is intended`);
}

const ids = new Set();
for (const r of records) {
  const fail = (msg) => { throw new Error(`${r.id ?? '?'}: ${msg}`); };
  for (const k of ['id', 'title', 'version', 'officialUrl', 'specialty', 'topic', 'region']) {
    if (typeof r[k] !== 'string' || r[k].trim() === '') fail(`missing ${k}`);
  }
  if (!Array.isArray(r.organizations) || r.organizations.length === 0) fail('no organizations');
  if (r.organizations.some((o) => typeof (o?.acronym || o?.name) !== 'string' || !(o.acronym || o.name).trim())) fail('organization without a name');
  if (!ACCESS.has(r.fullTextAccess)) fail(`unknown fullTextAccess ${r.fullTextAccess}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(r.lastChecked ?? '') || !isDate(r.lastChecked)) fail(`bad lastChecked ${r.lastChecked}`);
  if (r.publicationDate != null && !isDate(r.publicationDate)) fail(`bad publicationDate ${r.publicationDate}`);
  if (!('previousVersion' in r)) fail('missing previousVersion');
  if (r.previousVersion ? !RELATIONS.has(r.previousVersionRelation) : r.previousVersionRelation != null) fail(`bad previousVersionRelation ${r.previousVersionRelation}`);
  if (ids.has(r.id)) fail('duplicate id');
  ids.add(r.id);
}
records.sort((a, b) => a.id.localeCompare(b.id));

const COLUMNS = [
  ['id', (r) => r.id],
  ['title', (r) => r.title],
  ['title_english', (r) => r.titleEnglish || (r.language === 'en' ? r.title : '')],
  ['title_english_official', (r) => (r.language === 'en' ? true : r.titleEnglishOfficial)],
  ['organizations', (r) => r.organizations.map((o) => o.acronym || o.name).join('; ')],
  ['region', (r) => r.region],
  ['specialty', (r) => r.specialty],
  ['topic', (r) => r.topic],
  ['version', (r) => r.versionEnglish || r.version],
  ['publication_date', (r) => r.publicationDate],
  ['previous_version', (r) => r.previousVersion],
  ['previous_version_relation', (r) => r.previousVersionRelation],
  ['doi', (r) => r.doi],
  ['pmid', (r) => r.pmid],
  ['official_url', (r) => r.officialUrl],
  ['full_text_access', (r) => r.fullTextAccess],
  ['full_text_url', (r) => r.fullTextLink],
  ['last_checked', (r) => r.lastChecked],
  ['page', (r) => r.page],
];
const cell = (v) => {
  const s = v == null ? '' : String(v);
  return /[",\r\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
};
const csv = [COLUMNS.map(([h]) => h).join(','), ...records.map((r) => COLUMNS.map(([, f]) => cell(f(r))).join(','))].join('\n') + '\n';

await writeFile('data/guidelines.json', JSON.stringify(data, null, 2) + '\n');
await writeFile('data/guidelines.csv', '﻿' + csv);
console.log(`${records.length} records, dateModified ${data.dateModified}`);
