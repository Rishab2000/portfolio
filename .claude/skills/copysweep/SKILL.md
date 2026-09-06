---
name: copysweep
description: Use when reviewing portfolio case-study page copy (or any user-facing JSX text in this repo) for typos, grammar, British-spelling, punctuation, hyphenation, parallelism, and house-style consistency — especially when repeated manual read-throughs keep surfacing new issues each pass.
---

# copysweep

## Overview

Editorial sweep of user-facing copy, run as **four independent parallel reviewers** — one
per error class — whose findings merge into one deduplicated report. One agent doing all
four jobs misses things every pass; four agents each doing one job, each with the whole
file in view, do not.

**Report only. This skill never edits copy.**

## When to use

- `/copysweep` — sweep the file you currently have attached or open in the editor.
- `/copysweep <path-or-glob>` — sweep specific file(s), e.g.
  `/copysweep src/pages/HomePage/HomePage.tsx` or `/copysweep "src/pages/**/*.tsx"`.
- Immediately after hand-editing copy — freshly introduced typos are the common case.

## House style

**REQUIRED:** Read `house-style.md` (this directory) in full before dispatching agents,
and paste its entire contents into every agent prompt. It is the single source of truth
for every spelling-variant and consistency call.

## Workflow

1. **Resolve targets.** Pick exactly ONE source, in this order — do not combine them:

   - **Argument given** → treat it as a path or glob; those are the targets. Stop here.

   - **No argument** → the target is the *single* file the user currently has in focus.
     Scan the whole current context for a `.tsx` / `.jsx` path under `src/` and take the
     first hit, checking in this order:
     1. any file whose full contents are present in context as an attachment / document /
        `@`-mention block with a path header (this is the file pill in the Claude Code
        composer — the path is in that block, often as `path/to/File.tsx` or a
        `File: …` / `<document … path=…>` header),
     2. the most recent `<ide_opened_file>` tag,
     3. the path in the most recent `<ide_selection>` / `<ide_diagnostics>` tag.

     If exactly one such file is present, that is the target — echo it once
     ("Sweeping `<path>`…") and go. Stop here.

   - **No argument and no such file anywhere in context** → do NOT sweep all three pages.
     Ask: "No file in context — which file should I sweep? (or `/copysweep <path>`)".

   **Never** infer targets from `git status`, uncommitted/pending edits, or files merely
   mentioned earlier in the conversation. The no-argument target is the one file the user
   has attached or open right now. If that file is not a `.tsx` / `.jsx` under `src/`,
   say so and ask for an explicit path rather than guessing.

   The three case-study pages
   (`src/pages/CaseStudyHomepage/CaseStudyHomepage.tsx`,
   `src/pages/CaseStudyHumanAI/CaseStudyHumanAI.tsx`,
   `src/pages/CaseStudyAutomatedCalendar/CaseStudyAutomatedCalendar.tsx`)
   are only swept when passed explicitly, e.g. `/copysweep "src/pages/CaseStudy*/*.tsx"`.

2. **Read `house-style.md`.**

3. **Per target file, dispatch 4 `Explore` agents as blocking parallel calls in ONE
   message** — four `Agent` calls, `subagent_type: "Explore"`, `run_in_background: false`
   on every one. They run concurrently and all four results return in the same turn, so
   consolidation (step 5) happens immediately after. **Do not** launch them in the
   background and end the turn with "I'll post the report when they land" — that state is
   a dead end. If a runtime cannot block on parallel subagents, launch them, then in the
   same turn poll until all four have reported before doing anything else.

   Each prompt contains: the file path, the full text of `house-style.md`, the output
   contract (step 4), and one lens brief:

   | Agent | Lens | Flags ONLY |
   |---|---|---|
   | 1 | Spelling & typos | misspellings, transposed letters, doubled words, doubled spaces, missing space after punctuation, wrong homophones. Nothing about grammar or style. |
   | 2 | Grammar & parallelism | subject–verb agreement, tense drift within a passage, dangling/misplaced modifiers, comma splices, run-ons, missing articles, pronoun–antecedent agreement, wrong preposition, AND all faulty parallelism — both in coordination ("Plan and presenting") and across list-item siblings ("Co-creating" among "Involved"/"Communicated"). Not spelling, not taste. |
   | 3 | House-style consistency | every rule in `house-style.md`: British spelling, compound-modifier hyphenation, list/heading end-punctuation, em dash vs hyphen, `No.` vs `No:`, proper-noun capitalisation, Oxford comma, `&` vs "and", `35k+`. Cite the rule broken. |
   | 4 | Clarity | word or root repetition within one sentence, redundancy, trailing/incomplete thoughts, genuinely garden-path or ambiguous phrasing, stacked-participle or otherwise clumsy constructions. NOT parallelism, NOT comma splices, NOT agreement — those belong to agent 2. Not minor stylistic taste. |

   If there are **more than 3 target files**, process one file at a time (its 4 agents →
   consolidate → next file) so the merge stays tractable.

4. **Output contract** — paste verbatim into every agent prompt:

   > Return ONLY a list, one finding per line, exactly:
   > `LINE <n> | <severity> | "<quote with the bad span bolded>" | <problem in one clause> | <suggested fix>`
   > severity ∈ {error, consistency, style}. error = a definite mistake (typo, agreement,
   > splice, dangling modifier). consistency = breaks a rule in house-style.md. style =
   > defensible but weaker phrasing.
   > In the quote, reproduce the copy verbatim BUT wrap the exact offending span in `**…**`
   > (markdown bold) so the reader can spot it at a glance — e.g.
   > `"will make it easier **target** SMBs"`, `"patterns for analytical homepages **was**"`.
   > Bold only the span that is wrong, not the whole sentence.
   > Only flag issues in YOUR lens. No preamble, no summary, no praise. Nothing found →
   > return the single line `NONE`.
   > Scope: only user-facing copy — `heading`/`title`/`body`/`label`/`description`/
   > `prefix`/`link`/`captionItems`/`items`/`alt`/`aria-label` strings and JSX text.
   > Never flag code identifiers, `className` strings, `/* Figma node */` comments, asset
   > filenames, or commented-out JSX.

5. **Consolidate.** Merge every agent's findings across every file. Drop duplicates —
   same file + same line + overlapping quote — keeping the entry with the more specific
   fix. Sort by file, then severity (error → consistency → style), then line. Render one
   `## [<relative/path>](<relative/path>)` heading per file, then a **table per severity
   group** (`### Errors`, `### Consistency`, `### Style`), each with exactly these
   columns, **keeping each agent's `**…**` bold on the offending span** in the Copy cell:

   ```
   ## [<relative/path>](<relative/path>)

   ### Errors

   | Line | Copy | Fix |
   |---|---|---|
   | [<n>](<path>#L<n>) | "…quote with the **bad span** bolded…" | <corrected text> — <problem in a few words> |

   ### Consistency

   | Line | Copy | Fix |
   |---|---|---|
   | … | … | … |

   ### Style

   | Line | Copy | Fix |
   |---|---|---|
   | … | … | … |
   ```

   Keep Copy cells short — quote just the phrase around the bad span, not the whole
   sentence. Escape any literal `|` inside a cell as `\|`. Omit an empty group entirely.
   A wholly clean file gets one line saying so instead of tables.

6. **Coverage line.** Finish with: files swept, agents run, findings by severity. Do not
   edit anything and do not offer to unless asked.

## Common mistakes

- **Consolidating without deduping.** Agents 1 and 2 both catch a typo that is also
  ungrammatical; agent 3 restates a hyphenation agent 2 flagged as parallelism. Merge on
  file + line + overlapping quote, keep the most specific fix, report it once.
- **Letting agents drift out of lens.** An agent "helpfully" flagging things outside its
  brief reintroduces the noise this split exists to remove. The lens table and the
  "only flag issues in YOUR lens" line are load-bearing — keep them in the prompt.
- **Flagging asset filenames or Figma comments.** Out of scope — the scope line in the
  output contract is not optional.
- **Skipping the house-style read.** Agent 3 goes non-deterministic and every run turns
  up different "consistency" findings — the exact failure this skill exists to fix.
- **Backgrounding the agents and ending the turn.** "I'll post the report when they land"
  is a dead end — the run just stops. Launch all four in one message with
  `run_in_background: false` and consolidate in the same turn.
- **Not bolding the bad span.** Every quoted finding must wrap the offending text in
  `**…**`. If an agent returns a plain quote, bold the span yourself during consolidation.
