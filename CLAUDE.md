# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Required instructions

Before starting any task, read and follow the repository root `AGENTS.md`.

`AGENTS.md` is the source of truth for:

- Project scope
- Architecture and directory structure
- Next.js conventions
- API and state-management conventions
- Testing requirements
- Git branch and commit conventions
- Completion checklist
- Prohibited changes

If this document conflicts with `AGENTS.md`, follow `AGENTS.md`.

## Claude Code workflow

Before editing:

1. Check the current branch and working tree.
2. Read the related issue and repository documentation.
3. Inspect the existing implementation before creating new patterns.
4. Identify the minimum files required for the task.

After editing:

1. Review the diff for unrelated changes.
2. Run lint, type-check, relevant tests, and build.
3. Remove debugging logs and unused code.
4. Report changed files, validation results, and remaining issues.

Do not modify generated files, lockfiles, environment files, or CI settings unless the task explicitly requires it.
