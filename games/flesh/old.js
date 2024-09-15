let fleshCount = 0;
let tokenCount = 0;
let expeditionInProgress = false;

const fleshCounter = document.getElementById('fleshCount');
const tokenCounter = document.getElementById('tokenCount');
const consoleOutput = document.getElementById('consoleOutput');
const consoleInput = document.getElementById('consoleInput');
const casinoTab = document.getElementById('casinoTab');
const expeditionTab = document.getElementById('expeditionTab');
const casinoContent = document.getElementById('casinoContent');
const expeditionContent = document.getElementById('expeditionContent');
const expeditionResult = document.getElementById('expeditionResult');
const expeditionProgressBar = document.getElementById('expeditionProgressBar');
const fleshInvest = document.getElementById('fleshInvest');
const startExpedition = document.getElementById('startExpedition');

function updateConsole(message) {
    const newMessage = document.createElement('p');
    newMessage.textContent = message;
    consoleOutput.appendChild(newMessage);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

// Console Commands
consoleInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        // Flesh Command
        if (consoleInput.value === 'flesh') {
            fleshCount++;
            fleshCounter.textContent = fleshCount;
            updateConsole('Received 1 flesh.');
        }

        // Hack in 1k flesh
        if (consoleInput.value === 'brick') {
            fleshCount += 1000;
            fleshCounter.textContent = fleshCount;
            updateConsole('Emi, here I am!');
        }

        // Clear the input field after processing the command
        consoleInput.value = '';
    }
});


consoleInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && consoleInput.value === 'brick') {
        fleshCount++;
        fleshCounter.textContent = fleshCount;
        updateConsole('Emi, here I am!');
        consoleInput.value = '';
    }
});

// Tab switching
casinoTab.addEventListener('click', () => {
    casinoContent.classList.remove('hidden');
    expeditionContent.classList.add('hidden');
    casinoTab.classList.add('active');
    expeditionTab.classList.remove('active');
});

expeditionTab.addEventListener('click', () => {
    casinoContent.classList.add('hidden');
    expeditionContent.classList.remove('hidden');
    expeditionTab.classList.add('active');
    casinoTab.classList.remove('active');
});

// Toggling between game views
document.getElementById('showDice6Game').addEventListener('click', () => {
    toggleGameView('dice6Game');
});
document.getElementById('showDice20Game').addEventListener('click', () => {
    toggleGameView('dice20Game');
});
document.getElementById('showSlotMachine').addEventListener('click', () => {
    toggleGameView('slotMachine');
});

function toggleGameView(gameId) {
    document.getElementById('dice6Game').classList.add('hidden');
    document.getElementById('dice20Game').classList.add('hidden');
    document.getElementById('slotMachine').classList.add('hidden');
    document.getElementById(gameId).classList.remove('hidden');
}

// Popups for selecting numbers
document.getElementById('selectNumbers6').addEventListener('click', () => {
    document.getElementById('numberPopup6').classList.remove('hidden');
});
document.getElementById('selectNumbers20').addEventListener('click', () => {
    document.getElementById('numberPopup20').classList.remove('hidden');
});

// Confirm selection for dice
document.getElementById('confirmSelection6').addEventListener('click', () => {
    const selected = getSelectedNumbers(6);
    document.getElementById('selectedNumbers6').textContent = `Selected: ${selected.join(', ')}`;
    document.getElementById('numberPopup6').classList.add('hidden');
});

// Confirm selection for d20
document.getElementById('confirmSelection20').addEventListener('click', () => {
    const selected = getSelectedNumbers(20);
    document.getElementById('selectedNumbers20').textContent = `Selected: ${selected.join(', ')}`;
    document.getElementById('numberPopup20').classList.add('hidden');
});

// Function to get checkboxes
function getSelectedNumbers(diceType) {
    const selected = [];
    if (diceType === 6) {
        for (let i = 1; i <= 6; i++) {
            if (document.getElementById(`dice6Num${i}`).checked) {
                selected.push(i);
            }
        }
    } else if (diceType === 20) {
        for (let i = 1; i <= 20; i++) {
            const checkbox = document.getElementById(`dice20Num${i}`);
            if (checkbox && checkbox.checked) {
                selected.push(i);
            }
        }
    }
    return selected;
}

// Expedition
startExpedition.addEventListener('click', () => {
    const fleshAmount = parseInt(fleshInvest.value);

    if (fleshAmount > 0 && !expeditionInProgress) {
        expeditionInProgress = true;
        updateConsole(`Started expedition with ${fleshAmount} flesh.`);
        expeditionProgressBar.classList.remove('hidden');
        expeditionProgressBar.style.width = '100%';

        let progress = 100;
        const interval = setInterval(() => {
            progress -= 1.67; // Decrease progress
            expeditionProgressBar.style.width = progress + '%';

            if (progress <= 0) {
                clearInterval(interval);
                expeditionInProgress = false;
                expeditionProgressBar.classList.add('hidden');

                // Calculate result
                let profitChance = 0;
                let failChance = 0;
                let result = '';

                if (fleshAmount >= 1 && fleshAmount <= 11) {
                    profitChance = 0.50;
                    failChance = 0.50;
                } else if (fleshAmount >= 12 && fleshAmount <= 22) {
                    profitChance = 0.88;
                    failChance = 0.40;
                } else if (fleshAmount >= 23 && fleshAmount <= 44) {
                    profitChance = 0.50;
                    failChance = 0.30;
                } else if (fleshAmount >= 45 && fleshAmount <= 60) {
                    profitChance = 1.20;
                    failChance = 0.40;
                } else if (fleshAmount >= 61 && fleshAmount <= 78) {
                    profitChance = 1.80;
                    failChance = 0.35;
                } else if (fleshAmount >= 79 && fleshAmount <= 87) {
                    profitChance = 1.70;
                    failChance = 0.10;
                } else if (fleshAmount >= 88 && fleshAmount <= 91) {
                    if (Math.random() <= 0.25) {
                        tokenCount++;
                        tokenCounter.textContent = tokenCount;
                        result = 'Success! Received 1 token!';
                    } else {
                        result = 'Expedition complete with no reward.';
                    }
                } else {
                    failChance = 0.60;
                }

                if (!result) {
                    result = Math.random() < failChance ? 'Expedition failed!' : `Success! Earned ${Math.floor(profitChance * fleshAmount)} flesh.`;
                    if (result.includes('Success')) {
                        fleshCount += Math.floor(profitChance * fleshAmount);
                        fleshCounter.textContent = fleshCount;
                    }
                }

                expeditionResult.textContent = result;
                updateConsole(result);
            }
        }, 1000);
    } else {
        updateConsole('Invalid flesh amount or expedition already in progress.');
    }
});
