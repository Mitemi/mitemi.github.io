// Variables for flesh, tokens, and expedition status
let fleshCount = 0;
let tokenCount = 0;
let expeditionInProgress = false;

// DOM Elements
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

// Load saved counters from localStorage
function loadCounters() {
    const savedFleshCount = localStorage.getItem('fleshCount');
    const savedTokenCount = localStorage.getItem('tokenCount');
    
    if (savedFleshCount !== null) {
        fleshCount = parseInt(savedFleshCount, 10);
    }
    if (savedTokenCount !== null) {
        tokenCount = parseInt(savedTokenCount, 10);
    }
    
    // Update the display
    fleshCounter.textContent = fleshCount;
    tokenCounter.textContent = tokenCount;
}

// Save counters to localStorage
function saveCounters() {
    localStorage.setItem('fleshCount', fleshCount);
    localStorage.setItem('tokenCount', tokenCount);
}

// Update Console
function updateConsole(message) {
    const newMessage = document.createElement('p');
    newMessage.textContent = message;
    consoleOutput.appendChild(newMessage);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

// Handle Flesh input
consoleInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const command = consoleInput.value.trim();
        const multiplierMatch = command.match(/^flesh\*(\d+)$/);
        
        if (command === 'flesh') {
            fleshCount++;
            fleshCounter.textContent = fleshCount;
            updateConsole('Received 1 flesh.');
        } else if (command === 'brick') {
            fleshCount += 1000;
            fleshCounter.textContent = fleshCount;
            updateConsole('Received 10 flesh.');
        } else if (command === 'token') {
            tokenCount += 0;
            tokenCounter.textContent = tokenCount;
            updateConsole('Received 0 token.');
        } else if (command === 'judgement') {
            fleshCount -= 10;
            fleshCounter.textContent = fleshCount;
            updateConsole('Removed 10 flesh.');
        } else if (multiplierMatch) {
            const multiplier = parseInt(multiplierMatch[1], 10);
            if (multiplier >= 1 && multiplier <= 10) {
                const fleshToAdd = multiplier;
                fleshCount += fleshToAdd;
                fleshCounter.textContent = fleshCount;
                updateConsole(`Received ${fleshToAdd} flesh.`);
                
                if (multiplier >= 3) {
                    setTimeout(() => {
                        fleshCount -= fleshToAdd - 1;
                        fleshCounter.textContent = fleshCount;
                        //updateConsole(`Removed ${fleshToAdd - 1} flesh after 15 seconds.`);
                        saveCounters();
                    }, 15000);
                }
            } else {
                updateConsole(`Invalid multiplier in command: ${command}`);
            }
        } else {
            updateConsole(`Unknown command: ${command}`);
        }
        
        consoleInput.value = '';
        saveCounters();
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

startExpedition.addEventListener('click', () => {
    const fleshAmount = parseInt(fleshInvest.value);

    if (fleshAmount > 0 && !expeditionInProgress) {
        expeditionInProgress = true;
        updateConsole(`Started expedition with ${fleshAmount} flesh.`);
        expeditionProgressBar.classList.remove('hidden');
        const progressBarInner = document.getElementById('expeditionProgressBarInner');
        progressBarInner.style.width = '0%';

        let progress = 0;
        const interval = setInterval(() => {
            progress += 1.67;
            progressBarInner.style.width = progress + '%';

            if (progress >= 100) {
                clearInterval(interval);
                expeditionInProgress = false;
                expeditionProgressBar.classList.add('hidden');

                let profitChance = 0;
                let failChance = 0;
                let result = '';
                let fleshEarned = 0;

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
                    if (Math.random() <= 0.05) {
                        tokenCount++;
                        tokenCounter.textContent = tokenCount;
                        fleshEarned = Math.floor(3.00 * fleshAmount);
                        result = `Success! Received 1 token and earned ${fleshEarned} flesh.`;
                    } else {
                        fleshEarned = Math.floor(3.00 * fleshAmount);
                        result = `Success! Earned ${fleshEarned} flesh.`;
                    }
                    fleshCount += fleshEarned;
                    fleshCounter.textContent = fleshCount;
                    saveCounters();
                } else if (fleshAmount >= 92 && fleshAmount <= 110) {
                    profitChance = 2.00;
                    failChance = 0.10;
                } else if (fleshAmount >= 111) {
                    profitChance = 1.30;
                    failChance = 0.25;
                } else {
                    failChance = 0.60;
                }

                if (!result) {
                    if (Math.random() < failChance) {
                        result = 'Expedition failed!';
                        fleshEarned = 0;
                    } else {
                        fleshEarned = Math.floor(profitChance * fleshAmount);
                        result = `Success! Earned ${fleshEarned} flesh.`;
                        fleshCount += fleshEarned;
                        fleshCounter.textContent = fleshCount;
                        saveCounters();
                    }
                }

                const netResult = fleshEarned - fleshAmount;
                if (netResult > 0) {
                    result += ` Net profit of ${netResult} flesh.`;
                } else if (netResult < 0) {
                    result += ` Net loss of ${-netResult} flesh.`;
                } else {
                    result += ` No profit, no loss.`;
                }

                expeditionResult.textContent = result;
                updateConsole(result);
            }
        }, 1000);
    } else {
        updateConsole('Invalid flesh amount or expedition already in progress.');
    }
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

// Confirm selection for 6-sided dice
document.getElementById('confirmSelection6').addEventListener('click', () => {
    const selected = getSelectedNumbers(6);
    document.getElementById('selectedNumbers6').textContent = `Selected: ${selected.join(', ')}`;
    document.getElementById('numberPopup6').classList.add('hidden');
});

// Confirm selection for 20-sided dice
document.getElementById('confirmSelection20').addEventListener('click', () => {
    const selected = getSelectedNumbers(20);
    document.getElementById('selectedNumbers20').textContent = `Selected: ${selected.join(', ')}`;
    document.getElementById('numberPopup20').classList.add('hidden');
});

// Function to get selected checkboxes
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

// Hide popup when confirming
function hidePopup(popupId) {
    document.getElementById(popupId).classList.add('hidden');
}

// 6-sided dice game
document.getElementById('rollDice6').addEventListener('click', () => {
    const betAmount = parseInt(document.getElementById('betAmount6').value);
    const selectedNumbers = getSelectedNumbers(6);

    if (betAmount > 0 && selectedNumbers.length > 0) {
        if (fleshCount >= betAmount) {
            fleshCount -= betAmount;
            fleshCounter.textContent = fleshCount;
            updateConsole('Rolling the dice...');

            setTimeout(() => {
                const diceRoll = Math.floor(Math.random() * 6) + 1;
                const numSelected = selectedNumbers.length;
                let profit = 0;
                let message = '';
                let revenueMultiplier = 1.75 - 0.15 * (numSelected - 1);
                revenueMultiplier = Math.max(revenueMultiplier, 1);

                if (selectedNumbers.includes(diceRoll)) {
                    let revenue = betAmount * revenueMultiplier;
                    profit = Math.floor(revenue - betAmount);
                    fleshCount += profit;
                    message = `You rolled a ${diceRoll}! You win ${profit} flesh.`;
                } else {
                    message = `You rolled a ${diceRoll}. You lose ${betAmount} flesh.`;
                }

                fleshCounter.textContent = fleshCount;
                updateConsole(message);
                saveCounters();
            }, 3000);
        } else {
            updateConsole('Not enough flesh to place this bet.');
        }
    } else {
        updateConsole('Invalid bet amount or no numbers selected.');
    }
});

// 20-sided dice game
document.getElementById('rollDice20').addEventListener('click', () => {
    const betAmount = parseInt(document.getElementById('betAmount20').value);
    const selectedNumbers = getSelectedNumbers(20);

    if (betAmount > 0 && selectedNumbers.length > 0) {
        if (fleshCount >= betAmount) {
            fleshCount -= betAmount;
            fleshCounter.textContent = fleshCount;
            updateConsole('Rolling the dice...');

            setTimeout(() => {
                const diceRoll = Math.floor(Math.random() * 20) + 1;
                const numSelected = selectedNumbers.length;
                let profit = 0;
                let message = '';
                let revenueMultiplier = 3.5 - 0.15 * (numSelected - 1);
                revenueMultiplier = Math.max(revenueMultiplier, 1);

                if (selectedNumbers.includes(diceRoll)) {
                    let revenue = betAmount * revenueMultiplier;
                    profit = Math.floor(revenue - betAmount);
                    fleshCount += profit;

                    if (diceRoll === 20 && Math.random() < 0.05) {
                        tokenCount++;
                        tokenCounter.textContent = tokenCount;
                        message = `You rolled a ${diceRoll} and got a token! You win ${profit} flesh.`;
                    } else {
                        message = `You rolled a ${diceRoll}. You win ${profit} flesh.`;
                    }
                } else {
                    message = `You rolled a ${diceRoll}. You lose ${betAmount} flesh.`;
                }

                fleshCounter.textContent = fleshCount;
                updateConsole(message);
                saveCounters();
            }, 3000);
        } else {
            updateConsole('Not enough flesh to place this bet.');
        }
    } else {
        updateConsole('Invalid bet amount or no numbers selected.');
    }
});

// Slot Machine
document.getElementById('rollSlot').addEventListener('click', () => {
    const betAmount = parseInt(document.getElementById('slotBetAmount').value);

    if (betAmount > 0) {
        if (fleshCount >= betAmount) {
            fleshCount -= betAmount;
            fleshCounter.textContent = fleshCount;
            updateConsole('Spinning the slot machine...');

            setTimeout(() => {
                const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(() => Math.floor(Math.random() * 11));
                const [num1, num2, num3] = numbers;
                let profit = 0;
                let message = `Rolled numbers: ${num1}, ${num2}, ${num3}\n`;

                if (num1 === num2 && num2 === num3) {
                    if ([1, 3, 6, 7, 8].includes(num1)) {
                        tokenCount++;
                        tokenCounter.textContent = tokenCount;
                        message += `You got triple ${num1} and won a token!`;
                    } else {
                        profit = Math.floor(betAmount * 2.5);
                        fleshCount += profit;
                        message += `You got triple ${num1}! You win ${profit} flesh.`;
                    }
                } else if (num1 === num2 || num2 === num3 || num1 === num3) {
                    profit = Math.floor(betAmount * 1.5);
                    fleshCount += profit;
                    message += `You got a pair! You win ${profit} flesh.`;
                } else {
                    message += `No match. You lose ${betAmount} flesh.`;
                }

                fleshCounter.textContent = fleshCount;
                updateConsole(message);
                saveCounters();
            }, 3000);
        } else {
            updateConsole('Not enough flesh to place this bet.');
        }
    } else {
        updateConsole('Invalid bet amount.');
    }
});

// Load counters when page loads
window.addEventListener('load', loadCounters);
