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
  { type: "out", html: "ideas, código y vida, con estilo libre." },
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
  { type: "cmd", text: "" }, // prompt final vacío, con cursor
];

const term = document.getElementById("term");
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

function makeLine(line) {
  const el = document.createElement("div");
  el.className =
    `line line--${line.type}` + (line.dim ? " line--dim" : "");
  return el;
}

function makeCursor() {
  const c = document.createElement("span");
  c.className = "cursor";
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
        el.appendChild(a);
      } else if (line.type === "out") {
        el.innerHTML = line.html;
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
