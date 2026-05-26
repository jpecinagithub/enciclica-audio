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
