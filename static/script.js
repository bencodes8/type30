//store API url
const API_URL = 'https://random-word-api.herokuapp.com/word?number=5'

// have html parsed first
document.addEventListener("DOMContentLoaded", function() {
    const wordDisplayElement = document.getElementById('wordBlock')
    let inputField = document.getElementById('wordInput')
    let isTyping = 0
    let lettersCorrect = 0

    inputField.addEventListener('input', () => {
        const arrayLetter = wordDisplayElement.querySelectorAll('span');
        const letterInput = inputField.value.split('')

        isTyping++;
        if (isTyping === 1)
        {
            startTimer()
        }
        arrayLetter.forEach((charSpan, index) => {
            const character = letterInput[index]
            if (character == null) 
            {
                if (lettersCorrect > 0)
                {
                    lettersCorrect--
                }
                charSpan.classList.remove('correct')
                charSpan.classList.remove('incorrect')
            }
            else if (character == charSpan.innerText) 
            {
                if (character == ' ')
                {
                    lettersCorrect--
                }
                charSpan.classList.add('correct')
                charSpan.classList.remove('incorrect')
                lettersCorrect++
                console.log(lettersCorrect)
            }
            else 
            {
                charSpan.classList.add('incorrect')
                charSpan.classList.remove('correct')
            }
        })
    })
    
    let startTime = 60 // seconds

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
        if (timeRemaining === 0)
        {
            inputField.setAttribute('disabled', true)
            return Math.floor(lettersCorrect / 60)
        }
        timeRemaining -= 1
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
        str = text.replaceAll(',', ' ');
        str.split('').forEach(character => {
            const charSpan = document.createElement('span')
            charSpan.innerText = character;
            wordDisplayElement.appendChild(charSpan);
        })
        document.getElementById('loader').style.display = 'none'
    }
    renderWords();
});