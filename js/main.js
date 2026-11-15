// THE LAST TELEMETRY
// Main game controller

const startButton = document.getElementById("startButton");
const continueButton = document.getElementById("continueButton");

const gameMenu = document.getElementById("game");
const introScreen = document.getElementById("intro-screen");

// Start the mission
startButton.addEventListener("click", () => {
    gameMenu.classList.add("hidden");
    introScreen.classList.remove("hidden");
});

// Continue from introduction
continueButton.addEventListener("click", () => {
    console.log("Mission 001: CASCADE initialized.");
});
