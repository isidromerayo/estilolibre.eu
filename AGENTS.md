# AGENTS.md — estilolibre.eu

Static personal landing page (Spanish) with a retro-terminal aesthetic. Deploys to Cloudflare.

## Stack & commands

- Plain HTML/CSS/JS. **No build step, no dependencies, no linting.** Do not add a bundler or framework.
- Local preview: `python3 -m http.server 8080 --directory public` from the repo root.
- The site lives in `public/` — that directory is the deploy unit. Repo-root files (`AGENTS.md`, `README.md`, `.github/`, `.pa11y-ci.json`, `wrangler.jsonc`) must never end up served on the site.

## Verification (required before commit)

1. Start the preview: `python3 -m http.server 8080 --directory public` (repo root, keep it running).
2. Run the accessibility audit — **must pass with 0 errors**:

   ```bash
   PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium pa11y-ci --config .pa11y-ci.json
   ```

   - Config (`.pa11y-ci.json`) uses `standard: WCAG2AA` + `runners: ["axe"]`, dos entradas de URL sobre la misma página: tema oscuro por defecto y tema claro tras pulsar `#theme`.
   - axe-core is what provides **WCAG 2.2 AA** coverage: the bundled HTML CodeSniffer (2.6) predates 2.2 and does not check its SCs (2.4.11, 3.3.7, 2.5.8…).
   - The global pa11y-ci's puppeteer ignores `chromeLaunchConfig` from the JSON — the `PUPPETEER_EXECUTABLE_PATH` env var is the only thing that makes it use the system Chromium. Do not remove it.
   - Emoji-presentation glyphs (e.g. `□` alone) break axe's color-contrast measurement and false-fail; force text presentation with `&#xFE0E;`.
   - **Audit both themes**, not just the default. `.pa11y-ci.json` lists `http://localhost:8080` twice: once as-is (oscuro) and once with `"actions": ["click element #theme"]`, so axe measures the light palette after really pressing the toggle. Keep both entries — a light token that measures fine on `--term` can still fail on `--bar`/`--btn` (that's how `--green-dim` at 4.07:1 slipped through), and check every background a variable actually lands on.
   - Do not add `transition` on `background-color`/`color` for theme changes: axe samples the interpolated value, so the audit fails on text that is mid-fade over a background that already switched.
3. Also eyeball the page at `http://localhost:8080` — the terminal session must type itself end to end with the blinking cursor as final prompt.

## Deployment

- **Deploys automatically via GitHub Actions** (`.github/workflows/deploy.yml`): every push to `main` runs `wrangler deploy` with `wrangler.jsonc` (worker `estilolibre-eu`, static assets from `public/`).
- Requires repo secrets `CLOUDFLARE_API_TOKEN` (Account · Workers Scripts · Edit) and `CLOUDFLARE_ACCOUNT_ID` — manage them in GitHub, never commit them.
- Do not commit tokens, API keys or account specifics anywhere in the repo.

## Repo conventions

- **Git identity is not configured globally.** Every commit needs explicit `-c user.name="Isidro Merayo" -c user.email="isidromerayo@users.noreply.github.com"`.
- Commits follow Conventional Commits (`feat:`, `fix:`, …), lowercase, no trailing period.
- **Cache-busting: `index.html` references `styles.css?v=N` and `script.js?v=N`. Bump both `N` on every CSS/JS change** or stale browser cache shows broken mixes (this already bit once: a prompt rewrite vanished until versions were bumped).
- **`public/_headers`: never add a blanket `/*` `Cache-Control` rule.** Matching rules accumulate and a repeated header is comma-joined, so `/*` silently overrides the per-file TTLs (two `max-age` directives → RFC 9111 §4.2.1 keeps the first). Keep `/` and `/index.html` at `max-age=0, must-revalidate`: the footer's deploy date lives in the HTML and the `?v=N` bump cannot refresh it.

## Where content lives

- Terminal script (typed lines, manifesto text, social links): the `LINES` array at the top of `public/script.js`. Line types: `cmd` (typed), `out`, `dim`, `link`, `spacer`.
- Prompt (PS1): `makePrompt()` in `public/script.js` builds colored spans; colors map to CSS classes `.p-*` in `public/styles.css`.
- Colors/theme: CSS variables in `:root` of `public/styles.css` (phosphor green `--green`, amber links `--amber`).
- Accessibility: respect `prefers-reduced-motion` — effects added in `script.js` must check the `reduceMotion` flag.
- Deploy date (footer): `deploy.yml` `sed`-replaces the `__DEPLOYED_ISO__` / `__DEPLOYED_LABEL__` markers in `public/index.html` with the run timestamp. Keep the marker names in sync between HTML and workflow — the step fails the build if any marker is left unresolved. Locally `script.js` removes the `#deployed` span, so the footer shows no date in preview (that's expected, not a bug).
- Theme ("colores claros"): dark stays the default in `:root`; light is `:root[data-theme="light"]` in `public/styles.css`. The inline `<head>` script in `index.html` reads `localStorage.theme` **before first paint** (no flash), and `script.js` only syncs the `#theme` button (`aria-pressed` + glyph) and writes the preference. **Every color must reference a CSS variable** — no literal hex outside those two blocks — or light mode silently misses it (that's how `.terminal__title` over `--bar`, `--cyan` and `--blue` first failed AA).
