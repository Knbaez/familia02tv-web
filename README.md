# LaMole02TV — Sitio oficial

Primera versión de prueba. Sitio estático (HTML/CSS/JS), sin WordPress ni
servidor: se puede subir a cualquier hosting tal cual, incluido Hostinger.

## Archivos

- `index.html` — todo el contenido de la página
- `css/style.css` — estilos
- `js/main.js` — lógica: catálogo de YouTube, elenco, menú móvil

## Activar la actualización automática de YouTube (5 minutos)

Ahora mismo el catálogo muestra los videos reales del canal, pero como
lista fija (no se actualiza sola). Para que se actualice automáticamente
cuando publiquen un video nuevo, necesitas una clave gratuita de la API
de YouTube:

1. Entra a https://console.cloud.google.com/
2. Crea un proyecto (cualquier nombre, ej. "LaMole02TV Web").
3. Ve a **APIs y servicios → Biblioteca**, busca **YouTube Data API v3** y
   actívala.
4. Ve a **APIs y servicios → Credenciales → Crear credenciales → Clave de
   API**.
5. Muy importante: haz clic en la clave recién creada y en
   **Restricciones de la aplicación** elige **Sitios web (HTTP referrer)**
   y agrega tu dominio (ej. `lamole02tv.com/*`). Esto evita que otros usen
   tu clave.
6. Copia la clave y pégala en `js/main.js`, en esta línea:

   ```js
   YOUTUBE_API_KEY: "",
   ```

   Déjala así: `YOUTUBE_API_KEY: "TU_CLAVE_AQUI",`

Con eso, el catálogo se actualiza solo. La cuota gratuita de YouTube
(10,000 unidades diarias) es más que suficiente para un sitio como este;
el sitio además guarda los resultados en caché 6 horas para gastar
todavía menos.

## Sobre Facebook

Por ahora Facebook solo aparece como enlace directo a la página oficial
(sección Contacto). Automatizar la lectura de videos de Facebook requiere
que Meta apruebe una aplicación y renovar tokens de acceso periódicamente
— no es algo que un sitio estático pueda mantener solo. Si más adelante
lo necesitan, es un desarrollo aparte.

## Publicar el sitio

Sube los tres elementos (`index.html`, `css/`, `js/`) a la raíz de tu
hosting (por ejemplo, por FTP o el administrador de archivos de
Hostinger). No requiere base de datos ni instalación.

## Pendientes conocidos (para siguientes versiones)

- Confirmar roles reales de cada integrante del elenco.
- Definir si cada producción tendrá página propia (útil para reclamos
  de copyright más detallados).
- Logo e imágenes propias de marca (por ahora se usan solo miniaturas
  reales de YouTube).
- Página de políticas de privacidad / términos si se necesitan.
