//store API url
const API_URL = 'https://random-word-api.herokuapp.com/word?number=40'

// have html parsed first
document.addEventListener("DOMContentLoaded", function(){
    const wordDisplayElement = document.getElementById('wordBlock')
    const wordInputElement = document.getElementById('wordInput')

    wordInputElement.addEventListener('input', () => {
        const arrayLetter = wordDisplayElement.querySelectorAll('span');
        const arrayValue = wordInputElement.value.split('')
        
        
        arrayLetter.forEach((characterSpan, index) => {
            const character = arrayValue[index]
            if (character == null) 
            {
                characterSpan.classList.remove('correct')
                characterSpan.classList.remove('incorrect')
            }
            else if (character == characterSpan.innerText) {
                characterSpan.classList.add('correct')
                characterSpan.classList.remove('incorrect')
            }
            else 
            {
                characterSpan.classList.add('incorrect')
                characterSpan.classList.remove('correct')
            }

        })
    })

    // fetch api
    function getWords() {
        return fetch(API_URL)
            .then(res => res.json())
    }

    // render words
    async function renderWords() {
        const words = [];
        words.push(await getWords());
        text = "";
        for (let i = 0; i < words.length; i++)
        {
            text += words[i];
        }
        str = text.replaceAll(',', ' ');
        str.split('').forEach(character => {
            const charSpan = document.createElement('span');
            charSpan.innerText = character;
            wordDisplayElement.appendChild(charSpan);
        })
    }
    renderWords();
    document.getElementById("reset").addEventListener("click", renderWords, true);
});




