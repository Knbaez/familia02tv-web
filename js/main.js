// =========================================================
// CONFIGURACIÓN — edita solo esta sección
// =========================================================

const CONFIG = {
  // Pega aquí tu clave de YouTube Data API v3 cuando la generes.
  // Instrucciones completas en README.md.
  // Mientras esté vacía, el catálogo usa los videos de respaldo de abajo.
  YOUTUBE_API_KEY: "AIzaSyAVcdSIYI3ClbvCABUtYgu8kTvG9mKE4YQ",

  // ID del canal oficial de LaMole02TV (ya confirmado, no cambiar).
  CHANNEL_ID: "UC_sJWGYSpYGEblOy-cfaA2g",

  // Cuántos videos mostrar en el catálogo.
  MAX_VIDEOS: 12,

  // Horas que se guarda la respuesta de YouTube en caché antes de
  // volver a consultar la API (para no gastar cuota innecesariamente).
  CACHE_HOURS: 6,
};

// El ID de la "uploads playlist" de un canal es su ID cambiando el
// prefijo UC por UU. Es un truco estándar de la API de YouTube.
const UPLOADS_PLAYLIST_ID = "UU" + CONFIG.CHANNEL_ID.slice(2);

// =========================================================
// Videos de respaldo (los que ya están publicados en el canal).
// Se muestran si todavía no has puesto una API key, y además
// evitan que el catálogo se vea vacío si YouTube no responde.
// =========================================================

const FALLBACK_VIDEOS = [
  { id: "Vyh9shY8LJY", title: "Su ambición tuvo un precio y lo pagó caro 😱#drama", date: "2026-09-02" },
  { id: "0wlVR6uDvM8", title: "Su madre le dio una lección por arrogante 😱#viral#familia", date: "2026-09-02" },
  { id: "uydUfCp-aTY", title: "Estaba embarazada de otro hombre y todo salió a la luz 😱#viral#drama", date: "2026-08-30" },
  { id: "xEnUmVnYSeY", title: "Policía despoja de su pertenencia a una americana y al final mira cómo terminó 😱#viral#drama", date: "2026-08-27" },
  { id: "L70uej-tYys", title: "Viajera puso a su familia a prueba y quedó sorprendida 😱#viral#drama", date: "2026-08-26" },
  { id: "fLDMa666mYw", title: "Mi hijo quiere dinero a la mala y mira dónde terminó 😱#viralvideo", date: "2026-08-26" },
  { id: "zIBWKGHtD-c", title: "Se metió al negocio equivocado y terminó mal 😱#viralvideo", date: "2026-08-24" },
  { id: "MMGlUjU4gXc", title: "Mi mejor amigo no me apoyó en mi peor momento y la vida le dio una lección 😱#drama#viral", date: "2026-08-21" },
  { id: "SIUrLA41a-4", title: "No le importó que era su padre y como quiera lo hizo 😱#drama", date: "2026-08-20" },
  { id: "YPKWEqQYSrg", title: "Mi ex no me deja en paz y le puse una orden de alejamiento 😱#viral#drama", date: "2026-08-18" },
  { id: "GnBoTHbrvzc", title: "La policía está para proteger, no para hacer daño 😱#drama#police", date: "2026-08-17" },
  { id: "Tc5Y7Ec9io0", title: "Quería destruir mi relación y se inventó una historia falsa 😱💔#viral#drama", date: "2026-08-14" },
];

// =========================================================
// Elenco (tomado del contexto confirmado del proyecto)
// =========================================================

const CAST = [
  { name: "Nelson", role: "Elenco recurrente" },
  { name: "Yarelis", role: "Elenco recurrente" },
  { name: "Maciel", role: "Elenco recurrente" },
  { name: "Daniel", role: "Elenco recurrente" },
  { name: "Aneudi", role: "Elenco recurrente" },
  { name: "Marlon", role: "Elenco recurrente" },
  { name: "Lucero", role: "Elenco recurrente" },
  { name: "Edwin", role: "Elenco recurrente" },
  { name: "Cris", role: "Elenco recurrente" },
  { name: "La Makina", role: "Elenco recurrente" },
];

// =========================================================
// Render: catálogo de videos
// =========================================================

function formatDate(isoDate) {
  const d = new Date(isoDate);
  return d.toLocaleDateString("es-DO", { day: "numeric", month: "long", year: "numeric" });
}

function renderVideos(videos) {
  const grid = document.getElementById("videoGrid");
  grid.innerHTML = videos.map(v => `
    <a class="video-card" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener">
      <div class="video-thumb">
        <img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="${escapeHtml(v.title)}" loading="lazy">
      </div>
      <div class="video-card-body">
        <p class="video-date">${formatDate(v.date)}</p>
        <p class="video-title">${escapeHtml(v.title)}</p>
      </div>
    </a>
  `).join("");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function showStatus(message) {
  const status = document.getElementById("videoStatus");
  status.textContent = message;
  status.hidden = !message;
}

// =========================================================
// Carga de videos: caché -> API de YouTube -> respaldo
// =========================================================

async function loadVideos() {
  const cacheKey = "lamole_videos_cache";
  const cached = readCache(cacheKey);

  if (cached) {
    renderVideos(cached);
    return;
  }

  if (!CONFIG.YOUTUBE_API_KEY) {
    renderVideos(FALLBACK_VIDEOS);
    return;
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${CONFIG.MAX_VIDEOS}&playlistId=${UPLOADS_PLAYLIST_ID}&key=${CONFIG.YOUTUBE_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("YouTube API respondió con error " + res.status);
    const data = await res.json();

    const videos = data.items.map(item => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      date: item.snippet.publishedAt,
    }));

    renderVideos(videos);
    writeCache(cacheKey, videos);
  } catch (err) {
    console.error("No se pudo actualizar desde YouTube:", err);
    renderVideos(FALLBACK_VIDEOS);
    showStatus("No se pudo conectar con YouTube en este momento. Mostrando el último catálogo disponible.");
  }
}

function readCache(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { savedAt, videos } = JSON.parse(raw);
    const ageHours = (Date.now() - savedAt) / 1000 / 60 / 60;
    if (ageHours > CONFIG.CACHE_HOURS) return null;
    return videos;
  } catch {
    return null;
  }
}

function writeCache(key, videos) {
  try {
    localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), videos }));
  } catch {
    // almacenamiento no disponible, no es crítico
  }
}

// =========================================================
// Render: elenco
// =========================================================

function renderCast() {
  const grid = document.getElementById("castGrid");
  grid.innerHTML = CAST.map(person => `
    <div class="cast-card">
      <div class="cast-avatar"><span>${person.name.charAt(0)}</span></div>
      <p class="cast-name">${escapeHtml(person.name)}</p>
      <p class="cast-role">${escapeHtml(person.role)}</p>
    </div>
  `).join("");
}

// =========================================================
// Menú móvil
// =========================================================

function initNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("siteNav");
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => nav.classList.remove("open"));
  });
}

// =========================================================
// Init
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();
  initNav();
  renderCast();
  loadVideos();
});
