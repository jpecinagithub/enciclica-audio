import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Gauge } from 'lucide-react'
import { formatTime } from '../utils/formatters'

const SPEED_MIN = 0.75
const SPEED_MAX = 1.25

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
      <div>
        <p className="text-white/40 text-xs tracking-widest uppercase mb-1">
          Ahora escuchando
        </p>
        <h2 className="text-white text-2xl font-semibold leading-tight">
          {currentTrack?.title ?? '—'}
        </h2>
      </div>

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

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
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

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Gauge size={18} className="text-white/40 flex-shrink-0" aria-hidden="true" />
          <div className="relative h-1 flex-1 group cursor-pointer">
            <div className="absolute inset-0 bg-white/20 rounded-full" />
            <div
              className="absolute inset-y-0 left-0 bg-white/60 rounded-full"
              style={{ width: `${((playbackRate - SPEED_MIN) / (SPEED_MAX - SPEED_MIN)) * 100}%` }}
            />
            <input
              type="range"
              min={SPEED_MIN}
              max={SPEED_MAX}
              step={0.05}
              value={playbackRate}
              onChange={e => changeRate(+e.target.value)}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              aria-label="Velocidad de reproducción"
            />
          </div>
          <span className="text-white/40 text-xs tabular-nums w-10 text-right flex-shrink-0">
            {playbackRate.toFixed(2)}x
          </span>
        </div>
      </div>
    </div>
  )
}
