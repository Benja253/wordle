let palabraDelDia = todasLasPalabras[Math.floor(Math.random() * todasLasPalabras.length)]

const body = document.getElementById('body')
const words = document.querySelectorAll('.word')
const teclado = document.getElementById('teclado')

let fila = 0
let columna = 0

words[fila].children[columna].classList.add('letterActive')

const palabraExiste = (palabra, arrPalabras) => arrPalabras.includes(palabra.toLowerCase())

const comprobarPalabra = (palabra, wordDay) => {
  let arrResult = []
  const arrWordDay = wordDay.toUpperCase().split('')
  const arrPalabra = palabra.toUpperCase().split('')
  let arrContador = arrWordDay.reduce((acc, cv) => {
    if(acc.hasOwnProperty(cv)) {
      acc[cv] += 1
    } else {
      acc[cv] = 1
    }
    return acc
  },{})
  // solo coincidencias verdes
  arrResult = arrPalabra.map((e, index) => {
    const obj = {value: e, coincidencia: 'no'}
    if(arrWordDay[index] === e ) {
      arrContador[e] -= 1
      return {...obj, coincidencia: 'perfect'}
    } else {
      return obj
    }
  })
  console.log(arrContador)
  // Colocar amarillas solo si es necesario
  arrResult = arrPalabra.map((e, i) => {
    const obj = {value: e, coincidencia: 'imperfect'}
    console.log({
      'la inclye': wordDay.includes(palabra[i]),
      'contador': arrContador[e],
      'distinto perfect': arrResult[i].coincidencia
    })
    if (wordDay.toUpperCase().includes(palabra[i]) && arrContador[e] !== 0 && arrResult[i].coincidencia !== 'perfect') {
      arrContador[e] -= 1
      return obj
    } else {
      return arrResult[i]
    }
  })
  console.log({arrResult, arrContador, wordDay})
  if(arrResult.every(cv => cv.coincidencia === 'perfect')) {
    document.getElementById('resultado').innerHTML = `<span class='resultado__gratz'>🎉¡Felicidades!</span>
    <span class='resultado__phrase'>La palabra buscada es: </span><span class='resultado__word'>${arrResult.map(e => e.value).join('')}</span>`
  }
  if(fila === 5 && !arrResult.every(cv => cv.coincidencia === 'perfect')) {
    document.getElementById('resultado').innerHTML = `<span class='resultado__gratz'>❌¡No encontraste la palabra! 😞</span>
    <span class='resultado__phrase'>La palabra buscada era: </span><span class='resultado__word notfound'>${palabraDelDia.toUpperCase()}</span>`
  }
  return arrResult
}

const callbackEnter = (palabra) => {
  const objetoCoincidencias = comprobarPalabra(palabra, palabraDelDia)
  for(let i = 0; i < objetoCoincidencias.length; i++) {
    words[fila].children[i].lastElementChild.classList.add(objetoCoincidencias[i].coincidencia)
    setTimeout(() => {
      const isFinalWord = words[5].children[4].lastElementChild.textContent !== ''
      words[isFinalWord ? 5 : fila - 1].children[i].firstElementChild.classList.remove('front')
      words[isFinalWord ? 5 : fila - 1].children[i].firstElementChild.classList.add('back')
      words[isFinalWord ? 5 : fila - 1].children[i].lastElementChild.classList.remove('back')
      words[isFinalWord ? 5 : fila - 1].children[i].lastElementChild.classList.add('front')
    }, 200*i)
  }
  setTimeout(() => {
    objetoCoincidencias.forEach((e) => {
      document.getElementById(e.value.toLowerCase()).classList.add(e.coincidencia)
    })
  }, 800)
  if(fila < 5) {
    words[fila ].children[columna].classList.remove('letterActive')
    columna = 0
    fila++
    words[fila].children[columna].classList.add('letterActive')
  }
}

body.addEventListener('keydown', e => {
  
  let casillaSeleccionada = words[fila].children[columna]

  // Comprueba si es una palabra
  if(columna <= 4 && /[a-zA-ZñÑ]/.test(e.key) && e.key.length === 1 && casillaSeleccionada.firstElementChild.textContent === '') {
    casillaSeleccionada.firstElementChild.textContent = e.key.toUpperCase()
    casillaSeleccionada.lastElementChild.textContent = e.key.toUpperCase()
    if(columna < 4) {
      casillaSeleccionada.classList.remove('letterActive')
      columna++
      words[fila].children[columna].classList.add('letterActive')
    }
  }

  // Funcionalidad cuando se apreta la tecla backscace
  if(e.key === 'Backspace' && fila !== 6) {
    if(columna === 4 && words[fila].children[columna].firstElementChild.textContent !== '' ) {
      words[fila].children[columna].firstElementChild.textContent = ''
      words[fila].children[columna].lastElementChild.textContent = ''
    } else {
      if(columna > 0) {
        words[fila].children[columna].classList.remove('letterActive')
        words[fila].children[columna - 1].classList.add('letterActive')
        words[fila].children[columna - 1].firstElementChild.textContent = ''
        words[fila].children[columna - 1].lastElementChild.textContent = ''
        columna--
      }
    }
  }

  // Funcionalidad cuando se apreta la tecla enter
  if(e.key == 'Enter' && fila <= 5 && words[fila].children[4].lastElementChild.textContent !== '') {
    let palabra = ''
    for(let j = 0; j < 5;j++) {
      palabra += words[fila].children[j].lastElementChild.textContent
    }
    if(palabraExiste(palabra, todasLasPalabras)) {
      callbackEnter(palabra)
    } else {
      alert('La palabra no existe')
    }
  }
})

teclado.addEventListener('click', (e) => {

  if(/[a-zA-ZñÑ]/.test(e.target.id) && e.target.id.length === 1) {
    words[fila].children[columna].firstElementChild.textContent = e.target.id.toUpperCase()
    words[fila].children[columna].lastElementChild.textContent = e.target.id.toUpperCase()
    if(columna < 4) {
      words[fila].children[columna].classList.remove('letterActive')
      columna++
      words[fila].children[columna].classList.add('letterActive')
    }
  }

  if((e.target.id == 'Enter' || e.target.parentElement.id == 'Enter') && fila <= 5 && words[fila].children[4].lastElementChild.textContent !== '') {
    let palabra = ''
    for(let j = 0; j < 5;j++) {
      palabra += words[fila].children[j].lastElementChild.textContent
    }
    if(palabraExiste(palabra, todasLasPalabras)) {
      callbackEnter(palabra)
    } else {
      alert('La palabra no existe')
    }
  }

  if((e.target.id === 'Backspace' || e.target.parentElement.id === 'Backspace') && fila !== 6) {
    if(columna === 4 && words[fila].children[columna].firstElementChild.textContent !== '' ) {
      words[fila].children[columna].firstElementChild.textContent = ''
      words[fila].children[columna].lastElementChild.textContent = ''
    } else {
      if(columna > 0) {
        words[fila].children[columna].classList.remove('letterActive')
        words[fila].children[columna - 1].classList.add('letterActive')
        words[fila].children[columna - 1].firstElementChild.textContent = ''
        words[fila].children[columna - 1].lastElementChild.textContent = ''
        columna--
      }
    }
  }
})