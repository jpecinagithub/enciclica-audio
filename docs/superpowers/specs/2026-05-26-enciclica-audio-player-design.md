# Diseño: Reproductor de Audio — Magnifica Humanitas

**Fecha:** 2026-05-26  
**Encíclica:** Magnifica Humanitas, Papa León XIV  
**Stack:** Vite 5 + React 18 + Tailwind CSS 3 + lucide-react  
**Deploy:** Vercel (frontend only, sin backend, sin DB)

---

## 1. Estructura de Archivos

```
enciclica-audio/
├── public/
│   ├── audio/                          ← mover desde audio/
│   │   ├── prologo.mp3
│   │   ├── capitulo-1.mp3 … capitulo-5.mp3
│   │   └── conclusion.mp3
│   ├── images/                         ← mover desde images/
│   │   └── leon1.jpg … leon9.jpg
│   └── docs/
│       └── Magnifica_Humanitas_Leon_XIV.pdf  ← mover desde docs/
├── src/
│   ├── components/
│   │   ├── AudioPlayer.jsx
│   │   ├── ImageCarousel.jsx
│   │   └── Playlist.jsx
│   ├── hooks/
│   │   └── useAudioPlayer.js
│   ├── data/
│   │   ├── tracks.js
│   │   └── images.js
│   ├── utils/
│   │   └── formatters.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
└── .gitignore
```

---

## 2. Arquitectura de Componentes

```
App
├── ImageCarousel          z-0, fixed, full-screen background
└── layout (z-10)
    ├── Header             Título + subtítulo + botón PDF
    └── Glass Card
        ├── Playlist       Lista de tracks, track activo resaltado
        └── AudioPlayer    Controles + progreso + volumen + velocidad
```

**Flujo de datos:** `useAudioPlayer(tracks)` en `App` → props down a `AudioPlayer` y `Playlist`. Sin estado compartido entre componentes — todo centralizado en el hook.

---

## 3. Hook: `useAudioPlayer`

Estado interno:
- `currentIndex` — track activo
- `isPlaying` — bool
- `currentTime`, `duration` — números en segundos
- `volume` — 0–1, default 0.8
- `playbackRate` — default 1
- `isLoading` — bool (evento `waiting`)

Callbacks expuestos:
- `togglePlay()` — play/pause
- `goNext()`, `goPrev()` — siguiente/anterior (prev resetea si > 3s)
- `seek(t)` — saltar a segundo t
- `changeVolume(v)` — cambiar volumen
- `changeRate(r)` — cambiar velocidad
- `selectTrack(i)` — seleccionar track desde playlist (siempre inicia play)

Auto-avance: evento `ended` → `currentIndex + 1` con autoplay via `shouldAutoPlayRef`.

---

## 4. Datos Estáticos

### `src/data/tracks.js`
```js
// 7 tracks en orden canónico
const files = ['prologo.mp3', 'capitulo-1.mp3', ..., 'conclusion.mp3']
// formatName: 'prologo' → 'Prólogo', 'capitulo-1' → 'Capítulo 1', 'conclusion' → 'Conclusión'
export const tracks = files.map((f, i) => ({ id: i, filename: f, title: formatName(f), src: `/audio/${f}` }))
```

### `src/data/images.js`
```js
export const images = ['/images/leon1.jpg', ..., '/images/leon9.jpg']
```

---

## 5. Componentes

### `ImageCarousel`
- `fixed inset-0 z-0`
- 9 imágenes `leon1–9.jpg`, fade cada 5s vía `setInterval` + `transition-opacity duration-1000`
- Overlay `bg-black/60` para legibilidad
- Sin imágenes → gradiente animado CSS fallback

### `AudioPlayer`
- Track title + "Ahora escuchando"
- Progress bar: div custom (fill amber) + `<input type="range">` invisible encima para interacción
- Thumb visible en hover
- Botones: ⏮ ▶/⏸ ⏭ (play = 64×64px amber-400, hover scale-105)
- Spinner de carga cuando `isLoading`
- Volume: icono mute toggle + slider custom
- Speed: botones 0.75x / 1x / 1.25x / 1.5x / 2x (activo = amber-400)
- Tiempos: `formatTime(currentTime)` / `formatTime(duration)`

### `Playlist`
- Header "Contenido"
- Lista: número/icono + título
- Track activo: fondo `bg-white/15`, texto `amber-400`, icono amber
- `overflow-y-auto max-h-[40vh] lg:max-h-[60vh]`
- Click → `selectTrack(i)`

### Header (en `App`)
- `"Magnifica Humanitas"` — título principal
- `"Papa León XIV"` — subtítulo
- Botón `📄 Leer encíclica` → `href="/docs/Magnifica_Humanitas_Leon_XIV.pdf"` `target="_blank"`

---

## 6. Diseño Visual

| Token | Valor |
|-------|-------|
| Fondo | Carrusel `leon1-9.jpg` o gradiente `zinc-950→indigo-950` animado |
| Card | `bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl` |
| Acento | `amber-400` |
| Texto | `white`, `white/60`, `white/40` |
| Botón play | `bg-amber-400 text-black rounded-full w-16 h-16` |

**Layout:**
- Desktop (≥lg): Card 2 columnas — Playlist 2/5 izq, AudioPlayer 3/5 der
- Mobile: AudioPlayer arriba (order-1), Playlist abajo (order-2)

---

## 7. Accesibilidad

- `aria-label` en todos los botones de control
- `aria-current="true"` en track activo de la playlist
- `aria-label` en todos los `<input type="range">`
- Navegación por teclado funcional (botones nativos)

---

## 8. Deploy

`vercel.json` mínimo para detectar Vite. `npm run build` genera `dist/`. Vercel sirve `dist/` estáticamente. Todos los assets en `public/` quedan en raíz del servidor.

---

## 9. Fuera de Alcance

- Backend / API
- Base de datos
- Autenticación
- Transcripciones
- PWA / Service Worker
- React Router
