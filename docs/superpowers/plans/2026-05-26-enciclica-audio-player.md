# Magnifica Humanitas Audio Player — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Spotify-style audio player SPA for the encíclica "Magnifica Humanitas" by Papa León XIV — glassmorphism card, full-screen image carousel, responsive, deploys to Vercel.

**Architecture:** Single-page React app. All audio logic in `useAudioPlayer` hook. Static data files for tracks (`prologo`, `capitulo-1…5`, `conclusion`) and images (`leon1-9.jpg`). No backend, no router — pure Vite + React + Tailwind. Desktop: 2-column card (playlist left | player right). Mobile: player top, playlist bottom.

**Tech Stack:** Vite 5, React 18, Tailwind CSS 3, lucide-react, Vitest (unit tests for pure functions only)

---

## File Map

| File | Responsibility |
|------|----------------|
| `public/audio/*.mp3` | 7 audio files served statically |
| `public/images/leon1-9.jpg` | 9 carousel images served statically |
| `public/docs/Magnifica_Humanitas_Leon_XIV.pdf` | PDF served statically |
| `package.json` | Dependencies + scripts |
| `vite.config.js` | Vite + React plugin + Vitest config |
| `tailwind.config.js` | Content paths |
| `postcss.config.js` | Tailwind + autoprefixer |
| `index.html` | HTML entry point |
| `.gitignore` | Ignore node_modules, dist |
| `vercel.json` | Vercel deployment config |
| `src/main.jsx` | React root mount |
| `src/index.css` | Tailwind directives + animated-gradient class |
| `src/utils/formatters.js` | `formatTime(seconds)` pure function |
| `src/utils/formatters.test.js` | Vitest unit tests for formatters |
| `src/data/tracks.js` | Static track list with title formatting |
| `src/data/images.js` | Static image path list |
| `src/hooks/useAudioPlayer.js` | All audio state + callbacks |
| `src/components/ImageCarousel.jsx` | Fixed full-screen background carousel |
| `src/components/Playlist.jsx` | Track list, active state |
| `src/components/AudioPlayer.jsx` | Player controls UI |
| `src/App.jsx` | Layout, header, PDF link, composes all |

---

## Task 1: Move assets to `public/`

**Files:**
- Move: `audio/*.mp3` → `public/audio/*.mp3`
- Move: `images/*.jpg` → `public/images/*.jpg`
- Move: `docs/*.pdf` → `public/docs/*.pdf`

- [ ] **Step 1: Create public subdirectories and move files**

Run in project root (`C:\Users\HP\Documents\GiithubREPOSITORIES\enciclica-audio`):

```powershell
New-Item -ItemType Directory -Force "public\audio"
New-Item -ItemType Directory -Force "public\images"
New-Item -ItemType Directory -Force "public\docs"
Move-Item "audio\*" "public\audio\"
Move-Item "images\*" "public\images\"
Move-Item "docs\Magnifica_Humanitas_Leon_XIV.pdf" "public\docs\"
```

Expected: `public/audio/` contains 7 MP3s, `public/images/` contains 9 JPGs, `public/docs/` contains the PDF. The original `audio/`, `images/`, `docs/` folders are now empty (or removed).

- [ ] **Step 2: Remove empty source directories**

```powershell
Remove-Item -Force "audio" -ErrorAction SilentlyContinue
Remove-Item -Force "images" -ErrorAction SilentlyContinue
Remove-Item "docs" -ErrorAction SilentlyContinue
```

Note: `docs/` now has `superpowers/` subfolder so only remove if truly empty — skip if it errors.

---

## Task 2: Project config files

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `.gitignore`
- Create: `vercel.json`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "enciclica-audio",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "lucide-react": "^0.395.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "vite": "^5.3.1",
    "vitest": "^1.6.0"
  }
}
```

- [ ] **Step 2: Create `vite.config.js`**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
  },
})
```

- [ ] **Step 3: Create `tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {} },
  plugins: [],
}
```

- [ ] **Step 4: Create `postcss.config.js`**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 5: Create `index.html`**

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Magnifica Humanitas — Papa León XIV</title>
    <meta name="description" content="Escucha la encíclica Magnifica Humanitas del Papa León XIV" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Create `.gitignore`**

```
node_modules/
dist/
.env
.env.*
*.local
.DS_Store
```

- [ ] **Step 7: Create `vercel.json`**

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
```

---

## Task 3: Entry point + CSS

**Files:**
- Create: `src/main.jsx`
- Create: `src/index.css`

- [ ] **Step 1: Create `src/main.jsx`**

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

- [ ] **Step 2: Create `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.animated-gradient {
  background: linear-gradient(-45deg, #09090b, #18181b, #1e1b4b, #1c1917);
  background-size: 400% 400%;
  animation: gradientShift 20s ease infinite;
}
```

- [ ] **Step 3: Install dependencies**

```powershell
npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 4: Create minimal `src/App.jsx` to verify dev server starts**

```jsx
export default function App() {
  return <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">OK</div>
}
```

- [ ] **Step 5: Run dev server**

```powershell
npm run dev
```

Expected output includes: `Local: http://localhost:5173/`. Open browser → white "OK" text on dark background. Stop server (Ctrl+C).

---

## Task 4: Utility functions + tests

**Files:**
- Create: `src/utils/formatters.js`
- Create: `src/utils/formatters.test.js`

- [ ] **Step 1: Create `src/utils/formatters.js`**

```js
export function formatTime(seconds) {
  if (!isFinite(seconds) || isNaN(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}
```

- [ ] **Step 2: Create `src/utils/formatters.test.js`**

```js
import { describe, it, expect } from 'vitest'
import { formatTime } from './formatters'

describe('formatTime', () => {
  it('formats zero', () => expect(formatTime(0)).toBe('0:00'))
  it('formats seconds under a minute', () => expect(formatTime(45)).toBe('0:45'))
  it('formats exactly one minute', () => expect(formatTime(60)).toBe('1:00'))
  it('formats minutes and seconds', () => expect(formatTime(75)).toBe('1:15'))
  it('pads single-digit seconds', () => expect(formatTime(61)).toBe('1:01'))
  it('formats over one hour', () => expect(formatTime(3661)).toBe('61:01'))
  it('handles NaN', () => expect(formatTime(NaN)).toBe('0:00'))
  it('handles Infinity', () => expect(formatTime(Infinity)).toBe('0:00'))
  it('handles negative', () => expect(formatTime(-5)).toBe('0:00'))
})
```

- [ ] **Step 3: Run tests**

```powershell
npm test
```

Expected: 9 tests pass, 0 fail.

---

## Task 5: Static data files

**Files:**
- Create: `src/data/tracks.js`
- Create: `src/data/images.js`

- [ ] **Step 1: Create `src/data/tracks.js`**

```js
function formatName(filename) {
  const base = filename.replace('.mp3', '')
  const map = { prologo: 'Prólogo', conclusion: 'Conclusión' }
  if (map[base]) return map[base]
  const m = base.match(/^capitulo-(\d+)$/)
  if (m) return `Capítulo ${m[1]}`
  return base.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
}

const FILES = [
  'prologo.mp3',
  'capitulo-1.mp3',
  'capitulo-2.mp3',
  'capitulo-3.mp3',
  'capitulo-4.mp3',
  'capitulo-5.mp3',
  'conclusion.mp3',
]

export const tracks = FILES.map((filename, id) => ({
  id,
  filename,
  title: formatName(filename),
  src: `/audio/${filename}`,
}))
```

- [ ] **Step 2: Create `src/data/images.js`**

```js
export const images = Array.from({ length: 9 }, (_, i) => `/images/leon${i + 1}.jpg`)
```

---

## Task 6: `useAudioPlayer` hook

**Files:**
- Create: `src/hooks/useAudioPlayer.js`

The hook creates a single `Audio` element lazily (via ref), attaches all event listeners once on mount, and uses a `shouldAutoPlayRef` to communicate "should the next track auto-play" across state updates.

- [ ] **Step 1: Create `src/hooks/useAudioPlayer.js`**

```js
import { useState, useEffect, useRef, useCallback } from 'react'

export function useAudioPlayer(tracks) {
  const audioRef = useRef(null)
  const shouldAutoPlayRef = useRef(false)
  const playbackRateRef = useRef(1)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  function getAudio() {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.volume = 0.8
    }
    return audioRef.current
  }

  // Attach event listeners once on mount
  useEffect(() => {
    const a = getAudio()
    const onTime = () => setCurrentTime(a.currentTime)
    const onDuration = () => { if (!isNaN(a.duration)) setDuration(a.duration) }
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onWaiting = () => setIsLoading(true)
    const onCanPlay = () => setIsLoading(false)
    const onEnded = () => {
      shouldAutoPlayRef.current = true
      setCurrentIndex(i => (i + 1) % tracks.length)
    }

    a.addEventListener('timeupdate', onTime)
    a.addEventListener('durationchange', onDuration)
    a.addEventListener('play', onPlay)
    a.addEventListener('pause', onPause)
    a.addEventListener('waiting', onWaiting)
    a.addEventListener('canplay', onCanPlay)
    a.addEventListener('ended', onEnded)

    return () => {
      a.removeEventListener('timeupdate', onTime)
      a.removeEventListener('durationchange', onDuration)
      a.removeEventListener('play', onPlay)
      a.removeEventListener('pause', onPause)
      a.removeEventListener('waiting', onWaiting)
      a.removeEventListener('canplay', onCanPlay)
      a.removeEventListener('ended', onEnded)
      a.pause()
    }
  }, [tracks.length])

  // Load new track when currentIndex changes
  useEffect(() => {
    const a = getAudio()
    const track = tracks[currentIndex]
    if (!track) return
    a.src = track.src
    a.playbackRate = playbackRateRef.current
    setCurrentTime(0)
    setDuration(0)
    if (shouldAutoPlayRef.current) {
      shouldAutoPlayRef.current = false
      a.play().catch(console.error)
    }
  }, [currentIndex, tracks])

  const togglePlay = useCallback(async () => {
    const a = getAudio()
    if (!a.src && tracks[currentIndex]) a.src = tracks[currentIndex].src
    if (a.paused) {
      await a.play().catch(console.error)
    } else {
      a.pause()
    }
  }, [currentIndex, tracks])

  const goNext = useCallback(() => {
    shouldAutoPlayRef.current = !getAudio().paused
    setCurrentIndex(i => (i + 1) % tracks.length)
  }, [tracks.length])

  const goPrev = useCallback(() => {
    const a = getAudio()
    if (a.currentTime > 3) {
      a.currentTime = 0
    } else {
      shouldAutoPlayRef.current = !a.paused
      setCurrentIndex(i => (i - 1 + tracks.length) % tracks.length)
    }
  }, [tracks.length])

  const seek = useCallback((t) => {
    const a = getAudio()
    a.currentTime = t
    setCurrentTime(t)
  }, [])

  const changeVolume = useCallback((v) => {
    const a = getAudio()
    a.volume = v
    setVolume(v)
  }, [])

  const changeRate = useCallback((r) => {
    const a = getAudio()
    a.playbackRate = r
    playbackRateRef.current = r
    setPlaybackRate(r)
  }, [])

  const selectTrack = useCallback((index) => {
    if (index === currentIndex) {
      togglePlay()
    } else {
      shouldAutoPlayRef.current = true
      setCurrentIndex(index)
    }
  }, [currentIndex, togglePlay])

  return {
    currentTrack: tracks[currentIndex],
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    playbackRate,
    isLoading,
    togglePlay,
    goNext,
    goPrev,
    seek,
    changeVolume,
    changeRate,
    selectTrack,
  }
}
```

---

## Task 7: `ImageCarousel` component

**Files:**
- Create: `src/components/ImageCarousel.jsx`

Renders as `fixed inset-0` (behind everything). Cycles through images with CSS opacity fade. If `images` array is empty, renders the `.animated-gradient` CSS class from `index.css`.

- [ ] **Step 1: Create `src/components/ImageCarousel.jsx`**

```jsx
import { useState, useEffect } from 'react'

export default function ImageCarousel({ images }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const id = setInterval(() => setCurrent(i => (i + 1) % images.length), 5000)
    return () => clearInterval(id)
  }, [images.length])

  if (images.length === 0) {
    return <div className="fixed inset-0 animated-gradient" aria-hidden="true" />
  }

  return (
    <div className="fixed inset-0" aria-hidden="true">
      {images.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img src={src} alt="" className="w-full h-full object-cover" />
        </div>
      ))}
      <div className="absolute inset-0 bg-black/65" />
    </div>
  )
}
```

---

## Task 8: `Playlist` component

**Files:**
- Create: `src/components/Playlist.jsx`

- [ ] **Step 1: Create `src/components/Playlist.jsx`**

```jsx
import { Play, Pause } from 'lucide-react'

export default function Playlist({ tracks, currentIndex, isPlaying, onSelect }) {
  return (
    <div>
      <div className="px-6 py-4 border-b border-white/10">
        <h2 className="text-white/50 text-xs font-semibold tracking-widest uppercase">
          Contenido
        </h2>
      </div>
      <div className="overflow-y-auto max-h-[35vh] lg:max-h-[55vh]">
        {tracks.map((track, i) => {
          const isActive = i === currentIndex
          return (
            <button
              key={track.id}
              onClick={() => onSelect(i)}
              className={`w-full flex items-center gap-3 px-6 py-3.5 text-left transition-colors hover:bg-white/10 ${
                isActive ? 'bg-white/15' : ''
              }`}
              aria-label={`${track.title}${isActive ? ', reproduciendo' : ''}`}
              aria-current={isActive ? 'true' : undefined}
            >
              <div
                className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  isActive ? 'bg-amber-400 text-black' : 'bg-white/15 text-white/50'
                }`}
              >
                {isActive && isPlaying ? (
                  <Pause size={12} />
                ) : isActive ? (
                  <Play size={12} className="ml-0.5" />
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`text-sm font-medium ${
                  isActive ? 'text-amber-400' : 'text-white/80'
                }`}
              >
                {track.title}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
```

---

## Task 9: `AudioPlayer` component

**Files:**
- Create: `src/components/AudioPlayer.jsx`

Progress bar and volume slider use the "invisible range input over visible div" pattern: the div provides the visual, the `<input type="range" className="opacity-0">` provides the interactive hit target.

- [ ] **Step 1: Create `src/components/AudioPlayer.jsx`**

```jsx
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'
import { formatTime } from '../utils/formatters'

const SPEEDS = [0.75, 1, 1.25, 1.5, 2]

export default function AudioPlayer({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  playbackRate,
  isLoading,
  togglePlay,
  goNext,
  goPrev,
  seek,
  changeVolume,
  changeRate,
}) {
  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className="flex flex-col justify-center gap-6 p-6 lg:p-10">
      {/* Track info */}
      <div>
        <p className="text-white/40 text-xs tracking-widest uppercase mb-1">
          Ahora escuchando
        </p>
        <h2 className="text-white text-2xl font-semibold leading-tight">
          {currentTrack?.title ?? '—'}
        </h2>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="relative h-1.5 group cursor-pointer">
          <div className="absolute inset-0 bg-white/20 rounded-full" />
          <div
            className="absolute inset-y-0 left-0 bg-amber-400 rounded-full"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{ left: `${progress}%` }}
          />
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.5}
            value={currentTime}
            onChange={e => seek(+e.target.value)}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            aria-label="Posición de reproducción"
          />
        </div>
        <div className="flex justify-between text-white/40 text-xs tabular-nums">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Play controls */}
      <div className="flex items-center justify-center gap-8">
        <button
          onClick={goPrev}
          className="text-white/60 hover:text-white transition-colors"
          aria-label="Anterior o reiniciar"
        >
          <SkipBack size={22} />
        </button>

        <button
          onClick={togglePlay}
          disabled={isLoading}
          className="w-16 h-16 rounded-full bg-amber-400 hover:bg-amber-300 flex items-center justify-center text-black transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause size={22} />
          ) : (
            <Play size={22} className="ml-0.5" />
          )}
        </button>

        <button
          onClick={goNext}
          className="text-white/60 hover:text-white transition-colors"
          aria-label="Siguiente"
        >
          <SkipForward size={22} />
        </button>
      </div>

      {/* Volume + Speed */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Volume */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button
            onClick={() => changeVolume(volume > 0 ? 0 : 0.8)}
            className="text-white/40 hover:text-white transition-colors flex-shrink-0"
            aria-label={volume === 0 ? 'Activar sonido' : 'Silenciar'}
          >
            {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <div className="relative h-1 flex-1 group cursor-pointer">
            <div className="absolute inset-0 bg-white/20 rounded-full" />
            <div
              className="absolute inset-y-0 left-0 bg-white/60 rounded-full"
              style={{ width: `${volume * 100}%` }}
            />
            <input
              type="range"
              min={0}
              max={1}
              step={0.02}
              value={volume}
              onChange={e => changeVolume(+e.target.value)}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              aria-label="Volumen"
            />
          </div>
        </div>

        {/* Speed selector */}
        <div className="flex gap-1 flex-shrink-0">
          {SPEEDS.map(s => (
            <button
              key={s}
              onClick={() => changeRate(s)}
              className={`text-xs px-2 py-1 rounded-md font-medium transition-all ${
                playbackRate === s
                  ? 'bg-amber-400 text-black'
                  : 'text-white/40 hover:text-white hover:bg-white/10'
              }`}
              aria-label={`Velocidad ${s}x`}
              aria-pressed={playbackRate === s}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
```

---

## Task 10: `App.jsx` — full integration

**Files:**
- Modify: `src/App.jsx` (replace the placeholder from Task 3)

- [ ] **Step 1: Replace `src/App.jsx` with full implementation**

```jsx
import { FileText } from 'lucide-react'
import { tracks } from './data/tracks'
import { images } from './data/images'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import ImageCarousel from './components/ImageCarousel'
import AudioPlayer from './components/AudioPlayer'
import Playlist from './components/Playlist'

export default function App() {
  const player = useAudioPlayer(tracks)

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <ImageCarousel images={images} />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 py-10">
        <div className="w-full max-w-5xl">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-1">
                Papa León XIV
              </p>
              <h1 className="text-white text-2xl sm:text-3xl font-light tracking-tight">
                Magnifica Humanitas
              </h1>
            </div>
            <a
              href="/docs/Magnifica_Humanitas_Leon_XIV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white/50 hover:text-amber-400 transition-colors text-sm mt-1 flex-shrink-0 ml-4"
              aria-label="Leer encíclica completa en PDF"
            >
              <FileText size={16} />
              <span className="hidden sm:inline">Leer encíclica</span>
            </a>
          </div>

          {/* Main card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex flex-col lg:flex-row">
              {/* AudioPlayer: top on mobile (order-1), right on desktop (order-2) */}
              <div className="order-1 lg:order-2 flex-1 border-b lg:border-b-0 lg:border-l border-white/10">
                <AudioPlayer {...player} />
              </div>
              {/* Playlist: bottom on mobile (order-2), left on desktop (order-1) */}
              <div className="order-2 lg:order-1 lg:w-2/5">
                <Playlist
                  tracks={tracks}
                  currentIndex={player.currentIndex}
                  isPlaying={player.isPlaying}
                  onSelect={player.selectTrack}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Run dev server and verify**

```powershell
npm run dev
```

Open `http://localhost:5173` and verify:
- Background carousel cycles through `leon1-9.jpg` with fade
- Header shows "Magnifica Humanitas" + "Papa León XIV" + PDF link
- Playlist shows: Prólogo, Capítulo 1–5, Conclusión
- Click play button → audio starts
- Progress bar fills and shows time
- Click track in playlist → switches track and plays
- Next/Prev buttons work
- Volume slider works
- Speed buttons highlight active speed
- PDF link opens the encíclica
- Resize to mobile → player on top, playlist below

Stop server (Ctrl+C).

- [ ] **Step 3: Run build to verify Vercel-ready output**

```powershell
npm run build
```

Expected: `dist/` folder created, no errors. Output shows `dist/index.html` and hashed JS/CSS files.

---

## Task 11: Final commit

- [ ] **Step 1: Stage all files**

```powershell
git init
git add .
```

- [ ] **Step 2: Commit**

```powershell
git commit -m "feat: add Magnifica Humanitas audio player (Vite + React + Tailwind)"
```

Expected: commit created with all project files.

---

## Self-Review Checklist

- [x] **Assets moved:** Task 1 moves all MP3s, JPGs, PDF to `public/`
- [x] **All 7 tracks:** FILES array in `tracks.js` includes prologo, capitulo-1…5, conclusion
- [x] **All 9 images:** `images.js` generates `leon1.jpg`…`leon9.jpg`
- [x] **PDF link:** `App.jsx` header has `href="/docs/Magnifica_Humanitas_Leon_XIV.pdf"`
- [x] **Play/Pause:** `togglePlay` + button in `AudioPlayer`
- [x] **Next/Prev:** `goNext`/`goPrev` + SkipForward/SkipBack buttons
- [x] **Progress bar:** seek-capable range input in `AudioPlayer`
- [x] **Time display:** `formatTime(currentTime)` / `formatTime(duration)`
- [x] **Volume control:** slider + mute toggle in `AudioPlayer`
- [x] **Speed selector:** 0.75/1/1.25/1.5/2x buttons in `AudioPlayer`
- [x] **Carousel:** `ImageCarousel` cycles 9 images with 5s interval + fade
- [x] **Glassmorphism card:** `bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl`
- [x] **Responsive:** `flex-col lg:flex-row` + `order-1/2` for mobile/desktop layout
- [x] **Accessibility:** `aria-label` on all interactive elements, `aria-current` on active track
- [x] **Auto-advance:** `onEnded` handler in hook sets `shouldAutoPlayRef.current = true`
- [x] **Vercel deploy:** `vercel.json` present, `npm run build` produces `dist/`
- [x] **No backend/DB/router:** pure static SPA
- [x] **Type consistency:** `selectTrack(i)` used in both `Playlist` (`onSelect`) and `App` (`player.selectTrack`) — matches hook export name
