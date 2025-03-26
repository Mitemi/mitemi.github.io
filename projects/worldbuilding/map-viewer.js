const readMaplist = (url) => fetch(url)
    .then(response => response.json());

const mapList = await readMaplist('../../archive/uchronie/maplist.json')

const forward = document.getElementById("forward");
const backward = document.getElementById("backward");
const checkText = document.getElementById("text");
const auto = document.getElementById("auto");

const centerView = document.querySelector(".center-view");
const map = centerView.querySelector('img');

let mapIndex = 0;

const mapUpdate = v => {
    if (v < 0) mapIndex = 0;
    if (v > mapList.length - 1) mapIndex = mapList.length - 1;

    map.src = checkText.checked ? mapList[mapIndex].map.replace(".PNG", "-text.PNG") : mapList[mapIndex].map;
};

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