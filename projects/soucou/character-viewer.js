const readcharacterlist = (url) => fetch(url)
    .then(response => response.json());

const characterList = await readcharacterlist('../../games/soucou/characterlist.json')
const characterListSpoiler = await readcharacterlist('../../games/soucou/characterlistspoiler.json')

const forward = document.getElementById("forward");
const backward = document.getElementById("backward");
const spoiler = document.getElementById("spoiler");

const centerView = document.querySelector(".center-view");
const character = document.getElementById("character");
const characterSelect = document.querySelector("select");

const title = document.querySelector(".info h3");
const allegiance = document.querySelector(".info :nth-child(2)");
const description = document.querySelector(".bottom p");

let characterIndex = 0;

const characterUpdate = (v, folddown = false) => {
    if(!folddown) {
        characterSelect.value = characterIndex;
    } else {
        characterIndex = characterSelect.value;
    }

    if (v < 0) characterIndex = 0;
    if (v > characterList.length - 1) characterIndex = characterList.length - 1;

    character.src = characterList[characterIndex].image;

    title.textContent = spoiler.checked ? characterListSpoiler[characterIndex].character : characterList[characterIndex].character;
    allegiance.textContent = spoiler.checked ? `Allegiance: ${characterListSpoiler[characterIndex].allegiance}` : `Allegiance: ${characterList[characterIndex].allegiance}`;
    description.textContent = spoiler.checked ? characterListSpoiler[characterIndex].description : characterList[characterIndex].description;
};

characterSelect.onchange = () => characterUpdate(characterSelect.value, true);

forward.addEventListener('click', () => {
    characterIndex++;
    characterUpdate(characterIndex);
});

backward.addEventListener('click', () => {
    characterIndex--;
    characterUpdate(characterIndex);
});