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
