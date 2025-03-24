const forward = document.getElementById("forward");
const backward = document.getElementById("backward");
const checkText = document.getElementById("text");
const auto = document.getElementById("auto");

const centerView = document.querySelector(".center-view");
const map = centerView.querySelector('img');

let mapList = [
    "../../archive/uchronie/maps/70_shardedv4-relief.PNG",
    "../../archive/uchronie/maps/74_shardedv4-113.PNG",
    "../../archive/uchronie/maps/75_shardedv4-190.PNG",
    "../../archive/uchronie/maps/76_shardedv4-270.PNG",
    "../../archive/uchronie/maps/77_shardedv4-291.PNG"
];

let mapIndex = 0;

const mapUpdate = v => {
    if (v < 0) mapIndex = 0;
    if (v > mapList.length - 1) mapIndex = mapList.length - 1;

    map.src = checkText.checked ? mapList[mapIndex].replace(".PNG", "-text.PNG") : mapList[mapIndex];
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
    for (let i = 0; i <= mapList.length - mapIndex + 1; i++) {
        mapIndex++;
        mapUpdate(mapIndex);
        await new Promise(res => setTimeout(res, 2000));
    };
});