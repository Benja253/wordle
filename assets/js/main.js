window.onload = function() {
  let inputPivot = document.getElementById('inputHidden');
  inputPivot.focus();

  inputPivot.addEventListener('blur', function() {
      setTimeout(function() {
        inputPivot.focus();
      }, 0);
  });
}
let palabraDelDia = todasLasPalabras[Math.floor(Math.random() * todasLasPalabras.length)]

const body = document.getElementById('body')
const words = document.querySelectorAll('.word')

let fila = 0
let columna = 0

words[fila].children[columna].classList.add('letterActive')

const palabraExiste = (palabra, arrPalabras) => arrPalabras.includes(palabra.toLowerCase())

const comprobarPalabra = (palabra, wordDay) => {
  let arrResult = []
  for(let i = 0; i < wordDay.length; i++) {
    if(palabra.toUpperCase()[i] === wordDay.toUpperCase()[i]) {
      arrResult.push({
        value: palabra.toUpperCase()[i],
        coincidencia: 'perfect',
      })
    } else {
      if(wordDay.toUpperCase().includes(palabra.toUpperCase()[i])) {
        arrResult.push({
          value: palabra.toUpperCase()[i],
          coincidencia: 'imperfect',
        })
      } else {
        arrResult.push({
          value: palabra.toUpperCase()[i],
          coincidencia: 'no',
        })
      }
    }
  }
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
      if(fila < 5) {
        casillaSeleccionada.classList.remove('letterActive')
        columna = 0
        casillaSeleccionada = words[fila + 1].children[columna]
        casillaSeleccionada.classList.add('letterActive')
        fila++
      }
    } else {
      alert('La palabra no existe')
    }
  }
})