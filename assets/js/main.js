let palabraDelDia = palabrasSelect[Math.floor(Math.random() * palabrasSelect.length)]

const body = document.getElementById('body')
const words = document.querySelectorAll('.word')
const teclado = document.getElementById('teclado')
const modal = document.getElementById('modal')
const btnRepeat = document.getElementById('modalBtn')
const box = document.getElementById('box')
const notification = document.getElementById('notification')
const stats = document.getElementById('modal__stats')

let fila = 0
let columna = 0
let endGame = false

words[fila].children[columna].classList.add('letterActive')

// Comprueba si la palabra existe en la base de datos
const palabraExiste = (palabra, arrPalabras) => arrPalabras.includes(palabra.toLowerCase())

// Cambiar el casilla activa
const cambiarActivo = (columnaNueva, filaNueva = fila) => {
  words[fila].children[columna].classList.remove('letterActive')
  columna = columnaNueva
  fila = filaNueva
  words[fila].children[columnaNueva].classList.add('letterActive')
}

// Buscar campos vacíos
const BuscarVacios = (arrPalabra, desde = 0) => {
  if(arrPalabra.indexOf('', desde) != -1) {
    cambiarActivo(arrPalabra.indexOf('', desde))
  } else {
    columna = 4
    cambiarActivo(columna)
  }
}

// Rellenar campo
const rellenarCampo = (nuevoValor = '', filaNueva = fila, columnaNueva = columna) => {
  words[filaNueva].children[columnaNueva].firstElementChild.textContent = nuevoValor
  words[filaNueva].children[columnaNueva].lastElementChild.textContent = nuevoValor
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

  // Si ganó
  if(arrResult.every(cv => cv.coincidencia === 'perfect')) {
    let estadisticas = localStorage.getItem('estadisticas')
    if(estadisticas) {
      estadisticas = {
        ...JSON.parse(localStorage.getItem('estadisticas')),
        [fila + 1]: +JSON.parse(localStorage.getItem('estadisticas'))[fila + 1] + 1
      }
    } else {
      estadisticas = {1:0,2:0,3:0,4:0,5:0,6:0,x:0, [fila + 1]: 1}
    }

    localStorage.setItem('estadisticas', JSON.stringify(estadisticas))

    const max = Object.values(estadisticas).toSorted((a, b) => b - a)[0]

    for(let i = 0;i <= 6;i++) {
      const valor =  `${(i == 6 ? estadisticas.x : estadisticas[i + 1])/(max == 0 ? 1 : max) * 100}%`
      stats.children[i].children[1].firstElementChild.style.width = valor
      stats.children[i].lastElementChild.textContent = (i == 6 ? estadisticas.x : estadisticas[i + 1])
    }

    const titleModal = modal.firstElementChild.firstElementChild
    const spanResult = modal.firstElementChild.children[1].firstElementChild
    const btnModal = modal.firstElementChild.children[3].firstElementChild
    const imgModal = modal.firstElementChild.children[2].firstElementChild

    titleModal.textContent = 'Ganaste 🎉'
    spanResult.classList.remove('modal__red')
    btnModal.classList.remove('modal__red')
    stats.classList.remove('modal__red')
    imgModal.src = './assets/imgs/meme-muy-bien.jpg'
    spanResult.textContent = wordDay
    modal.classList.remove('modal__hidden')
    endGame = true
  }
  // Si perdió
  if(fila === 5 && !arrResult.every(cv => cv.coincidencia === 'perfect')) {
    let estadisticas = localStorage.getItem('estadisticas')
    if(estadisticas) {
      estadisticas = {
        ...JSON.parse(localStorage.getItem('estadisticas')),
        x: +JSON.parse(localStorage.getItem('estadisticas')).x + 1
      }
    } else {
      estadisticas = {1:0,2:0,3:0,4:0,5:0,6:0,x:1}
    }

    localStorage.setItem('estadisticas', JSON.stringify(estadisticas))

    const max = Object.values(estadisticas).toSorted((a, b) => b - a)[0]

    for(let i = 0;i <= 6;i++) {
      const valor =  `${(i == 6 ? estadisticas.x : estadisticas[i + 1])/(max == 0 ? 1 : max) * 100}%`
      stats.children[i].children[1].firstElementChild.style.width = valor
      stats.children[i].lastElementChild.textContent = (i == 6 ? estadisticas.x : estadisticas[i + 1])
    }

    const titleModal = modal.firstElementChild.firstElementChild
    const spanResult = modal.firstElementChild.children[1].firstElementChild
    const btnModal = modal.firstElementChild.children[3].firstElementChild
    const imgModal = modal.firstElementChild.children[2].firstElementChild

    titleModal.textContent = 'Perdiste ❌'
    spanResult.classList.add('modal__red')
    btnModal.classList.add('modal__red')
    stats.classList.add('modal__red')
    imgModal.src = './assets/imgs/meme-ninio-venas.jpg'
    spanResult.textContent = wordDay
    modal.classList.remove('modal__hidden')
    endGame = true
  }
  return arrResult
}

const callbackEnter = (palabra) => {
  const objetoCoincidencias = comprobarPalabra(palabra, palabraDelDia)
  for(let i = 0; i < objetoCoincidencias.length; i++) {
    words[fila].children[i].lastElementChild.classList.add(objetoCoincidencias[i].coincidencia)
    setTimeout(() => {
      fila = fila == 0 ? 1 : fila
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
    cambiarActivo(0, fila + 1)
  }
}

body.addEventListener('keydown', e => {
  
  let casillaSeleccionada = words[fila].children[columna]

  // Comprueba si es una letra
  if(columna <= 4 && /[a-zA-ZñÑ]/.test(e.key) && e.key.length === 1 && casillaSeleccionada.firstElementChild.textContent === '') {
    rellenarCampo(e.key.toUpperCase())
    let palabra = []
    for(let j = 0; j < 5;j++) {
      palabra.push(words[fila].children[j].lastElementChild.textContent)
    }
    if(columna < 4) {
      BuscarVacios(palabra, columna)
    }
    if(columna == 4 && words[fila].children[4].lastElementChild.textContent != '') {
      BuscarVacios(palabra)
    }
    if(!palabra.includes("")) {
      columna = 3
      cambiarActivo(4)
    }
  }

  // Funcionalidad cuando se apreta la tecla backscace
  if(e.key === 'Backspace' && fila !== 6) {
    if(words[fila].children[columna].firstElementChild.textContent !== '') {
      rellenarCampo()
    } else {
      if(columna > 0) {
        cambiarActivo(columna - 1)
        rellenarCampo()
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
      !endGame && callbackEnter(palabra)
    } else {
      notification.classList.add('show-notificacion')
      setTimeout(() => {
        notification.classList.remove('show-notificacion')
      }, 2500)
    }
  }

  // flechas izquierda y derecha
  if(e.key == "ArrowLeft" && columna > 0) {
    cambiarActivo(columna - 1)
  }
  if(e.key == "ArrowRight" && columna < 4) {
    cambiarActivo(columna + 1)
  }
})

// Uso del teclado visual
teclado.addEventListener('click', (e) => {

  if(/[a-zA-ZñÑ]/.test(e.target.id) && e.target.id.length === 1 && words[fila].children[columna].firstElementChild.textContent === '') {
    rellenarCampo(e.target.id.toUpperCase())
    if(columna < 4) {
      cambiarActivo(columna + 1)
    }
    let palabra = []
    for(let j = 0; j < 5;j++) {
      palabra.push(words[fila].children[j].lastElementChild.textContent)
    }
    if(palabra.includes("") && palabra[4] != "") {
      BuscarVacios(palabra)
    }
    if(!palabra.includes("")) {
      cambiarActivo(4)
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
      notification.classList.add('show-notificacion')
      setTimeout(() => {
        notification.classList.remove('show-notificacion')
      }, 2500)
    }
  }

  if((e.target.id === 'Backspace' || e.target.parentElement.id === 'Backspace') && fila !== 6) {
    if(words[fila].children[columna].firstElementChild.textContent !== '' ) {
      rellenarCampo()
    } else {
      if(columna > 0) {
        cambiarActivo(columna - 1)
        rellenarCampo()
      }
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
  // modal.classList.add('modal__hidden')
  // palabraDelDia = palabrasSelect[Math.floor(Math.random() * palabrasSelect.length)]
  // console.log('Me ejecuté')
  // for(let i = 0;i < 6; i++) {
  //   for(let j = 0;j < 5;j++) {
  //     rellenarCampo('', i, j)
  //     words[i].children[j].lastElementChild.classList.remove('no')
  //     words[i].children[j].lastElementChild.classList.remove('imperfect')
  //     words[i].children[j].lastElementChild.classList.remove('perfect')
  //     words[i].children[j].firstElementChild.classList.add('front')
  //     words[i].children[j].firstElementChild.classList.remove('back')
  //     words[i].children[j].lastElementChild.classList.add('back')
  //     words[i].children[j].lastElementChild.classList.remove('front')
  //   }
  // }
  // words[fila].children[columna].classList.remove('letterActive')
  // fila = 0
  // columna = 0
  // words[fila].children[columna].classList.add('letterActive')
  // for(let i = 0; i < 3 ; i++) {
  //   const limit = teclado.children[i].children.length
  //   for(let j = 0; j < limit; j++) {
  //     teclado.children[i].children[j].classList.remove('no')
  //     teclado.children[i].children[j].classList.remove('imperfect')
  //     teclado.children[i].children[j].classList.remove('perfect')
  //   }
  // }
  endGame = false
  location.reload()
})