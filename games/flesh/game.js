// Variables for flesh, tokens, and expedition status
let fleshCount = 0;
let tokenCount = 0;
let expeditionInProgress = false;

let fleshTyperMultiplier = 1;
let MultiplierBacklog = 1;
let MultiplierEnabled = true
let passiveFleshGeneratorActive = false;
let insuranceReduction = 0;
let insuranceFailureRate = 0.35;
let passiveGeneratorInterval;
let passiveGeneratorNeedsRestart = false;
let currentInsuranceLevel = 0;
let betterInsuranceActive = false;

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

// Save game state to localStorage
function saveGame() {
    document.getElementById('fleshCount').textContent = fleshCount;
    document.getElementById('tokenCount').textContent = tokenCount;
    localStorage.setItem('fleshCount', JSON.stringify(fleshCount));
    localStorage.setItem('tokenCount', JSON.stringify(tokenCount));
    localStorage.setItem('fleshTyperMultiplier', JSON.stringify(fleshTyperMultiplier));
    localStorage.setItem('passiveFleshGeneratorActive', JSON.stringify(passiveFleshGeneratorActive));
    localStorage.setItem('insuranceReduction', JSON.stringify(insuranceReduction));
    localStorage.setItem('currentInsuranceLevel', JSON.stringify(currentInsuranceLevel));
    localStorage.setItem('betterInsuranceActive', JSON.stringify(betterInsuranceActive));
    console.log('Game saved!');
}

// Load game state from localStorage
function loadGame() {
    fleshCount = JSON.parse(localStorage.getItem('fleshCount')) || 0;
    tokenCount = JSON.parse(localStorage.getItem('tokenCount')) || 0;
    fleshTyperMultiplier = JSON.parse(localStorage.getItem('fleshTyperMultiplier')) || 1;
    passiveFleshGeneratorActive = JSON.parse(localStorage.getItem('passiveFleshGeneratorActive')) || false;
    insuranceReduction = JSON.parse(localStorage.getItem('insuranceReduction')) || 0;
    currentInsuranceLevel = JSON.parse(localStorage.getItem('currentInsuranceLevel')) || 0;
    betterInsuranceActive = JSON.parse(localStorage.getItem('betterInsuranceActive')) || false;

    updateCounter();
    tokenCounter.textContent = tokenCount;
    console.log('Game loaded!');
}

window.addEventListener('load', loadGame);

// Update Counters
function updateCounter() {
    document.getElementById('fleshCount').textContent = fleshCount;
    document.getElementById('tokenCount').textContent = tokenCount;
}

// Update Console
// function updateConsole(message) {
//     const newMessage = document.createElement('p');
//     newMessage.textContent = message;
//     consoleOutput.appendChild(newMessage);
//     consoleOutput.scrollTop = consoleOutput.scrollHeight;
// }

// Function to update the console display
function updateConsole(message) {
    const consoleOutput = document.getElementById('consoleOutput');
    consoleOutput.innerHTML += `<div>${message}</div>`;
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

// Console
document.getElementById('consoleInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const command = this.value.trim().toLowerCase();
        const multiplierMatch = command.match(/^flesh\*(\d+)$/);
        
        if (command === 'flesh') {
            if (fleshTyperMultiplier == 1) {
              fleshCount++;
            } else if (fleshTyperMultiplier != 1) {
              fleshCount += fleshTyperMultiplier;
            }
            updateCounter();
            updateConsole(`Received ${fleshTyperMultiplier} flesh.`);
        } else if (command === 'brick') {
            fleshCount += 100000;
            updateCounter();
            updateConsole('Received 100k flesh.');
        } else if (command === 'token') {
            tokenCount += 0;
            updateCounter()
            updateConsole('Received 0 token.');
        } else if (command === 'help') {
            updateConsole('Commands: help, flesh, upgrades, contracts, toggleMultiplier, generator, restart, reset.');
        } else if (command === 'reset') {
            fleshCount = 0;
            tokenCount = 0;
            fleshTyperMultiplier = 1;
            passiveFleshGeneratorActive = false;
            MultiplierEnabled = true;
            MultiplierBacklog = 1;
            insuranceReduction = 0;
            currentInsuranceLevel = 0;
            betterInsuranceActive = false;
            updateCounter();
            updateConsole('All game progress has been reset.');
        } else if (command === 'judgement') {
            fleshCount -= 10;
            updateCounter();
            updateConsole('Removed 10 flesh.');
        } else if (multiplierMatch) {
            const multiplier = parseInt(multiplierMatch[1], 10);
            if (multiplier >= 1 && multiplier <= 10) {
                const fleshToAdd = multiplier;
                fleshCount += fleshToAdd;
                updateCounter();
                updateConsole(`Received ${fleshToAdd} flesh.`);
                
                if (multiplier >= 3) {
                    setTimeout(() => {
                        fleshCount -= fleshToAdd - 1;
                        updateCounter();
                        //updateConsole(`Removed ${fleshToAdd - 1} flesh after 15 seconds.`);
                    }, 15000);
                }
            } else {
                updateConsole(`Invalid multiplier in command: ${command}`);
            }
        } else if (command === 'restart') {
            if (passiveGeneratorNeedsRestart) {
                passiveGeneratorNeedsRestart = false;
                updateConsole('Passive flesh generator restarted.');
            } else {
                updateConsole('The passive generator does not need restarting.');
            }
        } else if (command === 'contracts') {
            let level = currentInsuranceLevel;
            let reduction = [0.10, 0.15, 0.25, 0.40, 0.50, 0.65][level];
            updateConsole(`Current Insurance Level: ${level}, Loss Reduction: ${reduction * 100}%.`);
        } else if (command === 'upgrades') {
            let upgrades = [];
            if (fleshTyperMultiplier > 1) upgrades.push(`Flesh Typer Multiplier: ${fleshTyperMultiplier}`);
            if (passiveFleshGeneratorActive) upgrades.push('Passive Flesh Generator: Active');
            if (currentInsuranceLevel > 0) upgrades.push(`Insurance Level: ${currentInsuranceLevel}`);
            if (betterInsuranceActive) upgrades.push('Better Insurance: Active');
            
            if (upgrades.length === 0) {
                updateConsole('No upgrades purchased yet.');
            } else {
                updateConsole(`Purchased Upgrades: ${upgrades.join(', ')}`);
            }
        } else if (command === 'generator') {
            if (passiveGeneratorNeedsRestart != true) {
              updateConsole(`The passive flesh generator is currently active.`);
            } else {
              updateConsole(
                `The passive flesh generator needs to be restarted.`
              );
            }
        } else if (command === 'togglemultiplier') {
            if (fleshTyperMultiplier == 1 && MultiplierBacklog !== 1) {
              updateConsole(`You do not own any Flesh Typer Multiplier.`);
            } else if (MultiplierEnabled == true) {
              MultiplierEnabled = false
              MultiplierBacklog = fleshTyperMultiplier
              fleshTyperMultiplier = 1
              updateConsole(
                `Flesh Typer Multiplier disabled.`
              );
            } else if (MultiplierEnabled == false) {
                MultiplierEnabled = true
                fleshTyperMultiplier = MultiplierBacklog
                updateConsole(
                    `Flesh Typer Multiplier enabled.`
                  );
            }
        } else {
            updateConsole(`Unknown command: ${command}`);
        }
        saveGame();
        
        this.value = '';
    }
});

// Apply insurance in expeditions
function applyInsurance(netLoss) {
    let willPay = Math.random() >= insuranceFailureRate;
    let insuranceReductionValue = Math.floor(netLoss * insuranceReduction);
    if (willPay) {
        netLoss -= insuranceReductionValue;
        updateConsole(`Insurance reduced your loss by ${insuranceReductionValue} flesh.`);
        if (betterInsuranceActive) {
            betterInsuranceActive = false;
            insuranceFailureRate = 0.35;
            updateConsole('Better Insurance has expired and must be re-bought.');
        }
    } else {
        updateConsole('The insurance company refused to pay out.');
    }
    return netLoss;
    saveGame()
}

// Tab switching
casinoTab.addEventListener('click', () => {
    casinoContent.classList.remove('hidden');
    expeditionContent.classList.add('hidden');
    shopContent.classList.add('hidden');
    casinoTab.classList.add('active');
    expeditionTab.classList.remove('active');
    shopTab.classList.remove('active');
});

expeditionTab.addEventListener('click', () => {
    casinoContent.classList.add('hidden');
    expeditionContent.classList.remove('hidden');
    shopContent.classList.add('hidden');
    expeditionTab.classList.add('active');
    casinoTab.classList.remove('active');
    shopTab.classList.remove('active');
});

shopTab.addEventListener('click', () => {
    casinoContent.classList.add('hidden');
    expeditionContent.classList.add('hidden');
    shopContent.classList.remove('hidden');
    shopTab.classList.add('active');
    casinoTab.classList.remove('active');
    expeditionTab.classList.remove('active');
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

// Expeditions
startExpedition.addEventListener('click', () => {
    const fleshAmount = parseInt(fleshInvest.value);

    if (fleshAmount > 0 && !expeditionInProgress) {
        fleshCount -= fleshAmount;
        fleshCounter.textContent = fleshCount;
        saveGame()

        expeditionInProgress = true;
        updateConsole(`Started expedition with ${fleshAmount} flesh.`);
        expeditionProgressBar.classList.remove('hidden');
        const progressBarInner = document.getElementById('expeditionProgressBarInner');
        progressBarInner.style.width = '0%';

        let progress = 0;
        let intervalCount = 0;
        let successProbability = 0.5;
        let failureProbability = 0.5;
        let finalOutcomeDecided = false;

        const interimMessagesLow = [
            "The crew is unsure of the route...",
            "A small storm hits the fleet.",
            "The ship's supplies are dwindling.",
            "An unexpected delay halts the journey.",
            "Mutiny threatens to break out among the crew."
        ];
        const interimMessagesMid = [
            "The winds are in your favor!",
            "The trade route seems promising.",
            "Friendly dolphins swim alongside your vessel.",
            "A distant island comes into view.",
            "Your crew spots a potential new trading partner."
        ];
        const interimMessagesHigh = [
            "Your ship sails with unmatched speed!",
            "The crew spots a hidden treasure map.",
            "A rare and valuable artifact is discovered onboard.",
            "A sea breeze fills the sails with incredible power.",
            "The crew celebrates finding untouched trade routes."
        ];

        const perilousMessages = [
            "A pirate ship appears on the horizon!",
            "The weather worsens, threatening the ship's safety.",
            "An argument breaks out among the crew, leading to chaos.",
            "Your ship strikes an unexpected reef, causing heavy damage.",
            "Supplies have run dangerously low, and the crew is starving."
        ];

        const interval = setInterval(() => {
            progress += 1.67;
            intervalCount += 1;
            progressBarInner.style.width = progress + '%';

            if (intervalCount % 12 === 0) {
                let interimMessage = '';
                let randomChance = Math.random();

                if (fleshAmount <= 111) {
                    interimMessage = interimMessagesLow[Math.floor(Math.random() * interimMessagesLow.length)];
                } else if (fleshAmount <= 178) {
                    interimMessage = interimMessagesMid[Math.floor(Math.random() * interimMessagesMid.length)];
                } else {
                    interimMessage = interimMessagesHigh[Math.floor(Math.random() * interimMessagesHigh.length)];
                }

                if (progress >= 20 && progress < 40) {
                    if (randomChance < 0.3) {
                        successProbability += 0.1;
                        interimMessage += " The winds turn in your favor, boosting morale!";
                    } else if (randomChance > 0.7) {
                        failureProbability += 0.1;
                        interimMessage += " Supplies are dwindling faster than expected.";
                    }
                } else if (progress >= 40 && progress < 60) {
                    if (randomChance < 0.3) {
                        successProbability += 0.2;
                        interimMessage += " A nearby island provides fresh supplies.";
                    } else if (randomChance > 0.7) {
                        failureProbability += 0.2;
                        interimMessage += " The crew spots a storm approaching.";
                    }
                } else if (progress >= 60 && progress < 80) {
                    if (randomChance < 0.3) {
                        successProbability += 0.3;
                        interimMessage += " A successful trade boosts your profits.";
                    } else if (randomChance > 0.7) {
                        failureProbability += 0.3;
                        interimMessage += " Pirates are spotted nearby!";
                    }
                } else if (progress >= 80 && progress < 100) {
                    if (randomChance > 0.6) {
                        interimMessage = perilousMessages[Math.floor(Math.random() * perilousMessages.length)];
                        failureProbability += 0.5;
                    } else {
                        successProbability += 0.4;
                        interimMessage += " The destination is near, and the crew is hopeful!";
                    }
                }

                updateConsole(`${interimMessage} Progress: ${Math.floor(progress)}%.`);
            }

            if (progress >= 100) {
                clearInterval(interval);
                expeditionInProgress = false;
                expeditionProgressBar.classList.add('hidden');

                let result = '';
                let fleshEarned = 0;

                if (!finalOutcomeDecided) {
                    if (Math.random() < failureProbability) {
                        const extraLoss = Math.floor(fleshAmount * (0.10 + Math.random() * 0.20));
                        result = `Expedition failed! You lost an additional ${extraLoss} flesh.`;
                        fleshCount -= extraLoss;
                        fleshCounter.textContent = fleshCount;
                        saveGame()
                    } else {
                        fleshEarned = Math.floor(successProbability * fleshAmount);
                        result = `Success! Earned ${fleshEarned} flesh.`;
                        fleshCount += fleshEarned;
                        fleshCounter.textContent = fleshCount;
                        saveGame()
                    }

                    finalOutcomeDecided = true;
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
                saveGame()
            }
        }, 1000);
    } else {
        updateConsole('Invalid flesh amount or expedition already in progress.');
    }
});

// Popups for selecting numbers
document.getElementById('selectNumbers6').addEventListener('click', () => {
    document.getElementById('numberPopup6').classList.remove('hidden');
});
document.getElementById('selectNumbers20').addEventListener('click', () => {
    document.getElementById('numberPopup20').classList.remove('hidden');
});

// Confirm selection
document.getElementById('confirmSelection6').addEventListener('click', () => {
    const selected = getSelectedNumbers(6);
    document.getElementById('selectedNumbers6').textContent = `Selected: ${selected.join(', ')}`;
    document.getElementById('numberPopup6').classList.add('hidden');
});

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
                let revenueMultiplier = 1.75 - 0.25 * (numSelected - 1);
                revenueMultiplier = Math.max(revenueMultiplier, 1);

                if (selectedNumbers.includes(diceRoll)) {
                    let revenue = betAmount * revenueMultiplier;
                    profit = Math.floor(revenue*2 - betAmount);
                    fleshCount += profit;
                    message = `You rolled a ${diceRoll}! You win ${profit} flesh.`;
                } else {
                    message = `You rolled a ${diceRoll}. You lose ${betAmount} flesh.`;
                }

                fleshCounter.textContent = fleshCount;
                updateConsole(message);
                saveGame()
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
                        updateCounter()
                        message = `You rolled a ${diceRoll} and got a token! You win ${profit} flesh.`;
                    } else {
                        message = `You rolled a ${diceRoll}. You win ${profit} flesh.`;
                    }
                } else {
                    message = `You rolled a ${diceRoll}. You lose ${betAmount} flesh.`;
                }

                fleshCounter.textContent = fleshCount;
                updateConsole(message);
                saveGame()
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
                        updateCounter()
                        message += `You got triple ${num1} and won a token!`;
                    } else {
                        profit = Math.floor(betAmount * 2.5);
                        fleshCount += profit;
                        message += `You got triple ${num1}! You win ${profit} flesh.`;
                    }
                } else if (num1 === num2 || num2 === num3 || num1 === num3) {
                    profit = Math.floor(betAmount * 1.25);
                    fleshCount += profit;
                    message += `You got a pair! You win ${profit} flesh.`;
                } else {
                    message += `No match. You lose ${betAmount} flesh.`;
                }

                fleshCounter.textContent = fleshCount;
                updateConsole(message);
                saveGame()
            }, 3000);
        } else {
            updateConsole('Not enough flesh to place this bet.');
        }
    } else {
        updateConsole('Invalid bet amount.');
    }
});

// Handle purchases
document.getElementById('buyMK1').addEventListener('click', () => {
    if (fleshTyperMultiplier > 1) {
        updateConsole('Flesh Typer MK1 already purchased.');
    } else if (fleshCount >= 100) {
        fleshCount -= 100;
        fleshTyperMultiplier = 2;
        updateConsole('Purchased Flesh Typer MK1! Flesh is now multiplied by 2.');
        updateCounter();
        saveGame()
    } else {
        updateConsole('Not enough flesh for MK1.');
    }
});

document.getElementById('buyMK2').addEventListener('click', () => {
    if (fleshTyperMultiplier > 2) {
        updateConsole('Flesh Typer MK2 already purchased.');
    } else if (fleshCount >= 1000) {
        fleshCount -= 1000;
        fleshTyperMultiplier = 3;
        updateConsole('Purchased Flesh Typer MK2! Flesh is now multiplied by 3.');
        updateCounter();
        saveGame()
    } else {
        updateConsole('Not enough flesh for MK2.');
    }
});

document.getElementById('buyMK3').addEventListener('click', () => {
    if (fleshTyperMultiplier > 3) {
        updateConsole('Flesh Typer MK3 already purchased.');
    } else if (fleshCount >= 10000) {
        fleshCount -= 10000;
        fleshTyperMultiplier = 4;
        updateConsole('Purchased Flesh Typer MK3! Flesh is now multiplied by 4.');
        updateCounter();
        saveGame()
    } else {
        updateConsole('Not enough flesh for MK3.');
    }
});

// Passive flesh generator
document.getElementById('buyPassiveGenerator').addEventListener('click', () => {
    if (fleshCount >= 10000 && !passiveFleshGeneratorActive) {
        fleshCount -= 10000;
        passiveFleshGeneratorActive = true;
        saveGame()
        updateConsole('Purchased Passive Flesh Generator! Generating +1 flesh every 2 seconds.');

        passiveGeneratorInterval = setInterval(() => {
            if (!passiveGeneratorNeedsRestart) {
                fleshCount += 1;
                updateCounter();
                saveGame()
            }
        }, 2000);

        setTimeout(() => {
            passiveGeneratorNeedsRestart = true;
            updateConsole('The passive generator has stopped. Type "restart" to resume.');
            saveGame()
        }, 900000);
    } else if (passiveFleshGeneratorActive) {
        updateConsole('Passive generator already active.');
    } else {
        updateConsole('Not enough flesh for Passive Generator.');
    }
});

// Insurance contracts
document.getElementById('buyInsurance').addEventListener('click', () => {
    let cost = 800 * (currentInsuranceLevel + 1);
    if (fleshCount >= cost && currentInsuranceLevel < 5) {
        fleshCount -= cost;
        currentInsuranceLevel++;
        insuranceReduction = [0.10, 0.15, 0.25, 0.40, 0.50, 0.65][currentInsuranceLevel];
        updateConsole(`Purchased Insurance Contract. Losses reduced by ${insuranceReduction * 100}%.`);
        updateCounter();
        saveGame()
    } else {
        updateConsole('Not enough flesh for next insurance contract or max contract reached.');
    }
});

// Better insurance contracts
document.getElementById('buyBetterInsurance').addEventListener('click', () => {
    if (fleshCount >= 600 && !betterInsuranceActive) {
        fleshCount -= 600;
        betterInsuranceActive = true;
        insuranceFailureRate = 0.15;
        updateConsole('Purchased Better Insurance! Refusal rate reduced to 15% for next payout.');
        updateCounter();
        saveGame()
    } else if (betterInsuranceActive) {
        updateConsole('Better insurance is already active. It will reset after the next expedition.');
    } else {
        updateConsole('Not enough flesh for Better Insurance.');
    }
});