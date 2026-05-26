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
