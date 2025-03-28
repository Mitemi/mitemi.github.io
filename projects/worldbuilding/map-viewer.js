const readMaplist = (url) => fetch(url)
    .then(response => response.json());

const mapList = await readMaplist('../../archive/uchronie/maplist.json')

const forward = document.getElementById("forward");
const backward = document.getElementById("backward");
const checkText = document.getElementById("text");
const auto = document.getElementById("auto");

const centerView = document.querySelector(".center-view");
const map = centerView.querySelector('img');
const year = document.querySelector(".infobox p:nth-child(1)");
const info = document.querySelector(".infobox p:nth-child(2)");
const mapSelect = document.querySelector("select");

let mapIndex = 0;

const mapUpdate = v => {
    if (v < 0 || mapSelect.value != "none") mapIndex = 0;
    if (v > mapList.length - 1) mapIndex = mapList.length - 1;

    if (mapSelect.value == "none") {
        map.src = checkText.checked ? mapList[mapIndex].map.replace(".PNG", "-text.PNG") : mapList[mapIndex].map;
    } else {
        map.src = checkText.checked ? mapSelect.value.replace(".PNG", "-text.PNG") : mapSelect.value;
    }

    year.innerText = mapSelect.value != "none" ? "" : mapList[mapIndex].year;
    info.innerText = mapSelect.value != "none" ? "" : mapList[mapIndex].info;
};

mapSelect.onchange = () => mapUpdate(mapIndex);

forward.addEventListener('click', () => {
    mapIndex++;
    mapUpdate(mapIndex);
});

backward.addEventListener('click', () => {
    mapIndex--;
    mapUpdate(mapIndex);
});

auto.addEventListener('click', async () => {
    const startIndex = mapIndex;
    for (let i = 0; i <= mapList.length - startIndex + 1; i++) {
        mapIndex++;
        mapUpdate(mapIndex);
        await new Promise(res => setTimeout(res, 2000));
    };
});