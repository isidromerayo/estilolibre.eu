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

## Desplegar

El despliegue en Cloudflare lo gestiona el propietario. Los pasos no se documentan
en este repositorio.

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
