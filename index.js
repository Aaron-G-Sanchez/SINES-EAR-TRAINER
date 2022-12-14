const audioContext = new (window.AudioContext || window.webkitAudioContext)()

// Game variables

let turnCounter = 0

let timerOnStart = 06

let unmuteTimer = 03

let frequencies = [250, 440, 500, 1000, 2000]

let buttons = document.querySelectorAll('button')

const section = document.querySelector('section')

const level = document.querySelector('#level')

const timer = document.querySelector('.timer')

const header = document.querySelector('header')

timer.innerHTML = `Press Start`

level.innerHTML = 'LEVEL 1'

let numGenerator = () => {
  let randomNumber = Math.floor(Math.random() * frequencies.length)
  return randomNumber
}
numGenerator()
let answer = frequencies[numGenerator()]

// Audio mute
const unmute = () => {
  let unmuteInterval = setInterval(() => {
    unmuteTimer--
    if (unmuteTimer === 0) {
      clearInterval(unmuteInterval)
      gain.gain.value = 0.03
    }
  }, 1000)
}

// Oscillator and gain node
let osc = audioContext.createOscillator()
let gain = audioContext.createGain()

osc.connect(gain)
gain.connect(audioContext.destination)
osc.start()
gain.gain.value = 0

// Sets frequency based off a random index from the frequency array
let oscFreq = osc.frequency
oscFreq.setValueAtTime(answer, audioContext.currentTime)

// Play/Pause/Volume buttons
const start = document.querySelector('#start')
const play = document.querySelector('#play')
const mute = document.querySelector('#pause')

start.addEventListener(
  'click',
  () => {
    audioContext.resume()
    let countDownTimer = setInterval(() => {
      timerOnStart--
      timer.innerHTML = `:${timerOnStart}`
      if (timerOnStart === 0) {
        timerOnStart = 0
        timer.innerHTML = ``
        gain.gain.value = 0.03
        clearInterval(countDownTimer)
      }
    }, 1000)
  },
  { once: true }
)

play.addEventListener('click', () => {
  gain.gain.value = 0.03
  audioContext.resume()
})

mute.addEventListener('click', () => {
  gain.gain.value = 0
})

// Game play functions
// Updates the answer as well as the OSC frequncy when answer is correctly guessed
let updateAnswer = () => {
  numGenerator()
  answer = frequencies[numGenerator()]

  oscFreq.setValueAtTime(answer, audioContext.currentTime)

  // After Delay plays audio again
  if (turnCounter < 49) {
    unmuteTimer = 03
    unmute()
  } else {
    gain.gain.value = 0
  }
}

// Levels up game
// creates one div and add one freq to the array
let levelTwo = () => {
  level.innerHTML = 'LEVEL 2'
  frequencies.push(4000)
  const freqPush = document.createElement('button')
  section.appendChild(freqPush)
  buttons = document.querySelectorAll('button')

  buttonClicks()
}

// Creates two divs and adds two freqs to the array
let levelThree = () => {
  level.innerHTML = 'LEVEL 3'
  frequencies.push(6000)
  frequencies.unshift(100)
  const freqPushTwo = document.createElement('button')
  const freqUnshift = document.createElement('button')
  section.appendChild(freqPushTwo)
  section.prepend(freqUnshift)
  buttons = document.querySelectorAll('button')

  buttonClicks()
}

// Creates new div and adds one new freq in the middle of the array
let levelFour = () => {
  level.innerHTML = 'LEVEL 4'
  frequencies.splice(5, 0, 1500)
  const freqSplice = document.createElement('button')
  section.appendChild(freqSplice)
  buttons = document.querySelectorAll('button')

  buttonClicks()
}

// Creates new div and adds one new frq in the middle of the array
let levelFive = () => {
  level.innerHTML = 'LEVEL 5'
  frequencies.splice(7, 0, 3000)
  const freqSpliceTwo = document.createElement('button')
  section.appendChild(freqSpliceTwo)
  buttons = document.querySelectorAll('button')

  buttonClicks()
}

let gameOver = () => {
  // level.innerHTML = 'THANKS FOR PLAYING'
  gain.gain.value = 0
  let overlay = document.createElement('div')
  overlay.setAttribute('class', 'game-over')
  overlay.innerHTML = `<p>THANKS <br/> FOR <br/> PLAYING</p><button id="reset">PLAY AGAIN?</button>`
  header.prepend(overlay)
  let resetGame = document.querySelector('#reset')
  resetGame.addEventListener('click', () => {
    location.reload()
  })
}

// Logic for the button clicks
let buttonClicks = () => {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].innerHTML = `${frequencies[i]}Hz`
  }

  // Loops through the buttons and looks at the innerHTML
  for (let i = 0; i < buttons.length; i++)
    // Displays the frequencys from the array of frequencies on the buttons
    buttons[i].addEventListener('click', () => {
      if (buttons[i].innerHTML == `${answer}Hz`) {
        gain.gain.value = 0
        updateAnswer()
        turnCounter++

        // Changes level
        if (turnCounter === 5) {
          levelTwo()
        } else if (turnCounter === 12) {
          levelThree()
        } else if (turnCounter === 20) {
          levelFour()
        } else if (turnCounter === 35) {
          levelFive()
        } else if (turnCounter === 50) {
          gameOver()
        }
      }
    })
}
let playGame = () => {
  buttonClicks()
}

playGame()
