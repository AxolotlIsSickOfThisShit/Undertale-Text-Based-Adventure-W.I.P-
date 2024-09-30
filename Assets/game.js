function appendOutput(message) {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML += `<p>* ${message}</p>`;
    outputDiv.scrollTop = outputDiv.scrollHeight;
};

function handleInput(input) {
    const commandParts = input.trim().toLowerCase().split(' ');
    const action = commandParts[0];
    const target = commandParts.slice(1).join(' '); // Join the rest as target

    if (alias[action]) {
        alias[action](target)
        return;
    };

    if (cmd[action]) {
        cmd[action](target);
    } else {
        appendOutput(`I don't understand "${input}". Type help if you need help.`);
    };


};

function calcATK(lv,bonus) {
    let atk = 6 + lv * 4
    return atk + bonus;
}

function calcDEF(lv,bonus) {
    let def = 7 + lv * 3
    return def + bonus;
}

function calcHP(lv) {
    let hp = hp + Math.floor(lv * 3.2)
    return hp;
}

function calcMAXHP(lv) {
    let  maxhp = 20 + Math.floor(lv * 3.2)
    return maxhp;
}

function lvUP() {
    let lv = gameState.lv;
    let exp = gameState.exp;
    if (Math.floor(exp / 150 * lv) >= lv) {
        lv++
        gameState.def = calcDEF(lv,gameState.bonusdf)
        gameState.atk = calcATK(lv,gameState.bonusat)
        gameState.hp = calcHP(lv);
        gameState.maxhp = calcMAXHP(lv);
        gameState.exp = 0;
        gameState.lv = lv
        appendOutput(`Your LOVE increased to ${lv}!`)
    }
}

function displayLocation() {
    const location = locations[gameState.currentLocation];
    appendOutput(location.description);
    locations[gameState.currentLocation].event();
};

function gameOver() {
    appendOutput('Game Over! (Press Ctrl + R or refresh the page.)');
    document.getElementById("input").style.display = "none";
};

document.getElementById('input').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        const inputField = document.getElementById('input');
        const userInput = inputField.value;
        handleInput(userInput);
        inputField.value = '';
    }
});

function onBattleWin(exp,G) {
    gameState.exp =  gameState.exp + exp;
    gameState.g = gameState.g + G;
    lvUP();
}

// DO NOT MODIFY ANYTHING ABOVE THIS COMMENT!!! --------------------------------------------------------

const gameState = {
    currentLocation: 'firstLocation', // Change this value to change the room you start in!
    inventory: ["Light Keyboard"], // Add things inside this list to add them to your inventory!
    hp:20,
    maxhp:20,
    lv:1,
    atk:1,
    bonusat: 0,
    def:1,
    bonusdf:0,
    armor: "bandage",
    weapon: "stick",
    exp:0,
    g:0
}; // Modify this const to add things to the game logic!

const locations = {
    // You WILL get an error if you do not define the event property.
    firstLocation: {
        description: "You are on a patch of golden flowers.<br>* To the east is a hall with a doorway at the end of it.",
        east: "flowey0",
        event: () => {
            console.log("First Location has no event set.");
        }
    },
    flowey0: {
        description: "You are in a large room with a doorway at the end of it.<br>There's a small patch of grass in the middle of the room."
    }
}; // Expand and modify this list to add more locations.
const items = {
    "Monster Candy": {
        description: "A piece of candy that heals 5 HP.<br>* Does not taste like black licorice.",
        h:5,
        onUse: (amount) => {
            appendOutput("You eat the Monster Candy.<br>* It actually doesn't taste like licorice.");
            appendOutput(`You healed ${amount} HP.`);
            // Here you can add more effects.
        }
    },
    "Spider Donut": {
        description: "A donut made by spiders, for spiders...<br>* Of spiders! (Heals 9 HP.)",
        h:9,
        onUse: (amount) => {
            appendOutput("You ate the Spider Donut. Not bad for a bunch of arthropods!");
            appendOutput(`You healed ${amount} HP.`);
            // Here you can add more effects.
            appendOutput("A spider notices you eating the donut and thanks you.")
        }
    }
}// List of items. Items MUST be in this list or the equipment list, or the game won't recognize them.

const equipment = {
    Bandage: {
        description: "A worn bandage that heals 5 HP when used.<br>* Not very effective.",
        h:5,
        onUse: () => {
            appendOutput("You reapply the bandage to heal yourself.");
            appendOutput(`You healed ${h} HP.`);
        }
    },
    Stick: {
        description: "A stick that can be used as a weapon.<br>* Not very effective.",
        a:0,
        onUse: () => {
            appendOutput("You equip the stick.");
            appendOutput("You are now holding a stick.");
            gameState.bonusat = a
            let atk = calcATK(gameState.lv,a) 
            appendOutput(`Your ATK is now ${atk}.`)
            gameState.atk = atk
        }
    },
    "Light Keyboard": {
        description: "A lightweight keyboard.<br>* Could be used as a weapon.",
        a:2,
        onUse:()=>{
            appendOutput("You equip the keyboard.");
            appendOutput("It makes a clacking sound as you do.");
            gameState.bonusat = a
            let atk = calcATK(gameState.lv,a) 
            appendOutput(`Your ATK is now ${atk}.`)
            gameState.atk = atk
        }
    }
}

const cmd = {
    use: (i)=>{
        if (i in items | i in equipment) {
            if (i in inventory) {
                i.onUse();
            } else {
                appendOutput("You don't have that item.");
            }
        } else {
            appendOutput(`"${i}" is not a valid item. Check your capitalization and spelling, and try again.`)
        }
    },

    items: () => {
        appendOutput(`You have: ${gameState.inventory.join(", ")}`);
    },
    go: (target) => {
        const location = locations[gameState.currentLocation];
        if (target in location) {
            gameState.currentLocation = location[target];
            displayLocation(); // Example: Go north moves the player to a northern exit, if there is one.
        } else {
            appendOutput("You can't go that way!");
        }
    },
    take: (target) => {
        const location = locations[gameState.currentLocation];
        if (location.items && location.items.includes(target)) {
            gameState.inventory.push(target);
            location.items = location.items.filter(item => item !== target); // Remove item from location
            appendOutput(`You took the ${target}.`); // Example:  "You took the key." would be the output of "Take key" and would also remove the key from the room.
        } else {
            appendOutput(`There is no ${target} here to take.`);
        }
    },
    look: () => {
        // Example of looking at the current location
        appendOutput(locations[gameState.currentLocation].description); // Example: look would display the description for the current room.
    },
    clear: () => {
        let out = document.getElementById("output")
        while (out.firstChild) {
            out.removeChild(out.firstChild)
        }; // Clears output history.
        displayLocation();
    },
    help: () => {
        appendOutput("Available commands: go (or walk) [direction] (or just type the first letter of a direction and nothing else), take (or get or grab) [item], examine (or look) [room], help (or \"?\"), clear (or clr), ITEM (or items), stat, use (or equip) [item (or equipment)]."); // Modify this string to change the HELP message!
    }, // Modify or add definitions here to add more commands.
    stat: () => {
        appendOutput(`HP: ${gameState.hp}<br>* Max HP: ${gameState.maxhp}<br>* LV: ${gameState.lv}<br>* ATK: ${gameState.atk}<br>* DEF: ${gameState.def}`)
    }
};

const alias = {
    item: () => {
        cmd.items();
    },
    get: (target) => {
        cmd.take(target);
    },
    grab: (target) => {
        cmd.take(target);
    },
    n: () => {
        cmd.go("north");
    },
    e: () => {
        cmd.go("east");
    },
    s: () => {
        cmd.go("south");
    },
    w: () => {
        cmd.go("west");
    },
    u: () => {
        cmd.go("up");
    },
    d: () => {
        cmd.go("down");
    },
    walk: (target) => {
        cmd.go(target);
    },
    "?": () => {
        cmd.help();
    },
    clr: () => {
        cmd.clear();
    },
    equip:(i)=>{
        cmd.use(i);
    }
}; // This const defines aliases. To add one, simply follow the format of the ones above.

function startGame() {
    appendOutput("Welcome to the <b>UNDERGROUND</b>.<br><br>* (Before we begin, I would like to thank you for checking this out! As of now it's <b>very unfinished</b>, so please don't expect this to be the final quality of the game! Also, please consider purchasing <a href='https://store.steampowered.com/app/391540/Undertale/'>UNDERTALE</a>, because it's quite the experience!)<br><br>* Type \"<b>help</b>\" or \"<b>?</b>\" for help."); // Swap this text with your welcome message! 
    displayLocation();
};

// DO NOT DELETE ANYTHING AFTER THIS POINT!!! -----------------------------------------------------------
startGame();