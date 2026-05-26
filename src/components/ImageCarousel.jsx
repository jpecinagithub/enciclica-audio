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
