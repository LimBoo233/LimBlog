# Repository Guidelines

## Project Structure & Module Organization
- `docs/` is the site source. Add or edit Markdown pages here (for example, `docs/index.md`).
- `docs/notes/` holds longer note collections and topic folders.
- `docs/public/` contains static assets served at the site root (for example, `docs/public/images/logo.png`).
- `docs/.vitepress/` contains VitePress configuration (`config.ts`), theme overrides, and build output.
- Root files include `package.json` and `pnpm-lock.yaml` for dependency management.

## Build, Test, and Development Commands
- `pnpm install`: install dependencies.
- `pnpm dev`: start the VitePress dev server for live editing of `docs/`.
- `pnpm build`: build the static site (output to `docs/.vitepress/dist`).
- `pnpm serve`: preview the built site locally.

## Coding Style & Naming Conventions
- Use Markdown for content pages and TypeScript for VitePress config/custom logic.
- Preserve existing formatting; `docs/.vitepress/config.ts` currently uses 4-space indentation.
- Prefer lowercase, hyphenated filenames for new pages (for example, `docs/notes/learning-plan.md`).
- Keep static assets under `docs/public/` and reference them with absolute paths like `/images/file.png`.

## Testing Guidelines
- No automated tests are configured.
- Validate changes by running `pnpm dev` for local review, or `pnpm build` to ensure the site builds cleanly.

## Commit & Pull Request Guidelines
- Recent commit messages are short, imperative summaries (often in Chinese), such as verbs like "add", "update", or "fix".
- Keep commits focused on one change area when possible.
- For pull requests, include a clear description, link any relevant issues, and add screenshots or GIFs for visible UI/content changes.

## Security & Configuration Tips
- Avoid committing secrets or tokens; keep any third-party keys out of the repo.
- Do not edit `docs/.vitepress/cache` or `docs/.vitepress/dist` by hand; treat them as generated output.
