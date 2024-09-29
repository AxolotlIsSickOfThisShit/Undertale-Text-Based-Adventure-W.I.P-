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

// DO NOT MODIFY ANYTHING ABOVE THIS COMMENT!!! --------------------------------------------------------

const gameState = {
    currentLocation: 'firstLocation', // Change this value to change the room you start in!
    inventory: ["stick", "bandage"], // Add things inside this list to add them to your inventory!
    hp:20,
    maxhp:20,
    lv:1,
    atk:1,
    def:1,

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

const cmd = {
    say: (speech) => {
        let raw = speech;
        let final = raw.replace(/\/y/g, "<b>").replace(/\/n/g, "<br>* ");
        appendOutput(`"${final}"`)
        return(speech);
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
        appendOutput("Available commands: go (or walk) [direction] (or just type the first letter of a direction and nothing else), take (or get or grab) [item], examine (or look) [room], help (or \"?\"), clear (or clr), ITEM (or items), stat, say [speech]."); // Modify this string to change the HELP message!
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
    }
}; // This const defines aliases. To add one, simply follow the format of the ones above.

function startGame() {
    appendOutput("Welcome to the <b>UNDERGROUND</b>.<br><br>* (Before we begin, I would like to thank you for checking this out! As of now it's <b>very unfinished</b>, so please don't expect this to be the final quality of the game! Also, please consider purchasing <a href='https://store.steampowered.com/app/391540/Undertale/'>UNDERTALE</a>, because it's quite the experience!)<br><br>* Type \"<b>help</b>\" or \"<b>?</b>\" for help."); // Swap this text with your welcome message! 
    displayLocation();
};

// DO NOT DELETE ANYTHING AFTER THIS POINT!!! -----------------------------------------------------------
startGame();