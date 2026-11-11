# estilolibre.eu — Landing personal

Landing minimalista con estética de terminal retro, lista para desplegar en **Cloudflare Pages**.

## Archivos

| Archivo       | Descripción                                        |
| ------------- | -------------------------------------------------- |
| `index.html`  | Estructura de la página (ventana de terminal)       |
| `styles.css`  | Estilos: CRT verde sobre negro, monoespaciada       |
| `script.js`   | Efecto máquina de escribir + cursor parpadeante     |
| `favicon.svg` | Icono del sitio                                     |
| `_headers`    | Reglas de caché para Cloudflare Pages               |

Sin build ni dependencias: HTML, CSS y JS puro.

## Desplegar en Cloudflare

### Opción A — Dashboard (drag & drop)
1. Entra en [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Upload assets**.
2. Nombre del proyecto: `estilolibre` (la web quedará en `estilolibre.pages.dev`).
3. Arrastra esta carpeta completa y pulsa **Deploy**.

### Opción B — Con Git (despliegue automático)
1. Sube este proyecto a GitHub.
2. En Cloudflare: **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Selecciona el repositorio:
   - **Framework preset:** None
   - **Build command:** (vacío)
   - **Output directory:** `/`
4. Guarda; cada `git push` desplegará automáticamente.

### Conectar el dominio propio
Después del primer despliegue: proyecto → **Custom domains** → **Set up a custom domain** → `estilolibre.eu`. Cloudflare se encarga del DNS y del HTTPS automáticamente.

## Probar en local

```bash
python3 -m http.server 8080
# abre http://localhost:8080
```

## Personalizar

- **Contenido de la terminal:** edita el array `LINES` al inicio de `script.js`
  (comandos, salidas y enlaces que se escriben solos).
- **Colores:** variables CSS en la cabecera de `styles.css`
  (`--green` para el texto principal, `--amber` para los enlaces).
- **Redes:** objetos `link` dentro de `LINES` en `script.js`.
