let palabraDelDia = palabrasSelect[Math.floor(Math.random() * palabrasSelect.length)]

const body = document.getElementById('body')
const words = document.querySelectorAll('.word')
const teclado = document.getElementById('teclado')
const modal = document.getElementById('modal')
const btnRepeat = document.getElementById('modalBtn')
const box = document.getElementById('box')

let fila = 0
let columna = 0

words[fila].children[columna].classList.add('letterActive')

// Comprueba si la palabra existe en la base de datos
const palabraExiste = (palabra, arrPalabras) => arrPalabras.includes(palabra.toLowerCase())

const cambiarAVacios = (arrPalabra) => {
  if(arrPalabra.indexOf('') != -1) {
    words[fila].children[columna].classList.remove('letterActive')
    columna = arrPalabra.indexOf('')
    words[fila].children[columna].classList.add('letterActive')
  } else {
    columna = 4
  }
}

// Comprobar si es la misma palabra
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

  // Colocar amarillas solo si es necesario
  arrResult = arrPalabra.map((e, i) => {
    const obj = {value: e, coincidencia: 'imperfect'}

    if (wordDay.toUpperCase().includes(palabra[i]) && arrContador[e] !== 0 && arrResult[i].coincidencia !== 'perfect') {
      arrContador[e] -= 1
      return obj
    } else {
      return arrResult[i]
    }
  })

  if(arrResult.every(cv => cv.coincidencia === 'perfect')) {
    const titleModal = modal.firstElementChild.firstElementChild
    const spanResult = modal.firstElementChild.children[1].firstElementChild
    const btnModal = modal.firstElementChild.children[3].firstElementChild
    const imgModal = modal.firstElementChild.children[2].firstElementChild

    titleModal.textContent = 'Ganaste 🎉'
    spanResult.classList.remove('modal__red')
    btnModal.classList.remove('modal__red')
    imgModal.src = './assets/imgs/meme-muy-bien.jpg'
    spanResult.textContent = wordDay
    modal.classList.remove('modal__hidden')
  }
  if(fila === 5 && !arrResult.every(cv => cv.coincidencia === 'perfect')) {
    const titleModal = modal.firstElementChild.firstElementChild
    const spanResult = modal.firstElementChild.children[1].firstElementChild
    const btnModal = modal.firstElementChild.children[3].firstElementChild
    const imgModal = modal.firstElementChild.children[2].firstElementChild

    titleModal.textContent = 'Perdiste ❌'
    spanResult.classList.add('modal__red')
    btnModal.classList.add('modal__red')
    imgModal.src = './assets/imgs/meme-ninio-venas.jpg'
    spanResult.textContent = wordDay
    modal.classList.remove('modal__hidden')
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
    words[fila].children[columna].classList.remove('letterActive')
    columna = 0
    fila++
    words[fila].children[columna].classList.add('letterActive')
  }
}

body.addEventListener('keydown', e => {
  
  let casillaSeleccionada = words[fila].children[columna]

  // Comprueba si es una letra
  if(columna <= 4 && /[a-zA-ZñÑ]/.test(e.key) && e.key.length === 1 && casillaSeleccionada.firstElementChild.textContent === '') {
    casillaSeleccionada.firstElementChild.textContent = e.key.toUpperCase()
    casillaSeleccionada.lastElementChild.textContent = e.key.toUpperCase()
    if(columna < 4) {
      casillaSeleccionada.classList.remove('letterActive')
      columna++
      words[fila].children[columna].classList.add('letterActive')
    }
    let palabra = []
    for(let j = 0; j < 5;j++) {
      palabra.push(words[fila].children[j].lastElementChild.textContent)
    }
    if(palabra.includes("") && palabra[4] != "") {
      cambiarAVacios(palabra)
    }
    if(!palabra.includes("")) {
      words[fila].children[columna].classList.remove('letterActive')
      columna = 4
      words[fila].children[columna].classList.add('letterActive')
    }
  }

  // Funcionalidad cuando se apreta la tecla backscace
  if(e.key === 'Backspace' && fila !== 6) {
    if(words[fila].children[columna].firstElementChild.textContent !== '') {
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
    let palabra = []
    for(let j = 0; j < 5;j++) {
      palabra.push(words[fila].children[j].lastElementChild.textContent)
    }
    if(palabra.every(e => e == "")) {
      words[fila].children[columna].classList.remove('letterActive')
      fila = 0
      columna = 0
      words[fila].children[columna].classList.add('letterActive')
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

// Uso del teclado visual
teclado.addEventListener('click', (e) => {

  if(/[a-zA-ZñÑ]/.test(e.target.id) && e.target.id.length === 1 && words[fila].children[columna].firstElementChild.textContent === '') {
    words[fila].children[columna].firstElementChild.textContent = e.target.id.toUpperCase()
    words[fila].children[columna].lastElementChild.textContent = e.target.id.toUpperCase()
    if(columna < 4) {
      words[fila].children[columna].classList.remove('letterActive')
      columna++
      words[fila].children[columna].classList.add('letterActive')
    }
    let palabra = []
    for(let j = 0; j < 5;j++) {
      palabra.push(words[fila].children[j].lastElementChild.textContent)
    }
    if(palabra.includes("") && palabra[4] != "") {
      cambiarAVacios(palabra)
    }
    if(!palabra.includes("")) {
      words[fila].children[columna].classList.remove('letterActive')
      columna = 4
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
    if(words[fila].children[columna].firstElementChild.textContent !== '' ) {
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
    let palabra = []
    for(let j = 0; j < 5;j++) {
      palabra.push(words[fila].children[j].lastElementChild.textContent)
    }
    if(palabra.every(e => e == "")) {
      words[fila].children[columna].classList.remove('letterActive')
      fila = 0
      columna = 0
      words[fila].children[columna].classList.add('letterActive')
    }
  }
})

// Cambiar la casilla activa
box.addEventListener('click', (e) => {
  const classSelect = e.target.parentElement.parentElement.classList.value.split(" ")
  if(classSelect?.includes('word') && fila + 1  == classSelect[0].at(4)) {
    words[fila].children[columna].classList.remove('letterActive')
    columna = e.target.parentElement.classList[0].at(6) - 1
    words[fila].children[columna].classList.add('letterActive')
  }
})

btnRepeat.addEventListener('click', () => {
  location.reload()
})