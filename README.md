# estilolibre.eu — Landing personal

Landing minimalista con estética de terminal retro, lista para desplegar en **Cloudflare Pages**.

## Archivos

| Archivo            | Descripción                                        |
| ------------------ | -------------------------------------------------- |
| `public/index.html`  | Estructura de la página (ventana de terminal)       |
| `public/styles.css`  | Estilos: CRT verde sobre negro, monoespaciada       |
| `public/script.js`   | Efecto máquina de escribir + cursor parpadeante     |
| `public/favicon.svg` | Icono del sitio                                     |
| `public/_headers`    | Caché: HTML revalidado, assets con TTL largo (sin regla `/*`) |
| `wrangler.jsonc`     | Config de despliegue en Cloudflare Workers          |

Sin build ni dependencias: HTML, CSS y JS puro.

## Desplegar

Automático: cada push a `main` despliega en Cloudflare Workers mediante
GitHub Actions (necesita los secrets `CLOUDFLARE_API_TOKEN` y
`CLOUDFLARE_ACCOUNT_ID` en el repo).

En el mismo workflow, el paso *Inject deploy date* sustituye en
`public/index.html` los marcadores `__DEPLOYED_ISO__` y `__DEPLOYED_LABEL__`
por la fecha UTC de la ejecución, que es la que se muestra en el pie.
Localmente esos marcadores no se resuelven y `script.js` quita el texto.

## Probar en local

```bash
python3 -m http.server 8080 --directory public
# abre http://localhost:8080
```

## Personalizar

- **Contenido de la terminal:** edita el array `LINES` al inicio de `script.js`
  (comandos, salidas y enlaces que se escriben solos).
- **Colores:** variables CSS en la cabecera de `styles.css`
  (`--green` para el texto principal, `--amber` para los enlaces).
- **Redes:** objetos `link` dentro de `LINES` en `script.js`.
