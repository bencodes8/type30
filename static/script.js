//store API url
const API_URL = 'https://random-word-api.herokuapp.com/word?number=15'
const wordDisplayElement = document.getElementById('quoteDisplay')

function getWords() {
    return fetch(API_URL)
        .then(res => res.json())
}

async function renderWords() {
    const words = [];
    words.push(await getWords());
    text = "";
    for (let i = 0; i < words.length; i++)
    {
        text += words[i];
        text += " ";
    }
    console.log(text);
}

renderWords()