// Such heresy

const tabNav = document.getElementById("tab-nav");
const tabButton1 = tabNav.getElementsByTagName('button')[0];
const tabButton2 = tabNav.getElementsByTagName('button')[1];
const tabButton3 = tabNav.getElementsByTagName('button')[2];
const tabButton4 = tabNav.getElementsByTagName('button')[3];
const tabButton5 = tabNav.getElementsByTagName('button')[4];
const tabButton6 = tabNav.getElementsByTagName('button')[5];

const tabContent = document.getElementById("tab-content");
const tabSection1 = tabContent.getElementsByTagName('section')[0];
const tabSection2 = tabContent.getElementsByTagName('section')[1];
const tabSection3 = tabContent.getElementsByTagName('section')[2];
const tabSection4 = tabContent.getElementsByTagName('section')[3];
const tabSection5 = tabContent.getElementsByTagName('section')[4];
const tabSection6 = tabContent.getElementsByTagName('section')[5];
const tabSection7 = tabContent.getElementsByTagName('section')[6];

tabButton1.addEventListener('click', () => {
    tabSection1.style.display = "none"
    tabSection2.style.display = "flex"
    tabSection3.style.display = "none"
    tabSection4.style.display = "none"
    tabSection5.style.display = "none"
    tabSection6.style.display = "none"
    tabSection7.style.display = "none"
});

tabButton2.addEventListener('click', () => {
    tabSection1.style.display = "none"
    tabSection2.style.display = "none"
    tabSection3.style.display = "flex"
    tabSection4.style.display = "none"
    tabSection5.style.display = "none"
    tabSection6.style.display = "none"
    tabSection7.style.display = "none"
});

tabButton3.addEventListener('click', () => {
    tabSection1.style.display = "none"
    tabSection2.style.display = "none"
    tabSection3.style.display = "none"
    tabSection4.style.display = "flex"
    tabSection5.style.display = "none"
    tabSection6.style.display = "none"
    tabSection7.style.display = "none"
});

tabButton4.addEventListener('click', () => {
    tabSection1.style.display = "none"
    tabSection2.style.display = "none"
    tabSection3.style.display = "none"
    tabSection4.style.display = "none"
    tabSection5.style.display = "flex"
    tabSection6.style.display = "none"
    tabSection7.style.display = "none"
});

tabButton5.addEventListener('click', () => {
    tabSection1.style.display = "none"
    tabSection2.style.display = "none"
    tabSection3.style.display = "none"
    tabSection4.style.display = "none"
    tabSection5.style.display = "none"
    tabSection6.style.display = "flex"
    tabSection7.style.display = "none"
});

tabButton6.addEventListener('click', () => {
    tabSection1.style.display = "none"
    tabSection2.style.display = "none"
    tabSection3.style.display = "none"
    tabSection4.style.display = "none"
    tabSection5.style.display = "none"
    tabSection6.style.display = "none"
    tabSection7.style.display = "flex"
});