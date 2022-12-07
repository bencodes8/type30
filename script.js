// store API url
const API_URL = "http://api.quotable.io/random"

// allow all of the HTML to be parsed first
document.addEventListener("DOMContentLoaded", function(){
    // get element by id
const quoteDisplayElement = document.getElementById('quoteDisplay')
const quoteInputElement = document.getElementById('input')

quoteInputElement.addEventListener("input", function(){
    const arrayQuote = quoteDisplayElement.querySelectorAll('span')
    const arrayValue = quoteInputElement.value.split('')
    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index]
        if (character == null) {
            characterSpan.classList.remove('correct')
            characterSpan.classList.remove('incorrect')
        }
        else if (character == characterSpan.innerText) {
            characterSpan.classList.add('correct')
            characterSpan.classList.remove('incorrect')
        } else {
            characterSpan.classList.remove('correct')
            characterSpan.classList.add('incorrect')
        }
    })
})

    // function for getting random quote
function getRandomQuote() {
    // fetch from api
    return fetch(API_URL)
    // promises
    .then(response => response.json())
    // content would be the key for the content we want
    .then(data => data.content)
}

// async function to render new quote
async function renderNewQuote() {
    const quote = await getRandomQuote()

    quoteDisplayElement.innerHTML = ''
    // loop through each individual character and create their own span element
    quote.split('').forEach(character => {
        const characterSpan = document.createElement('span')
        characterSpan.innerText = character
        quoteDisplayElement.appendChild(characterSpan)
    })
}

renderNewQuote()

});

// refresh page
function refreshPage(){
    window.location.reload();
}