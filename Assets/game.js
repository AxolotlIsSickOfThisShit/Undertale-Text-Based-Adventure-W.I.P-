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

function calcATK(lv, bonus) {
    let atk = 6 + lv * 4
    return atk + bonus;
}

function calcDEF(lv, bonus) {
    let def = 7 + lv * 3
    return def + bonus;
}

function calcHP(lv) {
    let hp = hp + Math.floor(lv * 3.2)
    return hp;
}

function calcMAXHP(lv) {
    let maxhp = 20 + Math.floor(lv * 3.2)
    return maxhp;
}

function lvUP() {
    let lv = save.lv;
    let exp = save.exp;
    if (Math.floor(exp / 150 * lv) >= lv) {
        lv++
        save.def = calcDEF(lv, save.bonusdf)
        save.atk = calcATK(lv, save.bonusat)
        save.hp = calcHP(lv);
        save.maxhp = calcMAXHP(lv);
        save.exp = 0;
        save.lv = lv
        appendOutput(`Your LOVE increased to ${lv}!`)
    }
}

function displayLocation() {
    const location = locations[save.currentLocation];
    appendOutput(location.description);
    locations[save.currentLocation].event();
};

function gameOver() {
    appendOutput('Game Over! (Press Ctrl + R or refresh the page.)');
    document.getElementById("input").style.display = "none";
};

document.getElementById('input').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        const inputField = document.getElementById('input');
        const userInput = inputField.value;
        if (save.talking) {
            appendOutput(userInput);
            talkFinish(userInput)
        } else {
            handleInput(userInput);
        }
        inputField.value = '';
    }
});

function onBattleWin(exp, G) {
    save.exp = save.exp + exp;
    save.g = save.g + G;
    lvUP();
}

// DO NOT MODIFY ANYTHING ABOVE THIS COMMENT!!!--------------------------------------------------------

function talkFinish(n) {
    let target = save.targetChat 
    let choices = npc.target.talk
    let id = choices[n]
    let text = id.question
    let output = id.response
    appendOutput(`<b>${text}</b>`);
    for (i of output) {
        appendOutput(output[i]);
    }
}

const npc = {
    flowey: {
        fname: "Flowey",
        lname: "the Flower",
        isEnemy: false,
        description: "A helpful talking golden flower, who wants to be your best friend.",
        isTeamM: false,
        canTalk: true,
        talk: {
            1: {
                question:"Who are you?",
                response: [
                    "I'm Flowey the Flower, your new best friend!"
                ],
                item: false,
                event:()=>{
                    console.log("This dialogue triggers no event.")
                }
            },

            2: {
                question:"Why are you helping me?",
                response: [
                    "Well, golly, I just want to help you!<br>* Out of the kindness of my <b>SOUL</b>!"
                ],
                item: false,
                event:()=>{
                    console.log("This dialogue triggers no event.")
                }
            },

            3: {
                question:"Can you tell me how this game works?",
                response: [
                    "Of course I can, pal!",
                    "This game is similar to a small indie game you may have heard of. UNDERTALE!",
                    "In UNDERTALE, you have the ability to choose whether you want to <i>FIGHT</i> or <b>SPARE</b> every enemy you come across.",
                    "In UNDERTOME, it's the same! You can choose to <i>FIGHT</i> your enemies to <i>gain EXP and LOVE</i>, which will make you stronger.",
                    "However, you can also say and do things to the enemies in order to calm them down and <b>SPARE</b> them, which <b>does not give you EXP or LOVE</b>, but still gives you some G.",
                    "Also, your little help menu neglects to mention that you can just type <b> W E S</b> or <b>N</b> to travel in the cardinal directions. You can also go up or down sometimes, and you can type <b>U</b> or <b>D</b> to do just that!",
                    "Well, I hope I was helpful, buddy!"
                ],
                item: false,
                event:()=>{
                    console.log("This dialogue triggers no event.")
                }
            },

            4: {
                question: "When will this game be finished?",
                response: [
                    "Whenever I stop giving you the option to ask me!"
                ],
                item: false,
                event:()=>{
                    console.log("This dialogue triggers no event.")
                }
            }
        },
        altdesc: "A golden flower.",
        stat: {
            atk: "N/A",
            def: "N/A",
            hp: "N/A",
            maxhp: "N/A",
        }
    }
}

function floweyCheck() {
    let f=save.flowey;
    let a=save.currentLocation;
    let output;
    switch(a,f) {
        default:
            output = false;
            break;
        case ("flowey0",0):
            save.flowey = 1;
            output = true;
            break;
    }
    return(output);
}

const save = {
    currentLocation: 'firstLocation', // Change this value to change the room you start in!
    inventory: ["light keyboard", "spider donut"], // Add things inside this list to add them to your inventory!
    hp: 20,
    maxhp: 20,
    lv: 1,
    atk: 1,
    bonusat: 0,
    def: 1,
    bonusdf: 0,
    armor: "bandage",
    weapon: "stick",
    exp: 0,
    g: 0, 
    flowey:0,
    inbattle:0,
    talking:0,
    targetChat:false
} // Modify this const to add things to the game logic and SAVE file!

const locations = {
    // You WILL get an error if you do not define the event property.
    firstLocation: {
        description: "You are on a patch of golden flowers.<br>* To the east is a hall with a doorway at the end of it.",
        east: "flowey0",
        items: [
            "golden flower"
        ],
        event: () => { // Always add this property in no matter WHAT.
            console.log("First Location has no event set.");
        },
        npc: [0]
    },
    flowey0: {
        description: "You are in a large room with a doorway at the end of it.<br>There's a small patch of grass in the middle of the room.<br>* There's a door to your south, heading back the way you came.",
        south: "firstLocation",
        npc: [

        ],
        event: () => {
            let spwn = floweyCheck();

            if (spwn) {
                locations.flowey0.npc.push("flowey")
                appendOutput("Suddenly, a golden yellow flower sprouts from the grass patch.");
                appendOutput("Howdy! I'm Flowey! Flowey the Flower!<br>* Hmm... you seem new to this. Maybe even new to the Underground!<br>* Well, guess lil old me should be there to help you!<br>* Come over and talk to me if you want to get some help!")
            }
        }
    }
}; // Expand and modify this list to add more locations.
const items = {
    "monster candy": {
        description: "A piece of candy that heals 5 HP.<br>* Does not taste like black licorice.",
        h: 5,
        onUse: (amount) => {
            appendOutput("You eat the Monster Candy.<br>* It actually doesn't taste like licorice.");
            appendOutput(`You healed ${amount} HP.`);
            save.inventory.removeChild("monster candy")
            // Here you can add more effects.
        }
    },
    
    "spider donut": {
        description: "A donut made by spiders, for spiders...<br>* Of spiders! (Heals 9 HP.)",
        h: 9,
        onUse: (amount) => {
            appendOutput("You ate the Spider Donut. Not bad for a bunch of arthropods!");
            appendOutput(`You healed ${amount} HP.`);
            // Here you can add more effects.
            appendOutput("A spider notices you eating the donut and thanks you.")
            save.inventory.removeChild("spider donut")
        }
    },

    bandage: {
        description: "A worn bandage that heals 5 HP when used.<br>* Not very effective.",
        h: 5,
        onUse: () => {
            appendOutput("You reapply the bandage to heal yourself.");
            appendOutput(`You healed ${h} HP.`);
        }
    },
    //Equipment is below this line.


    stick: {
        description: "A stick that can be used as a weapon.<br>* Not very effective.",
        a: 0,
        onUse: () => {
            appendOutput("You equip the stick.");
            appendOutput("You are now holding a stick.");
            save.bonusat = a
            let atk = calcATK(save.lv, a)
            appendOutput(`Your ATK is now ${atk}.`)
            save.atk = atk
        }
    },
    
    "light keyboard": {
        description: "A lightweight keyboard.<br>* Could be used as a weapon.",
        a: 2,
        onUse: () => {
            appendOutput("You equip the keyboard.");
            appendOutput("It makes a clacking sound as you do.");
            save.bonusat = a
            let atk = calcATK(save.lv, a)
            appendOutput(`Your ATK is now ${atk}.`)
            save.atk = atk
        }
    }
}// List of items. Items MUST be in this list or the game won't recognize them.


const cmd = {
    talk:(target)=>{
        if (save.inbattle!=0){
            console.log("Sorry, battles are not fully implemented yet!");
            return;
        } else {
            if (save.currentLocation.npc[target]) {
                appendOutput("What would you like to say? (Please type the number corresponding to the question.");
                for (i of npc[target].talk) {
                    appendOutput(`${npc[target].talk[i].question}: ${npc[target].talk[i]}`);
                }
                save.talking = 1;
                save.targetChat = target;
            } else {
                appendOutput(`"${target}" is not a valid npc.`);
                appendOutput(`NPC:s in this room: ${npc}`);
            }
            
        }
    },

    use: (i) => {
        if (items[i]) {
            if (inventory[i]) {
                i.onUse();
            } else {
                appendOutput(`You don't have ${i}.`);
            }
        }else {
            appendOutput(`"${i}" is not a valid item or equipment. Check your spelling and try again.`);
        };
    },

    items: () => {
        appendOutput(`You have: ${save.inventory.join(", ")}`);
    },
    go: (target) => {
        const location = locations[save.currentLocation];
        if (target in location) {
            save.currentLocation = location[target];
            displayLocation(); // Example: Go north moves the player to a northern exit, if there is one.
        } else {
            appendOutput("You can't go that way!");
        }
    },
    take: (target) => {
        const location = locations[save.currentLocation];
        if (location.items && location.items.includes(target)) {
            save.inventory.push(target);
            location.items = location.items.filter(item => item !== target); // Remove item from location
            appendOutput(`You took the ${target}.`); // Example:  "You took the key." would be the output of "Take key" and would also remove the key from the room.
        } else {
            appendOutput(`There is no ${target} here to take.`);
        }
    },
    look: () => {
        // Example of looking at the current location
        appendOutput(locations[save.currentLocation].description); // Example: look would display the description for the current room.
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
        appendOutput(`HP: ${save.hp}<br>* Max HP: ${save.maxhp}<br>* LV: ${save.lv}<br>* ATK: ${save.atk}<br>* DEF: ${save.def}`)
    }
}; // This const defines the default name of commands. To add variations of a command, see const alias.

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
    equip: (i) => {
        cmd.use(i);
    }
}; // This const defines aliases. To add one, simply follow the format of the ones above.

function startGame() {
    appendOutput("Welcome to the <b>UNDERGROUND</b>.<br><br>* (Before we begin, I would like to thank you for checking this out! As of now it's <b>very unfinished</b>, so please don't expect this to be the final quality of the game! Also, please consider purchasing <a href='https://store.steampowered.com/app/391540/Undertale/'>UNDERTALE</a>, because it's quite the experience!)<br><br>* Type \"<b>help</b>\" or \"<b>?</b>\" for help."); // Swap this text with your welcome message! 
    displayLocation();
}; // Things within this function happen when the page loads

// DO NOT DELETE ANYTHING AFTER THIS POINT!!! -----------------------------------------------------------
startGame();