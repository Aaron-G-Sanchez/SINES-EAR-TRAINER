const audioContext = new (window.AudioContext || window.webkitAudioContext)()

// Game variables

let score = 0
let turnCounter = 0

let potentialScore = 100

let frequencies = [250, 440, 500, 1000, 2000]

let numGenerator = () => {
  let randomNumber = Math.floor(Math.random() * frequencies.length)
  return randomNumber
}
numGenerator()

let answer = frequencies[numGenerator()]
console.log(answer)

const button = document.querySelectorAll('button')

const scoreBoard = document.querySelector('h1')

const section = document.querySelector('section')

const level = document.querySelector('h2')

level.innerHTML = 'LEVEL 1'

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

// Play/Pause/Volume buttons -- Currently WORKS but only lets you start and stop ONCE
// Sets OSC to start and stop after duration
// osc.start()

// setTimeout(() => {
//   osc.stop()
// }, 2000)

const play = document.querySelector('#play')
const mute = document.querySelector('#pause')

play.addEventListener('click', () => {
  gain.gain.value = 0.03
})

mute.addEventListener('click', () => {
  gain.gain.value = 0
})

// Game play functions
// Updates the answer as well as the OSC frequncy when answer is correctly guessed
let updateAnswer = () => {
  numGenerator()
  answer = frequencies[numGenerator()]
  console.log(answer) //logs new answer

  oscFreq.setValueAtTime(answer, audioContext.currentTime)
}

// Levels up game
let levelUp = () => {
  if (turnCounter === 5) {
    level.innerHTML = 'LEVEL 2'
    frequencies.push(4000)
    const freqPush = document.createElement('button')
    section.appendChild(freqPush)
    let levelTwo = document.querySelectorAll('button')[5]
    levelTwo.innerHTML = `${frequencies[5]}Hz`
    levelTwo.addEventListener('click', () => {
      if (levelTwo.innerHTML == `${answer}Hz`) {
        console.log('YOU ARE CORRECT')
        updateAnswer()

        // Changes score and mutes the OSC
        score += potentialScore
        turnCounter++
        // gain.gain.value = 0
        scoreBoard.innerHTML = score
        // if (turnCounter === 5) {
        //   levelUp()
        //   console.log(frequencies)
        // }
      }
    })
  }
}

let buttonClicks = () => {
  for (let i = 0; i < button.length; i++) {
    button[i].innerHTML = `${frequencies[i]}Hz`
  }

  // Loops through the buttons and looks at the innerHTML
  for (let i = 0; i < button.length; i++)
    button[i].addEventListener('click', () => {
      if (button[i].innerHTML == `${answer}Hz`) {
        console.log('YOU ARE CORRECT')
        updateAnswer()

        // Changes score and mutes the OSC
        score += potentialScore
        turnCounter++
        // gain.gain.value = 0
        scoreBoard.innerHTML = score
        if (turnCounter === 5) {
          levelUp()
          console.log(frequencies)
        }
      } else {
        console.log(button[i].innerHTML)

        // Decrements potential score every guess
        potentialScore -= 10
        scoreBoard.innerHTML = score
        if (potentialScore <= 50) {
          updateAnswer()
          console.log(frequencies)
        }
      }
    })
}
let playGame = () => {
  // Displays the frequencys from the array of frequencies on the buttons
  // for (let i = 0; i < button.length; i++) {
  //   button[i].innerHTML = `${frequencies[i]}Hz`
  // }

  // // Loops through the buttons and looks at the innerHTML
  // for (let i = 0; i < button.length; i++)
  //   button[i].addEventListener('click', () => {
  //     if (button[i].innerHTML == `${answer}Hz`) {
  //       console.log('YOU ARE CORRECT')
  //       updateAnswer()

  //       // Changes score and mutes the OSC
  //       score += potentialScore
  //       turnCounter++
  //       // gain.gain.value = 0
  //       question.innerHTML = score
  //       if (turnCounter === 5) {
  //         levelUp()
  //         console.log(frequencies)
  //       }
  //     } else {
  //       console.log(button[i].innerHTML)

  //       // Decrements potential score every guess
  //       potentialScore -= 10
  //       turnCounter++
  //       question.innerHTML = score
  //       if (turnCounter === 5) {
  //         levelUp()
  //         console.log(frequencies)
  //       }
  //     }
  //   })
  buttonClicks()
}

playGame()
