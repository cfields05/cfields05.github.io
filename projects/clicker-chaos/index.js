
// Variables
let mana = 0;
let manaPerSecond = 0;
const newsTimer = 5_000;
const priceIncrease = 1.15;

/* LISTS BELOW TO BE USED IN NEWS GENERATION */

const items = [
    "cursed crystals",
    "magic runes",
    "love potions",
    "dragon eggs",
    "magic wands",
    "spellbooks",
    "cast iron cauldrons",
    "broomsticks",
    "comically oversized squeaky hammers"
];

const descriptions = [
    "taste really bad",
    "have too many calories",
    "explode when shaken",
    "are too shiny",
    "aren't shiny enough",
    "are just the right amount of shiny",
    "don't seem very magical at all, honestly"
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
    () => `Mass recall of ${randomIndex(companies)}’s ${randomIndex(items)} due to spontaneous combustion!`,
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

// Each autoclicker obj stores a mana per second value, the amount owned (starting at 0), and the base cost of the item, as well as the ids for the count and cost elements
// Black Cats generate 1 mana per second and base price is 50 points of mana
const blackCat = createAutoclicker(1, 50, "#cat-count", "#cat-cost");

// Magic Wands generate 10 mana per second and base price is 200 points of mana
const magicWand = createAutoclicker(10, 200, "#wand-count", "#wand-cost");

// Magic Staves generate 25 mana per second and base price is 500 points of mana
const magicStaff = createAutoclicker(25, 500, "#staff-count", "#staff-cost");

// Magic Broomsticks generate 50 mana per second and base price is 1000 points of mana
const magicBroomstick = createAutoclicker(50, 1000, "#broom-count", "#broom-cost");

// Magic Spellbooks generate 100 mana per second and base price is 1600 points of mana
const magicSpellbook = createAutoclicker(100, 1600, "#book-count", "#book-cost");

// Super Cool Wizard Hats generate 200 mana per second and base price is 2500 points of mana
const wizardHat = createAutoclicker(200, 2500, "#hat-count", "#hat-cost");

// really bad solution I think, but autoclickers holds names of autoclickers so that strings can be passed into an object
// and those grab the other objects for use in functions
// ex. button val = blackCat, pass autoclickers[$('button').val()] into purchase function so that it'll grab blackCat dynamically
const autoclickers = {
    blackCat: blackCat,
    magicWand: magicWand,
    magicStaff: magicStaff,
    magicBroomstick: magicBroomstick,
    magicSpellbook: magicSpellbook,
    wizardHat: wizardHat,
};

// Core Functionality
newsMessage();
setInterval(newsMessage, newsTimer);
setInterval(addAutoMana, 1_000);

// Event/Click Listeners
$("#clicker-image").on("click", generateMana);

$('button').click(function() {
    if ($(this).hasClass('purchase')) {
        purchase(autoclickers[$(this).val()]);
    } else if ($(this).hasClass('sell')) {
        sell(autoclickers[$(this).val()])
    }
});

// Functions
// Factory function to automatically create an autoclicker object
function createAutoclicker(mps, baseCost, countId, costId) {
    return {
        mps: mps,
        numberOwned: 0,
        baseCost: baseCost,
        countId: countId,
        costId: costId,
    };
}

// Increases mana and updates text when orb is clicked
function generateMana() {
    mana++;
    $("#mana-amount").text("Mana Generated: " + Math.floor(mana) + " points");
}

// Purchases any item passed in, increasing the cost of that item and the mana per second of the player
function purchase(item) {
    // item = item.data.obj;
    const cost = Math.ceil(item.baseCost * Math.pow(priceIncrease, item.numberOwned));

    if (mana >= cost) {
        mana -= cost;
        manaPerSecond += item.mps;
        item.numberOwned++;

        $("#mana-amount").text("Mana Generated: " + Math.floor(mana) + " points");
        $("#mana-per-second").text("Mana Generated per Second: " + manaPerSecond + " points");
        $(item.countId).text("Owned: " + item.numberOwned);
    }

    const newCost = Math.ceil(
        item.baseCost * Math.pow(priceIncrease, item.numberOwned)
    );
    $(item.costId).text("Cost: " + newCost + " mana");
}

function sell(item) {
    // item = item.data.obj;
    const cost = Math.ceil(item.baseCost * Math.pow(priceIncrease, item.numberOwned));
    const sellPrice = Math.floor(cost * 0.5);

    if (item.numberOwned > 0) {
        mana += sellPrice;
        manaPerSecond -= item.mps;
        item.numberOwned--;

        $("#mana-amount").text("Mana Generated: " + Math.floor(mana) + " points");
        $("#mana-per-second").text("Mana Generated per Second: " + manaPerSecond + " points");
        $(item.countId).text("Owned: " + item.numberOwned);
    }

    const newCost = Math.ceil(
        item.baseCost * Math.pow(priceIncrease, item.numberOwned)
    );
    $(item.costId).text("Cost: " + newCost + " mana");
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