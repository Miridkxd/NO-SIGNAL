// ==========================================
// THE LAST TELEMETRY
// 2D EXPLORATION SYSTEM
// ==========================================

const explorationScreen = document.getElementById("exploration-screen");
const explorationButton = document.getElementById("shipInteriorButton");
const exitExplorationButton = document.getElementById("exitExplorationButton");

const playerCharacter = document.getElementById("playerCharacter");
const interactionPrompt = document.getElementById("interactionPrompt");
const explorationStatus = document.getElementById("explorationStatus");

// ==========================================
// PLAYER SETTINGS
// ==========================================

let playerX = 12;
let playerY = 12;
const playerSpeed = 0.65;

let playerDirection = 1;
let explorationActive = false;

const electricalPanelX = 58;
const interactionDistance = 9;


// ==========================================
// EXPLORATION NAVIGATION
// ==========================================

function showExploration() {

    cockpitMain.classList.add("hidden");
    subtitlePanel.classList.add("hidden");

    explorationScreen.classList.remove("hidden");

    explorationActive = true;

    updatePlayerPosition();

    console.log("2D EXPLORATION STARTED");
}

function exitExploration() {

    explorationScreen.classList.add("hidden");

    cockpitMain.classList.remove("hidden");
    subtitlePanel.classList.remove("hidden");

    explorationActive = false;
    interactionPrompt.classList.add("hidden");

    console.log("RETURNED TO COCKPIT");
}

explorationButton.addEventListener("click", showExploration);
exitExplorationButton.addEventListener("click", exitExploration);


// ==========================================
// PLAYER MOVEMENT
// ==========================================

function updatePlayerPosition() {

    playerCharacter.style.left = playerX + "%";
    playerCharacter.style.bottom = playerY + "%";

    playerCharacter.style.transform =
        playerDirection === -1 ? "scaleX(-1)" : "scaleX(1)";

    checkInteractionDistance();
}

function checkInteractionDistance() {

    const distance = Math.abs(playerX - electricalPanelX);

    if (distance <= interactionDistance) {
        interactionPrompt.classList.remove("hidden");
    } else {
        interactionPrompt.classList.add("hidden");
    }
}


// ==========================================
// ELECTRICAL REPAIR INTERFACE
// ==========================================

const repairModal = document.getElementById("repair-modal");
const repairDescription = document.getElementById("repairDescription");
const repairStep = document.getElementById("repairStep");
const repairProgressFill = document.getElementById("repairProgressFill");
const repairFeedback = document.getElementById("repairFeedback");

const closeRepairButton = document.getElementById("closeRepairButton");
const repairButtons = document.querySelectorAll(".repair-action");

let currentRepairStep = 0;
let repairCompleted = false;
let repairErrors = 0;
const maxRepairErrors = 3;

const repairErrorIndicators =
    document.getElementById("repairErrorIndicators");

const repairErrorCount =
    document.getElementById("repairErrorCount");

const completeMissionButton =
    document.getElementById("completeMissionButton");

const repairSequence = ["isolate", "replace", "restore"];

const repairDescriptions = [
    "STEP 1: Isolate the electrical supply before handling the damaged connection.",
    "STEP 2: Replace the damaged connector with the spare component.",
    "STEP 3: Restore power and verify the secondary bus."
];

function openRepairTerminal() {

    if (repairCompleted) {
        explorationStatus.textContent = "ELECTRICAL SYSTEM: REPAIRED";
        return;
    }

    repairModal.classList.remove("hidden");
    updateRepairInterface();
}

function updateRepairInterface() {

    repairStep.textContent =
        "STEP " + (currentRepairStep + 1) + " / 3";

    repairProgressFill.style.width =
        (currentRepairStep / 3 * 100) + "%";

    repairDescription.textContent =
        repairDescriptions[currentRepairStep];

    // All actions remain available.
    // Incorrect actions will count as errors.
    repairButtons.forEach(button => {
        button.disabled = false;
    });
}


// ==========================================
// REPAIR ACTIONS
// ==========================================

repairButtons.forEach(button => {

    button.addEventListener("click", () => {

        if (repairCompleted) return;

        const action = button.dataset.repair;

        if (action !== repairSequence[currentRepairStep]) {

    repairErrors++;

    const indicators =
        repairErrorIndicators.querySelectorAll(".error-slot");

    if (indicators[repairErrors - 1]) {
        indicators[repairErrors - 1].textContent = "✕";
        indicators[repairErrors - 1].classList.add("error-active");
    }

    repairErrorCount.textContent =
        repairErrors + " / " + maxRepairErrors;

    repairFeedback.textContent =
        "WARNING: INCORRECT PROCEDURE. ERROR " +
        repairErrors + " / " + maxRepairErrors;

    addLog(
        "ENGINEERING WARNING",
        "Incorrect repair procedure. Error " +
        repairErrors + " of " + maxRepairErrors + ".",
        "warning"
    );

    if (repairErrors >= maxRepairErrors) {

        repairFeedback.textContent =
            "CRITICAL FAILURE. REPAIR PROCEDURE ABORTED.";

        addLog(
            "MISSION CONTROL",
            "Three critical repair errors detected. Mission aborted.",
            "warning"
        );

        repairModal.classList.add("hidden");
        finishMission("lost");

    }

    return;
}

        currentRepairStep++;

        repairFeedback.textContent =
            "PROCEDURE CONFIRMED. Proceed to the next step.";

        if (currentRepairStep === 3) {

            repairCompleted = true;

            completeMissionButton.classList.remove("hidden");

            repairProgressFill.style.width = "100%";
            repairStep.textContent = "REPAIR COMPLETE";

            repairDescription.textContent =
                "The damaged connection has been replaced. Secondary electrical distribution restored.";

            repairFeedback.textContent =
                "SUCCESS: ELECTRICAL SYSTEM RESTORED.";

            repairButtons.forEach(button => {
                button.disabled = true;
            });

            explorationStatus.textContent =
                "OBJECTIVE COMPLETE: ELECTRICAL SYSTEM RESTORED";

            // UPDATE SHIP SYSTEMS
            GameState.flags.secondaryCircuitRepaired = true;
            GameState.flags.secondaryCircuitIsolated = false;

            // Restore electrical resources
            updateResource("power", 10);
            // Refresh resource displays
            document.getElementById("energyValue").textContent =
            GameState.resources.power + "%";

            document.getElementById("statusPower").textContent =
            GameState.resources.power + "%";

            // Crew recovery after successful repair
            updateCrewStress("marcus", -10);
            GameState.crew.marcus.trust = Math.min(
            100,
            GameState.crew.marcus.trust + 8
        );

// Update crew interface if available
if (typeof updateCrewDisplay === "function") {
    updateCrewDisplay();
}

console.log("SHIP ELECTRICAL SYSTEM RESTORED");
console.log("POWER:", GameState.resources.power);

            addLog(
                "COMMANDER",
                "Electrical repair completed successfully in engineering.",
                "normal"
            );

            document.getElementById("speakerName").textContent =
                "AUTOMATED SYSTEM";

            document.getElementById("subtitleText").textContent =
                "Secondary electrical distribution restored. System verification recommended.";

            console.log("ELECTRICAL REPAIR COMPLETED");

        } else {
            updateRepairInterface();
        }
    });

});


// ==========================================
// KEYBOARD CONTROLS
// ==========================================

document.addEventListener("keydown", (event) => {

    if (!explorationActive) return;

    const key = event.key.toLowerCase();

    if (
        ["arrowleft", "arrowright", "arrowup", "arrowdown", " "].includes(key)
    ) {
        event.preventDefault();
    }

    // Don't move while the repair terminal is open
    if (!repairModal.classList.contains("hidden")) return;

    if (key === "a" || key === "arrowleft") {
        playerX -= playerSpeed;
        playerDirection = -1;
    }

    if (key === "d" || key === "arrowright") {
        playerX += playerSpeed;
        playerDirection = 1;
    }

    if (key === "w" || key === "arrowup") {
        playerY += playerSpeed;
    }

    if (key === "s" || key === "arrowdown") {
        playerY -= playerSpeed;
    }

    playerX = Math.max(2, Math.min(90, playerX));
    playerY = Math.max(2, Math.min(35, playerY));

    updatePlayerPosition();

    // INTERACT WITH PANEL
    if (key === "e") {

        if (Math.abs(playerX - electricalPanelX) <= interactionDistance) {
            openRepairTerminal();
        }
    }

});


// ==========================================
// CLOSE REPAIR TERMINAL
// ==========================================

closeRepairButton.addEventListener("click", () => {
    repairModal.classList.add("hidden");
});

console.log("EXPLORATION SYSTEM INITIALIZED");

// ==========================================
// COMPLETE MISSION
// ==========================================

completeMissionButton.addEventListener("click", () => {

    if (!repairCompleted) return;

    repairModal.classList.add("hidden");

    finishMission();

});