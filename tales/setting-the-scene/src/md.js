import { marked } from "./marked.min.js";

const content = document.getElementById("content");
const histSelect = document.querySelector(".row-container button:first-of-type");
const plotSelect = document.querySelector(".row-container button:last-of-type");

const readMD = (url) => fetch(url)
    .then(async (md) => content.innerHTML = marked.parse(await md.text()));

readMD('./md/sharded-history.md');

histSelect.addEventListener('click', () => {
    readMD('./md/sharded-history.md');
});

plotSelect.addEventListener('click', () => {
    readMD('./md/sharded-plot.md');
});