
$('.upgrade-box').hide()

// Variables
let mana = 0;
let manaPerSecond = 0;
let clickPower = 1;
const mpsRate = 1_000;
const newsTimer = 5_000;
const priceIncrease = 1.15;

/* LISTS BELOW TO BE USED IN NEWS GENERATION */

const items = [
    "broomsticks",
    "cast iron cauldrons",
    "comically-oversized squeaky hammers",
    "cursed crystals",
    "dragon eggs",
    "love potions",
    "magic runes",
    "magic wands",
    "spellbooks",
];

const descriptions = [
    "taste really bad",
    "taste pretty good",
    "have too many calories",
    "explode when shaken",
    "are too shiny",
    "aren't shiny enough",
    "are just the right amount of shiny",
    "don't seem very magical at all, honestly",
];

const recallEvents = [
    "spontaneous combustion",
    "faulty enchantments",
];

const people = [
    "local wizard",
    "neighborhood crazy lady",
    "famous archmage",
    "noseless warlock",
    "the boy who lived",
    "know-it-all witch",
    "fairy godmother",
    "ancient spirit",
];

const speakerTerms = [
    "says",
    "states",
    "claims",
    "declares",
    "deplores",
    "reveals",
];

const phrases = [
    "Bippity Boppity Boo",
    "Abra Cadabra",
    "Avada Kedavra",
    "Dragons aren't even that cool anyway",
    "Shouldn't have said that. Should NOT have said that",
    "It's levi-OH-sa, not levio-SAH",
    "It's just magic",
];

const questions = [
    "What IS the deal with airline food, anyway?",
    "How exactly does a broom generate mana?",
    "Have you seen Fantasia?",
];

const companies = [
    "MagiCo",
    "WandMart",
    "Whimsi-Corp",
    "Dwarven Forge",
    "AlchemicalWares",
    "Eastern Elven Trading Company",
];

/* LISTS ABOVE TO BE USED IN NEWS GENERATION */

// news array creates random messages to be displayed in the news bar
const news = [
    () => `Prices of name-brand ${randomIndex(items)} skyrocketing!`,
    () => `Mass recall of ${randomIndex(companies)}’s ${randomIndex(items)} due to ${randomIndex(recallEvents)}!`,
    () => `“${randomIndex(phrases)},” ${randomIndex(speakerTerms)} ${randomIndex(people)}!`,
    () => `${capitalize(people)} declares computers objectively inferior to magic!`,
    () => `Enchanted ${randomIndex(items)} said to reach speeds of 350 miles per hour!`,
    () => `Popular ${randomIndex(items)} “${randomIndex(descriptions)},” ${randomIndex(speakerTerms)} ${randomIndex(people)}!`,
    () => `“${randomIndex(questions)},” asks ${randomIndex(people)}.`,
];

/*
    Copy-Paste symbols:
        ‘’ single quotation marks
        “” double quotation marks
        ™ unregistered trademark
        ® registered trademark

*/

// autoclicker holds all autoclickers for dynamically making buttons work and update
const autoclickers = [];

// Each autoclicker obj stores a mana per second value, the amount owned (starting at 0), and the base cost of the item, as well as an id string
// Sytax: createAutoclicker(mps, price, id)
const wand = createAutoclicker(1, 50, "wand");
const cat = createAutoclicker(10, 200, "cat");
const staff = createAutoclicker(25, 500, "staff");
const broom = createAutoclicker(50, 1000, "broom");
const spellbook = createAutoclicker(100, 1600, "book");
const hat = createAutoclicker(200, 2500, "hat");
const cauldron = createAutoclicker(400, 5500, "cauldron");

// Core Functionality
newsMessage();
setInterval(newsMessage, newsTimer);
setInterval(addAutoMana, mpsRate);
setInterval(updateButton, 100);

updateButton();

// Event/Click Listeners
$("#clicker-image").on("click", generateMana);
$(".toggle-button").on("click", handleToggle);

$('button').click(function() {
    const buttonId = parseInt($(this).val());
    if ($(this).hasClass('purchase')) {
        purchase(autoclickers[buttonId]);
    } else if ($(this).hasClass('sell')) {
        sell(autoclickers[buttonId]);
    }
});

// Functions
// Factory function to automatically create an autoclicker object
// Pushes obj to autoclickers array before returning it
function createAutoclicker(mps, baseCost, id) {
    const obj = {
        mps: mps,
        numberOwned: 0,
        baseCost: baseCost,
        id: id,
    };
    autoclickers.push(obj);
    return obj;
}

// Factory function to automatically create an upgrade object
function createUpgrade(mpsMod, clickMod, cost, id, modId) {
    return {
        mpsMod: mpsMod,
        clickMod: clickMod,
        cost: cost,
        id: id,
        modId: modId,
    }
}

// Increases mana and updates text when orb is clicked
function generateMana() {
    mana += clickPower;
    $("#mana-amount").text("Mana Generated: " + Math.floor(mana) + " points");
}

function purchaseUpgrade(item) {
    if (mana >= item.cost) {
        mana -= item.cost;
        item.modId.mps *= item.mpsMod;
        clickPower *= item.clickMod;
    }
}

// Purchases any item passed in, increasing the cost of that item and the mana per second of the player
function purchase(item) {
    const cost = Math.ceil(item.baseCost * Math.pow(priceIncrease, item.numberOwned));
    const countId = '#' + item.id + "-count";
    const costId = '#' + item.id + "-cost";

    if (mana >= cost) {
        mana -= cost;
        manaPerSecond += item.mps;
        item.numberOwned++;

        $("#mana-amount").text("Mana Generated: " + Math.floor(mana) + " points");
        $("#mana-per-second").text("Mana Generated per Second: " + manaPerSecond + " points");
        $(countId).text("Owned: " + item.numberOwned);
    }

    const newCost = Math.ceil(
        item.baseCost * Math.pow(priceIncrease, item.numberOwned)
    );
    $(costId).text("Cost: " + newCost + " mana");
}

function sell(item) {
    const cost = Math.ceil(item.baseCost * Math.pow(priceIncrease, item.numberOwned));
    const sellPrice = Math.floor(cost * 0.40);
    const countId = '#' + item.id + "-count";
    const costId = '#' + item.id + "-cost";

    if (item.numberOwned > 0) {
        mana += sellPrice;
        manaPerSecond -= item.mps;
        item.numberOwned--;

        $("#mana-amount").text("Mana Generated: " + Math.floor(mana) + " points");
        $("#mana-per-second").text("Mana Generated per Second: " + manaPerSecond + " points");
        $(countId).text("Owned: " + item.numberOwned);
    }

    const newCost = Math.ceil(
        item.baseCost * Math.pow(priceIncrease, item.numberOwned)
    );
    $(costId).text("Cost: " + newCost + " mana");
}

// Handles automatically increasing your mana
function addAutoMana() {
    mana += manaPerSecond;
    $("#mana-amount").text("Mana Generated: " + Math.floor(mana) + " points");
}

// Randomly chooses one of the news messages and displays them
function newsMessage() {
    const message = Math.floor(Math.random() * news.length);
    // Fade out animation
    $('#text').finish().fadeTo(300, 0, function () {
        // Update text
        $("#text").text("Breaking News: " + news[message]());
        // Fade back in again
        $('#text').finish().fadeTo(300, 1);
    });
}

// returns a random index within an array
// (used for news messages, shortens the code this way)
function randomIndex(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// capitalizes the first letter in a string at a random index of the array passed in
// (used for news messages, so that indexes can be the first word of a sentence without looking weird)
function capitalize(arr) {
    const random = Math.floor(Math.random() * arr.length);
    return arr[random].charAt(0).toUpperCase() + arr[random].slice(1);
}

// enables / disables a button depending on if the user has enough mana to purchase an item
function updateButton() {
    for (let i = 0; i < autoclickers.length; i++) {
        const item = autoclickers[i];
        const cost = Math.ceil(item.baseCost * Math.pow(priceIncrease, item.numberOwned));
        const purchaseButton = document.getElementById('purchase-' + item.id);
        const sellButton = document.getElementById('sell-' + item.id);;
        if (mana < cost) {
            purchaseButton.disabled = true;
        } else {
            purchaseButton.disabled = false;
        } if (item.numberOwned === 0) {
            sellButton.disabled = true;
        } else {
            sellButton.disabled = false;
        }
    }
}

function handleToggle() {
    $('.autoclicker-box').toggle();
    $('.upgrade-box').toggle();
}