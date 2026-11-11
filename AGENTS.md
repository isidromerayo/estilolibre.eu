# AGENTS.md — estilolibre.eu

Static personal landing page (Spanish) with a retro-terminal aesthetic. Deploys to Cloudflare.

## Stack & commands

- Plain HTML/CSS/JS. **No build step, no dependencies, no linting.** Do not add a bundler or framework.
- Local preview: `python3 -m http.server 8080` from the repo root.

## Verification (required before commit)

1. Start the preview: `python3 -m http.server 8080` (repo root, keep it running).
2. Run the accessibility audit — **must pass with 0 errors**:

   ```bash
   PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium pa11y-ci --config .pa11y-ci.json
   ```

   - Config (`.pa11y-ci.json`) uses `standard: WCAG2AA` + `runners: ["axe"]`.
   - axe-core is what provides **WCAG 2.2 AA** coverage: the bundled HTML CodeSniffer (2.6) predates 2.2 and does not check its SCs (2.4.11, 3.3.7, 2.5.8…).
   - The global pa11y-ci's puppeteer ignores `chromeLaunchConfig` from the JSON — the `PUPPETEER_EXECUTABLE_PATH` env var is the only thing that makes it use the system Chromium. Do not remove it.
   - Emoji-presentation glyphs (e.g. `□` alone) break axe's color-contrast measurement and false-fail; force text presentation with `&#xFE0E;`.
3. Also eyeball the page at `http://localhost:8080` — the terminal session must type itself end to end with the blinking cursor as final prompt.

## Deployment

- Deployed to Cloudflare by the owner. **No CI/CD in this repo** — do not add deploy automation without asking; deployment details are handled outside the repository.
- Do not commit tokens, API keys or account specifics anywhere in the repo.

## Repo conventions

- **Git identity is not configured globally.** Every commit needs explicit `-c user.name="Isidro Merayo" -c user.email="isidromerayo@users.noreply.github.com"`.
- Commits follow Conventional Commits (`feat:`, `fix:`, …), lowercase, no trailing period.
- **Cache-busting: `index.html` references `styles.css?v=N` and `script.js?v=N`. Bump both `N` on every CSS/JS change** or stale browser cache shows broken mixes (this already bit once: a prompt rewrite vanished until versions were bumped).

## Where content lives

- Terminal script (typed lines, manifesto text, social links): the `LINES` array at the top of `script.js`. Line types: `cmd` (typed), `out`, `dim`, `link`, `spacer`.
- Prompt (PS1): `makePrompt()` in `script.js` builds colored spans; colors map to CSS classes `.p-*` in `styles.css`.
- Colors/theme: CSS variables in `:root` of `styles.css` (phosphor green `--green`, amber links `--amber`).
- Accessibility: respect `prefers-reduced-motion` — effects added in `script.js` must check the `reduceMotion` flag.
