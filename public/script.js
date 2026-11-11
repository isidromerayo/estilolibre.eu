// ===== estilolibre.eu — terminal que se escribe sola =====

const LINES = [
  { type: "out", html: "estilolibre 1.0 — tty1", dim: true },
  { type: "out", html: "última conexión: desde siempre. hoy es un buen día.", dim: true },
  { type: "spacer" },
  { type: "cmd", text: "whoami" },
  { type: "out", html: "isidro merayo castellano" },
  { type: "cmd", text: "cat manifiesto.txt" },
  { type: "out", html: "indie rock electro pop." },
  { type: "out", html: "#LosIndiesNoTomanElSol #QueJodidoEsSerModerno" },
  { type: "out", html: "#ViveLeRock #vermú" },
  { type: "out", html: "emigrante en #Valladolor. bembibre, #ElBierzo." },
  { type: "cmd", text: "ls ~/redes" },
  {
    type: "link",
    label: "twitter.com/isidromerayo",
    href: "https://twitter.com/isidromerayo",
  },
  {
    type: "link",
    label: "github.com/isidromerayo",
    href: "https://github.com/isidromerayo",
  },
  { type: "out", html: "¿colores claros? el botón de arriba a la derecha", dim: true },
  { type: "cmd", text: "" }, // prompt final vacío, con cursor
];

const term = document.getElementById("term");
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// ===== tema: oscuro por defecto, "colores claros" opcional =====
const THEME_KEY = "theme";
const themeBtn = document.getElementById("theme");
const themeGlyph = themeBtn?.querySelector(".theme-toggle__glyph");

// el <script> del head ya decidió el tema; ausente = oscuros
const currentTheme = () =>
  document.documentElement.dataset.theme === "light" ? "light" : "dark";

// solo pinta el botón: no escribe data-theme, para no pisar lo que hay
function syncThemeButton(theme) {
  if (!themeBtn) return;
  themeBtn.setAttribute("aria-pressed", String(theme === "light"));
  // ☀︎ pide los claros, ☾︎ devuelve los oscuros (VS15: presentación de texto)
  if (themeGlyph) themeGlyph.textContent = theme === "light" ? "\u263E\uFE0E" : "\u2600\uFE0E";
}

if (themeBtn) {
  syncThemeButton(currentTheme());
  themeBtn.addEventListener("click", () => {
    const next = currentTheme() === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    syncThemeButton(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (err) {
      /* se cambia en memoria, solo se pierde al recargar */
    }
  });
}

function makeLine(line) {
  const el = document.createElement("div");
  el.className =
    `line line--${line.type}` + (line.dim ? " line--dim" : "");
  if (line.type === "cmd") el.appendChild(makePrompt());
  return el;
}

// PS1: imc@estilolibre.eu:~ (main)$ con colores por segmento
function makePrompt() {
  const p = document.createElement("span");
  p.className = "prompt";
  p.innerHTML =
    '<span class="p-user">imc</span>' +
    '<span class="p-at">@</span>' +
    '<span class="p-host">estilolibre.eu</span>' +
    '<span class="p-sep">:</span>' +
    '<span class="p-path">~</span>' +
    ' <span class="p-branch">(main)</span>' +
    '<span class="p-dollar">$ </span>';
  return p;
}

function makeCursor() {
  const c = document.createElement("span");
  c.className = "cursor";
  c.setAttribute("aria-hidden", "true");
  return c;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function typeCmd(el, text) {
  el.appendChild(makeCursor());
  for (const ch of text) {
    el.insertBefore(document.createTextNode(ch), el.lastChild);
    await sleep(45);
  }
}

async function run() {
  for (const line of LINES) {
    const el = makeLine(line);
    term.appendChild(el);

    if (reduceMotion) {
      // sin animación: pintar todo de golpe
      if (line.type === "link") {
        const a = document.createElement("a");
        a.href = line.href;
        a.textContent = line.label;
        a.setAttribute("aria-label", `Perfil en ${line.label}`);
        el.appendChild(a);
      } else if (line.type === "out") {
        el.innerHTML = line.html;
      } else if (line.type === "cmd") {
        el.appendChild(document.createTextNode(line.text));
      }
      continue;
    }

    if (line.type === "cmd") {
      await typeCmd(el, line.text);
      await sleep(250);
      // quitar el cursor de esta línea
      el.lastChild?.classList?.contains("cursor") && el.lastChild.remove();
    } else {
      if (line.type === "link") {
        const a = document.createElement("a");
        a.href = line.href;
        a.textContent = line.label;
        a.setAttribute("aria-label", `Perfil en ${line.label}`);
        el.appendChild(a);
      } else if (line.html !== undefined) {
        el.innerHTML = line.html;
      }
      await sleep(350);
    }
  }

  // prompt final con cursor parpadeante permanente
  const last = term.querySelector(".line:last-child");
  if (last && !last.querySelector(".cursor")) last.appendChild(makeCursor());
}

run();

// año del footer
document.getElementById("year").textContent = new Date().getFullYear();

// fecha de despliegue: el CI (deploy.yml) sustituye los marcadores __DEPLOYED_*__
// de index.html. En la vista local siguen sin resolver, así que se quita el span.
const deployed = document.getElementById("deployed");
if (deployed && deployed.textContent.includes("__DEPLOYED")) deployed.remove();
