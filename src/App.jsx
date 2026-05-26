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

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex flex-col lg:flex-row">
              <div className="order-1 lg:order-2 flex-1 border-b lg:border-b-0 lg:border-l border-white/10">
                <AudioPlayer {...player} />
              </div>
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
