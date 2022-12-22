//store API url
const API_URL = 'https://random-word-api.herokuapp.com/word?number=5'

// have html parsed first
document.addEventListener("DOMContentLoaded", function() {

    renderWords()

    let wordDisplayElement = document.getElementById('wordBlock')
    let inputField = document.getElementById('wordInput')
    let lettersTyped = 0
    let startTime = 0 // seconds

    inputField.addEventListener('input', () => {
        startTimer()
    }, {once: true})

    inputField.addEventListener('input', () => {
        const letterArray = wordDisplayElement.querySelectorAll('span')
        const amtLetters = inputField.value
        const letterInput = inputField.value.split('')

        letterArray.forEach((charSpan, index) => {
            const character = letterInput[index]
            if (character == null) 
            {
                charSpan.classList.remove('correct')
                charSpan.classList.remove('incorrect')
            }
            else if (character == charSpan.innerText) 
            {
                if (character == ' ' || amtLetters.length == letterArray.length) 
                {
                    for (let i = 0; i < amtLetters.length; i++)
                    {
                        letterArray[i].remove()
                    }
                    inputField.value = ''
                }
                charSpan.classList.add('correct')
                charSpan.classList.remove('incorrect')
            }
            else 
            {
                charSpan.classList.add('incorrect')
                charSpan.classList.remove('correct')
            }

        })
    })

    // fetch api
    function getWords() 
    {
        return fetch(API_URL)
            .then(res => res.json())
    }

    // timer
    function startTimer() {
        var timeRemaining = startTime
      setInterval(() => {
        if (wordDisplayElement.querySelector('span') == null)
        {
            return 
        }
        timeRemaining++
        timer.innerText = timeRemaining
      }, 1000)
      
    }

    // render words
    async function renderWords() 
    {
        const words = [];
        words.push(await getWords());
        text = "";
        for (let i = 0; i < words.length; i++)
        {
            text += words[i];
        }
        text += ' '
        str = text.replaceAll(',', ' ')
        str.split('').forEach(character => {
            const charSpan = document.createElement('span')
            charSpan.innerText = character;
            wordDisplayElement.appendChild(charSpan);
        })
        document.getElementById('loader').style.display = 'none'
    }
});