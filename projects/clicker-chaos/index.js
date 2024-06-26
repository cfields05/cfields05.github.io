
// Variables
let mana = 0;
let manaPerSecond = 0;
const newsTimer = 5_000;
const priceIncrease = 1.15;

// items array holds a list of items to be used in news generation
const items = [
    "cursed crystals",
    "magic runes",
    "love potions",
    "dragon eggs",
    "magic wands",
    "spellbooks",
    "cast iron cauldrons",
    "broomsticks",
];

// people array holds a list of random people to be used in news generation
const people = [
    "local wizard",
    "neighborhood crazy lady",
    "famous archmage",
    "noseless warlock",
    "the boy who lived",
    "know-it-all witch",
    "fairy godmother",
];

// phrases array holds a list of phrases to be used in news generation
const phrases = [
    "Bippity Boppity Boo",
    "Abra Cadabra",
    "Avada Kedavra",
    "Dragons aren't even that cool anyway",
    "Shouldn't have said that. Should NOT have said that",
    "It's levi-OH-sa, not levio-SAH",
];

// questions holds a list of questions to be used in news generation
const questions = [
    "What IS the deal with airline food, anyway?",
    "How exactly does a broom generate mana?",
    "Have you seen Fantasia?",
];

// news array creates random messages to be displayed in the news bar
const news = [
    () => `Prices of name-brand ${randomIndex(items)} skyrocketing!`,
    () => `Mass recall of famous ${randomIndex(items)} due to spontaneous combustion!`,
    () => `“${randomIndex(phrases)},” claims ${randomIndex(people)}!`,
    () => `${capitalize(people)} declares computers objectively inferior to magic!`,
    () => `Enchanted ${randomIndex(items)} said to reach speeds of 350 miles per hour!`,
    () => `Popular ${randomIndex(items)} faulty, states ${randomIndex(people)}!`,
    () => `“${randomIndex(questions)},” asks ${randomIndex(people)}.`,
];

// “” quotation marks (for copying later)

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


// Core Functionality
newsMessage();
setInterval(newsMessage, newsTimer);
setInterval(addAutoMana, 1_000);

// Event/Click Listeners
$("#clicker-image").on("click", generateMana);

$("#purchase-cat").on("click", {obj: blackCat}, purchase);
$("#purchase-wand").on("click", {obj: magicWand}, purchase);
$("#purchase-staff").on("click", {obj: magicStaff}, purchase);
$("#purchase-broom").on("click", {obj: magicBroomstick}, purchase);
$("#purchase-book").on("click", {obj: magicSpellbook}, purchase);
$("#purchase-hat").on("click", {obj: wizardHat}, purchase);

$("#sell-cat").on("click", {obj: blackCat}, sell);
$("#sell-wand").on("click", {obj: magicWand}, sell);
$("#sell-staff").on("click", {obj: magicStaff}, sell);
$("#sell-broom").on("click", {obj: magicBroomstick}, sell);
$("#sell-book").on("click", {obj: magicSpellbook}, sell);
$("#sell-hat").on("click", {obj: wizardHat}, sell);

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
    item = item.data.obj;
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
    item = item.data.obj;
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