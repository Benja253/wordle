const arrWordle = []

const cambio = {
  'á': 'a',
  'é': 'e',
  'í': 'i',
  'ó': 'o',
  'ú': 'u'
}

const palabras = arrWordle.map(word => {
  return word.split('').map(e => cambio[e] || e).join('')
}).toSorted().filter(e => e.length === 5)
