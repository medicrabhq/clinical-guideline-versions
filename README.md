# Clinical guideline versions

More than 200 clinical practice guidelines from the United States, the United Kingdom, Europe, Canada, Australia, New Zealand, China and international societies. For each one: the latest version we have recorded, the earlier version it replaces or updates (where known), the date we last checked it against the issuing organization, and where to get the full text.

Browse it on the web: https://www.medicrab.com/guidelines/

## Files

| File | What it is |
| --- | --- |
| [`data/guidelines.json`](data/guidelines.json) | All fields. The header explains the `fullTextAccess` and `previousVersionRelation` values. |
| [`data/guidelines.csv`](data/guidelines.csv) | One row per guideline, main fields only (UTF-8). |

The list is synced once a month and the files change when the list changes. Each record has its own last-checked date. The commit history shows every change.

## How to use it

To check whether a cited guideline is current, match the organization and topic, then compare the cited year or version with the current version and the previous version. A citation that matches the previous version cites an earlier version. When the relation is `updates`, the current version changes only part of the earlier one, so both may be cited together.

Check the last-checked date before relying on a record, and follow the official link to the issuing organization. The list records publication facts, not recommendations.

| CSV column | JSON field |
| --- | --- |
| `title_english` | `titleEnglish` (for English guidelines, `title`) |
| `title_english_official` | `titleEnglishOfficial`: `false` means the English title is our translation, not an official one |
| `version` | `versionEnglish`, or `version` if there is no English form |
| `publication_date` | `publicationDate` |
| `previous_version` | `previousVersion` |
| `previous_version_relation` | `previousVersionRelation`: `replaces` or `updates` |
| `official_url` | `officialUrl` |
| `full_text_access` | `fullTextAccess` |
| `full_text_url` | `fullTextLink` |
| `last_checked` | `lastChecked` |

Full-text access values:

- `free`: the complete guideline is free to read or download from the official source or a file linked from the official page.
- `summary-only`: a summary has been published; the full guideline has not been published yet.
- `may-need-access`: the full text may need a journal subscription or institutional access.
- `not-confirmed`: start from the official page; free access to the full text has not been confirmed.

## Coverage

As of 27 October 2026:

| Region | Guidelines |
| --- | --- |
| United States | 69 |
| China | 48 |
| United Kingdom | 43 |
| Europe | 24 |
| International | 19 |
| Canada | 18 |
| Australia | 8 |
| New Zealand | 3 |

Specialties: cardiology, endocrinology and diabetes, oncology, orthopaedics, obstetrics and gynecology, respiratory medicine, neurology, gastroenterology and hepatology, rheumatology, psychiatry, infectious diseases, perioperative care, critical care, nephrology, geriatrics, hematology, prevention and screening, dermatology, pediatrics and andrology. A few entries are consensus statements or diagnostic criteria. Some guidelines are updated chapter by chapter (for example Diabetes Canada); these are listed one chapter per entry.

This is not a complete list of guidelines in these fields. To report an error or a new version, open an issue with a link to the issuing organization's page.

## Licence

The data in [`data/`](data/) is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). You may reuse it, including commercially: credit MediCrab, link to https://www.medicrab.com/guidelines/ and to the licence, and indicate any changes. The script is under the [MIT License](LICENSE).

This licence covers the list only. The guideline texts it links to remain subject to their copyright holders' terms.
