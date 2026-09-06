# Portfolio copy — house style

The single source of truth for editorial calls on user-facing copy in this repo.

**In scope:** JSX text nodes, and the string values of `heading` / `title` / `body` /
`label` / `description` / `prefix` / `link` / `captionItems` / `items` / `alt` /
`aria-label` in page and component data (`src/pages/**`, `src/components/**`).

**Out of scope — never flag:** code identifiers, `className` strings, prop/hook names,
`/* Figma node … */` and file-ID comments, asset filenames (e.g. `summerization.png`),
and commented-out JSX.

---

## Spelling: British English

- `-ise` / `-isation`, never `-ize` / `-ization`: organise, prioritise, minimise,
  customise, personalisation, modernise, summarise, contextualise, productise, utilise,
  standardise, optimise.
- `-our`: colour, behaviour, favour.
- `-re`: centre, metre.
- Doubled consonant before a suffix: modelling, cancelled, labelled.
- Also: catalogue, dialogue, grey, licence (noun) / license (verb), practice (noun) /
  practise (verb).
- Any American variant is an **error**, not a style nit.

## Hyphenation

Hyphenate a compound modifier **before** the noun it modifies; leave it open when it
comes after the noun (predicative) or when the first word ends in `-ly`.

- Hyphenate: first-ever, real-time, out-of-the-box, dev-ready, design-accurate,
  content-hugging, cookie-cutter, hard-to-trace, click-through, phase-wise, user-centred,
  customer-focused, 12-year-old, decision-making, day-to-day, black-box (as modifier).
- Open when predicative: "the feedback is real time" (rare here — the copy is almost
  always attributive).
- One word: upkeep, reinvent, reonboarding is written **re-onboarding** (keep the hyphen).
- `re-` before a repeated vowel or for readability stays hyphenated: re-architect,
  re-design; keep whichever form a sentence starts with consistent across that sentence.

## Punctuation

- **Em dash `—`** for a parenthetical break in a sentence — never a hyphen `-` or en
  dash `–`. Match the spacing already used nearby (this repo mostly uses a spaced
  ` — `).
- **En dash `–`** for a numeric range: `10–15`, not `10-15`.
- **`No.`** not `No:` for "number".
- **Oxford comma: on.** "rules, settings, and restrictions."
- **No comma splice.** Two independent clauses need `.`, `;`, or `, ` + a coordinating
  conjunction (and / but / so / or / yet).
- **Conjunctive adverbs** (however, therefore, as a result, nevertheless) between two
  clauses take `;` before and `,` after: "…rich information; however, users need…".
- No space before `,` or `.`; exactly one space after `.`.

## Lists (`captionItems`, `responsibilities` descriptions, retro `items`)

- **End punctuation:** every item ends with a full stop — **except** a list made
  entirely of short label fragments of ~2–4 words (retro `items` such as
  "Vision alignment", "Customer interviews"), which take none. Be consistent within a
  single list.
- **Parallelism:** every item in one list shares a grammatical form — all past-tense
  verbs ("Involved… Communicated… Co-created…"), or all noun phrases ("Clear definition
  of…", "Transparency of…"), or all imperatives. Never mix (e.g. a lone "Co-creating"
  among "Involved" / "Communicated").

## Headings (`heading`, section `title`, `label`)

- **Sentence case:** "Reduce the black-box feeling", not Title Case.
- **No trailing full stop on any heading — ever.** This includes the `heading` fields in
  `approachParagraphs` / `outcomeParagraphs` / `policyRecParagraphs` / etc.
- Telegraphic phrasing (dropped articles or subject) is fine: "Maintains composure
  when…", "Homepage caters to…".
- **Exception — styled all-caps rail labels are correct as written, do not flag:** the
  `CaseStudyIntro` / `CaseStudySection` rail eyebrow labels rendered in full caps —
  `RESPONSIBILITIES`, `RESULTS`, `LEARNINGS`, `PROJECT CHARACTERISTICS`, `NORTH STAR`,
  and any sibling in that same slot. The caps are a deliberate design treatment, not a
  casing error. This exception covers only those short eyebrow labels, not `heading` or
  section `title` fields.

## Proper nouns and product terms

| Correct | Not |
|---|---|
| MaaS360 | Maas360, MAAS360, Maas 360 |
| GenAI | GenAi, Gen AI, genAI |
| IBM | Ibm |
| Carbon Design System (the system) / the Carbon design team (the team) | carbon design team, Carbon Design Team |
| Figma | figma |
| North Star (the goal) | northstar, north star |
| SMBs, KPIs, NPS, MDM, UI, UX, IT admin, C-suite | SMB's, KPI's |
| STIGs, HIPAA, GDPR | STIGS, HIIPA |

## Numbers

- `35k+`, not `35k plus`.
- Established stat style stays as-is: `~30%`, `↓ 72%`, `~ 60%`.
- Prose: spell out one–nine, numerals for 10+; always numerals with `%` or a unit.

## Voice

- First person, active, for the author's own actions: "I defined", "Initiated",
  "Articulated", "I grew it".
- Do not slip into agentless passive where the author deserves credit ("it was decided"
  → "I / we decided").
- Contractions are fine ("I'd", "you're") — the copy already uses them.

## Also in scope (general editorial)

- Doubled words ("the the"), doubled spaces, missing space after punctuation.
- Homophones: its / it's, their / there / they're, lead / led, then / than,
  affect / effect, to / too, your / you're.
- Missing article where English requires one ("build a business logic" →
  "build the business logic").
- Subject–verb agreement across intervening words ("patterns … was" → "were").
- Verb-tense drift within one passage.
- Dangling or misplaced modifiers ("Starting out as an incubator project, I grew this…").
- Trailing or incomplete thoughts ("…ensured every experience remained aligned." —
  aligned with what?).
- Word or root repetition in one sentence ("Initiated… to initiate", "allows… allowing").
- `&` in prose or list items → use "and".
