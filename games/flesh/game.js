let fleshCount = 0;
let tokenCount = 0;

let fleshMultiplier = 1;
let multiplierCost = 50;

let expeditionState = false;

const consoleInput = document.querySelector(".console-input");
const consoleOutput = document.querySelector(".console-content");

let melom = 0;

consoleInput.focus();
window.addEventListener('load', loadGame());

const bt = `<br>`

consoleInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const command = this.value.trim().toLowerCase();
        const args = command.split(/\s+/);

        switch (args[0]) {
            case "flesh":
                fleshCount += 1 * fleshMultiplier;
                updateConsole(`Received ${fleshMultiplier} flesh.`);
                break;

            case "brick":
                fleshCount += 1000;
                updateConsole(`Received 1000 flesh.`);
                break;

            case "token":
                tokenCount++;
                updateConsole(`Received 1 token.`);
                break;

            case "help":
                switch (args[1]) {
                    case "me":
                        updateConsole(`no`);
                        break;

                    case "buy":
                        shop();
                        break;

                    case "1":
                        updateConsole(`Available commands (1 of 4): help, flesh, info, reset, judgement.`);
                        break;

                    case "2":
                        updateConsole(`Available commands (2 of 4): buy, help buy`);
                        break;

                    case "3":
                        updateConsole(`Available commands (3 of 4): expedition, dice, slot, help expedition, help dice, help slot`);
                        break;

                    case "4":
                        updateConsole(`Available commands (4 of 4):`);
                        break;

                    default:
                        updateConsole(`Available commands (1 of 4): help, flesh, info, reset, judgement.`);
                        break;
                }
                break;

            case "info":
            case "i":
                updateConsole(`Flesh Multiplier: ${fleshMultiplier}.`);
                break;

            case "reset":
                fleshCount = 0;
                tokenCount = 0;
                melom = 0;
                fleshMultiplier = 1;
                updateConsole(`All game progress has been reset.`);
                location.reload();
                break;

            case "judgement":
                fleshCount -= 10;
                break;

            // Shop
            case "shop":
            case "b":
                shop("list");
                break;

            case "buy":
                switch (args[1]) {
                    case "multiplier":
                    case "mult":
                    case "m":
                        shop("mult");
                        break;

                    default:
                        updateConsole(`Unknown command: ${command}.`);
                        break;
                }
                break;

            // Expedition & Casino
            case "expedition":
                expedition(args[1], args[2], args[3]);
                break;

            // Misc
            case "melom":
                switch (args[1]) {
                    case "time":
                        let date = new Date();
                        let time = `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`

                        updateConsole(`The time is: ${time}.`);
                        break;

                    case "progress":
                        progressBar(`Progress:`, args[2]);
                        break;

                    case "melom":
                        switch (args[2]) {
                            case "melom":
                                melom++
                                break;
                        
                            default:
                                updateConsole(`Unknown command: ${command}.`);
                                break;
                        }
                        break;

                    default:
                        updateConsole(`Unknown command: ${command}.`);
                        break;
                }
                break;

            default:
                updateConsole(`Unknown command: ${command}.`);
                break;
        };

        saveGame();
        melomCamo();
        this.value = '';
    }
});

function updateCounter() {
    document.querySelector(".flesh-count").textContent = fleshCount;
    document.querySelector(".token-count").textContent = tokenCount;
}

function saveGame() {
    localStorage.setItem('fleshCount', fleshCount);
    localStorage.setItem('tokenCount', tokenCount);
    localStorage.setItem('melom', melom);
    localStorage.setItem('fleshMultiplier', fleshMultiplier);
    localStorage.setItem('multiplierCost', multiplierCost);
    updateCounter()
}

function loadGame() {
    fleshCount = parseInt(localStorage.getItem('fleshCount') ?? 0);
    tokenCount = parseInt(localStorage.getItem('tokenCount') ?? 0);
    melom = parseInt(localStorage.getItem('melom') ?? 0);
    fleshMultiplier = parseInt(localStorage.getItem('fleshMultiplier') ?? 1);
    multiplierCost = parseInt(localStorage.getItem('multiplierCost') ?? 50);
    updateCounter();
    melomCamo();
}

function updateConsole(log) {
    consoleOutput.innerHTML += `<div>${log}</div>`;
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function shop(opt) {
    switch (opt) {
        case "list":
            updateConsole(`Shop:${bt}Flesh Multiplier - ${multiplierCost} flesh.`);
            break;

        case "mult":
            if (fleshCount >= multiplierCost) {
                fleshCount -= multiplierCost;
                fleshMultiplier++;
                multiplierCost = (multiplierCost + 50) * 2
                updateConsole(`Bought ${fleshMultiplier}x flesh multiplier.`);
            } else {
                updateConsole(`Not enough flesh.`);
            };
            break;

        default:
            updateConsole(`Available commands: buy multiplier.`);
            break;
    }
}

function expedition(investment, length, route) {
    if (!investment || !length) {
        updateConsole(`Enter a number of flesh as investment and an expedition length.`);
    } else if (investment < 1 || length < 1) {
        updateConsole(`Invalid expedition investment.`);
    } else {
        expeditionState = true;
        let reward = 0;
        progressBar(`Expedition in progress.`, length * 100);
    };
}

function progressBar(text, timer = 150) {
    if (expeditionState != true) {
        let progress = Array(10).fill('▒');
        let progressElement = document.querySelector(".progress-bar");
        progressElement.textContent = `${text} ${progress.join('')}`;

        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                progress[i] = '█';
                progressElement.textContent = `${text} ${progress.join('')}`;
            }, i * timer);
        }

        setTimeout(() => progressElement.classList.add("yellow"), 10 * timer);

        setTimeout(() => {
            progressElement.textContent = '';
            progressElement.classList.remove("yellow");
        }, 10 * timer + 1000);
    }
}

function melomCamo () {
    if (melom != 0) document.querySelector(".metrics").innerHTML += `<div><img src="./img/melom.svg">Melom: <span class="melom-count"> 0</span></div>`
    

    if (melom) document.querySelector(".melom-count").textContent = melom;
}