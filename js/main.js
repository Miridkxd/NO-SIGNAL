
// THE LAST TELEMETRY
// Main game controller

console.log("MAIN.JS IS RUNNING");

// ==========================================
// DOM ELEMENTS
// ==========================================

const startButton = document.getElementById("startButton");
const continueButton = document.getElementById("continueButton");

const gameMenu = document.getElementById("game");
const introScreen = document.getElementById("intro-screen");

const cockpitScreen = document.getElementById("cockpit-screen");
const cockpitIntroModal = document.getElementById("cockpit-intro-modal");

const beginMissionButton = document.getElementById("beginMissionButton");
const missionTimer = document.getElementById("missionTimer");

const shipStatusScreen = document.getElementById("ship-status-screen");

const cockpitNav = document.querySelector(".cockpit-nav");
const cockpitMain = document.querySelector(".cockpit-main");
const subtitlePanel = document.querySelector(".subtitle-panel");

// ==========================================
// MENU NAVIGATION
// ==========================================

startButton.addEventListener("click", () => {
    gameMenu.classList.add("hidden");
    introScreen.classList.remove("hidden");
});

continueButton.addEventListener("click", () => {
    introScreen.classList.add("hidden");
    cockpitScreen.classList.remove("hidden");

    cockpitIntroModal.classList.remove("hidden");

    GameState.mission.phase = "briefing";

    console.log("Mission briefing initialized.");
});

// ==========================================
// MISSION TIMER
// ==========================================

let remainingTime = 18 * 60;
let timerInterval = null;

beginMissionButton.addEventListener("click", () => {

    if (timerInterval !== null) return;

    cockpitIntroModal.classList.add("hidden");

    const cockpitVideo = document.getElementById("cockpitVideo");

    cockpitVideo.muted = false;
    cockpitVideo.volume = 0.35;

    cockpitVideo.play().catch(error => {
        console.warn("Video playback could not start:", error);
    });

    GameState.mission.phase = "active";
    addLog("MISSION CONTROL", "INCIDENT 001: CASCADE mission started.", "normal");

    timerInterval = setInterval(() => {

       if (remainingTime <= 0) {
        missionTimer.textContent = "00:00";
        finishMission();
        return;
    }

        remainingTime--;

        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;

        missionTimer.textContent =
            String(minutes).padStart(2, "0") + ":" +
            String(seconds).padStart(2, "0");

    }, 1000);

    console.log("MISSION 001: CASCADE ACTIVE");
});

// ==========================================
// SHIP STATUS
// ==========================================

function showShipStatus() {

    console.log("OPENING SHIP STATUS");

    // Hide cockpit content, but keep the main cockpit container visible
    cockpitMain.classList.add("hidden");
    subtitlePanel.classList.add("hidden");

    // Show ship status interface
    shipStatusScreen.classList.remove("hidden");

    // Update resource values
    document.getElementById("statusPower").textContent =
        GameState.resources.power + "%";

    document.getElementById("statusOxygen").textContent =
        GameState.resources.oxygen + "%";

    document.getElementById("statusPressure").textContent =
        GameState.resources.pressure + "%";
}

// ==========================================
// RETURN TO COCKPIT
// ==========================================

function returnToCockpit() {

    shipStatusScreen.classList.add("hidden");

    cockpitMain.classList.remove("hidden");
    subtitlePanel.classList.remove("hidden");

    console.log("RETURNED TO COCKPIT");
}

// ==========================================
// EVENT LISTENERS
// ==========================================

const statusButton = document.querySelector(
    '.nav-button[data-panel="status"]'
);

if (statusButton) {
    statusButton.addEventListener("click", showShipStatus);
}

document.querySelectorAll(".close-interface").forEach(button => {
    button.addEventListener("click", returnToCockpit);
});

console.log("MAIN GAME CONTROLLER INITIALIZED");

// ==========================================
// CREW INTERFACE
// ==========================================

const crewScreen = document.getElementById("crew-screen");


function updateCrewDisplay() {

    document.querySelectorAll(".crew-card[data-crew]").forEach(card => {

        const memberKey = card.dataset.crew;
        const data = GameState.crew[memberKey];

        if (!data) return;

        card.querySelector(".crew-condition").textContent =
            data.condition.toUpperCase();

        card.querySelector(".crew-stress").textContent =
            "STRESS: " + data.stress + "%";

        card.querySelector(".crew-trust").textContent =
            "TRUST: " + data.trust + "%";

    });

}

function showCrew() {

    cockpitMain.classList.add("hidden");
    subtitlePanel.classList.add("hidden");
    crewScreen.classList.remove("hidden");

    updateCrewDisplay();

    console.log("CREW INTERFACE OPENED");

}


// OPEN CREW
const crewNavButton = document.querySelector(
    '.nav-button[data-panel="crew"]'
);

if (crewNavButton) {
    crewNavButton.addEventListener("click", showCrew);
}

// RETURN FROM CREW
document.querySelectorAll(".close-crew").forEach(button => {
    button.addEventListener("click", () => {
        crewScreen.classList.add("hidden");
        cockpitMain.classList.remove("hidden");
        subtitlePanel.classList.remove("hidden");

        console.log("RETURNED FROM CREW");
    });
});


// ==========================================
// CREW PROFILES
// ==========================================

const crewProfiles = {
    elena: {
        name: "ELENA VOSS",
        role: "COMMANDER",
        nationality: "Nationality: German",
        image: "assets/portraits/elena_voss.png",
        bio: "Commander of Lunar-01. Responsible for mission coordination, crew safety and critical decisions.",
        skills: "Leadership, flight operations, emergency response and mission planning.",
        personality: "Disciplined, observant and protective. She rarely shows fear, even under pressure.",
        stress: 20
    },

    marcus: {
        name: "MARCUS CHEN",
        role: "FLIGHT ENGINEER",
        nationality: "Nationality: Chinese-American",
        image: "assets/portraits/marcus_chen.png",
        bio: "Responsible for spacecraft engineering, electrical distribution and technical maintenance.",
        skills: "Electrical systems, spacecraft maintenance, diagnostics and troubleshooting.",
        personality: "Analytical and meticulous. He tends to overthink when systems behave unexpectedly.",
        stress: 35
    },

    amara: {
        name: "AMARA OKAFOR",
        role: "SYSTEMS SCIENTIST",
        nationality: "Nationality: Nigerian",
        image: "assets/portraits/amara_okafor.png",
        bio: "Studies spacecraft telemetry and investigates inconsistencies between sensor readings and physical systems.",
        skills: "Telemetry analysis, environmental monitoring, data interpretation and scientific research.",
        personality: "Curious, direct and highly perceptive. She questions assumptions before accepting conclusions.",
        stress: 15
    },

    daniel: {
        name: "DANIEL REYES",
        role: "MEDICAL OFFICER",
        nationality: "Nationality: Mexican-American",
        image: "assets/portraits/daniel_reyes.png",
        bio: "Responsible for crew health, medical monitoring and emergency medical response.",
        skills: "Emergency medicine, physiological monitoring, first aid and crew health.",
        personality: "Empathetic and calm. He prioritizes the crew's wellbeing during stressful situations.",
        stress: 10
    }
};

const crewProfileModal = document.getElementById("crew-profile-modal");

function openCrewProfile(memberKey) {
    const profile = crewProfiles[memberKey];
    const crewData = GameState.crew[memberKey];

    if (!profile || !crewData) return;

    document.getElementById("profileImage").src = profile.image;
    document.getElementById("profileName").textContent = profile.name;
    document.getElementById("profileRole").textContent = profile.role;
    document.getElementById("profileNationality").textContent = profile.nationality;
    document.getElementById("profileBio").textContent = profile.bio;
    document.getElementById("profileSkills").textContent = profile.skills;
    document.getElementById("profilePersonality").textContent = profile.personality;

    document.getElementById("profileStress").textContent =
        "STRESS LEVEL: " + crewData.stress + "%";

    document.getElementById("profileCondition").textContent =
        crewData.condition.toUpperCase();

    crewProfileModal.classList.remove("hidden");
}

// SELECT CREW MEMBER
document.querySelectorAll(".crew-card[data-crew]").forEach(card => {
    card.addEventListener("click", () => {
        openCrewProfile(card.dataset.crew);
    });
});

// CLOSE PROFILE
document.getElementById("closeCrewProfile").addEventListener("click", () => {
    crewProfileModal.classList.add("hidden");
});


// ==========================================
// COMMUNICATIONS SYSTEM
// ==========================================

const communicationsScreen = document.getElementById("communications-screen");

function showCommunications() {
    cockpitMain.classList.add("hidden");
    subtitlePanel.classList.add("hidden");
    communicationsScreen.classList.remove("hidden");
}

function closeCommunications() {
    communicationsScreen.classList.add("hidden");
    cockpitMain.classList.remove("hidden");
    subtitlePanel.classList.remove("hidden");
}

// OPEN COMMUNICATIONS
const communicationsNavButton = document.querySelector(
    '.nav-button[data-panel="communications"]'
);

if (communicationsNavButton) {
    communicationsNavButton.addEventListener("click", showCommunications);
}

// CLOSE COMMUNICATIONS
document.querySelectorAll(".close-communications").forEach(button => {
    button.addEventListener("click", closeCommunications);
});

// CHANNELS
document.querySelectorAll(".comm-channel").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".comm-channel").forEach(channel => {
            channel.classList.remove("active");
        });

        button.classList.add("active");

        const header = document.querySelector(".communications-header span");

        header.textContent = button.textContent;
    });
});

// MESSAGE SYSTEM
function addMessage(sender, message, type = "incoming") {
    const history = document.getElementById("messageHistory");

    const article = document.createElement("article");
    article.className = "comm-message " + type;

    const label = document.createElement("span");
    label.textContent = sender;

    const paragraph = document.createElement("p");
    paragraph.textContent = message;

    article.appendChild(label);
    article.appendChild(paragraph);

    history.appendChild(article);
    history.scrollTop = history.scrollHeight;
}

// PLAYER RESPONSES
document.querySelectorAll(".comm-response").forEach(button => {
    button.addEventListener("click", () => {

        const response = button.dataset.response;

        if (response === "readings") {
            addMessage(
                "LUNAR-01 · COMMANDER",
                "Current readings: power " + GameState.resources.power +
                "%, oxygen " + GameState.resources.oxygen +
                "%, cabin pressure " + GameState.resources.pressure + "%.",
                "outgoing"
            );
            addLog(
            "LUNAR-01 COMMANDER",
             "Commander response transmitted.",
            "normal"
            );

            addMessage(
                "GROUND CONTROL",
                "Readings received. Maintain monitoring. We are comparing your telemetry with the secondary bus data.",
                "incoming"
            );
            addLog(
            "LUNAR-01 COMMANDER",
             "Commander response transmitted.",
            "normal"
            );
        }

        if (response === "investigate") {
            addMessage(
                "LUNAR-01 · COMMANDER",
                "Requesting further investigation of the secondary electrical bus anomaly.",
                "outgoing"
            );
            addLog(
            "LUNAR-01 COMMANDER",
             "Commander response transmitted.",
            "normal"
            );

            addMessage(
                "GROUND CONTROL",
                "Understood. We recommend checking the electrical distribution panel and comparing its readings with independent system indicators.",
                "incoming"
            );
            addLog(
            "LUNAR-01 COMMANDER",
             "Commander response transmitted.",
            "normal"
            );
        }

        button.disabled = true;
    });
});

console.log("COMMUNICATIONS SYSTEM INITIALIZED");



// ==========================================
// DIAGNOSTICS SYSTEM
// ==========================================

const diagnosticsScreen = document.getElementById("diagnostics-screen");

function showDiagnostics() {
    cockpitMain.classList.add("hidden");
    subtitlePanel.classList.add("hidden");
    diagnosticsScreen.classList.remove("hidden");
}

function closeDiagnostics() {
    diagnosticsScreen.classList.add("hidden");
    cockpitMain.classList.remove("hidden");
    subtitlePanel.classList.remove("hidden");
}

const diagnosticsButton = document.querySelector(
    '.nav-button[data-panel="diagnostics"]'
);

if (diagnosticsButton) {
    diagnosticsButton.addEventListener("click", showDiagnostics);
}

document.querySelectorAll(".close-diagnostics").forEach(button => {
    button.addEventListener("click", closeDiagnostics);
});

// RUN DIAGNOSTIC ANALYSIS

const runDiagnosticButton = document.getElementById("runDiagnosticButton");

if (runDiagnosticButton) {
    runDiagnosticButton.addEventListener("click", () => {

        const message = document.getElementById("diagnosticMessage");

        if (GameState.flags.electricalSystemChecked) {
            message.textContent =
                "Analysis already completed. Secondary bus instability confirmed. Further investigation of the circuit is required.";

            return;
        }

        GameState.flags.electricalSystemChecked = true;
         addLog(
        "AUTOMATED SYSTEM",
        "Diagnostic analysis completed. Secondary electrical bus instability confirmed.",
        "warning"
        );

        message.textContent =
            "ANALYSIS COMPLETE: Primary power remains stable. Secondary electrical bus shows irregular voltage fluctuations. Environmental sensor readings are inconsistent. Physical inspection is required before isolating the affected circuit.";

        runDiagnosticButton.textContent = "ANALYSIS COMPLETED";
        runDiagnosticButton.disabled = true;

        addMessage(
            "AUTOMATED SYSTEM",
            "Diagnostic analysis completed. Secondary electrical bus instability confirmed. Physical inspection recommended.",
            "incoming"
        );

        console.log("DIAGNOSTIC ANALYSIS COMPLETED");
    });
}

console.log("DIAGNOSTICS SYSTEM INITIALIZED");



// ==========================================
// MISSION EVENT LOGS
// ==========================================

const logsScreen = document.getElementById("logs-screen");

const missionEvents = [
    {
        sender: "MISSION CONTROL",
        message: "Mission initialized. Lunar approach in progress.",
        type: "normal"
    },
    {
        sender: "AUTOMATED SYSTEM",
        message: "Secondary electrical bus fluctuation detected.",
        type: "warning"
    }
];

function addLog(sender, message, type = "normal") {
    missionEvents.push({
        sender,
        message,
        type
    });

    renderMissionLogs();
}

function renderMissionLogs() {
    const logList = document.getElementById("missionLogList");
    const counter = document.getElementById("logEntryCount");

    logList.innerHTML = "";

    missionEvents.forEach((event, index) => {
        const entry = document.createElement("article");
        entry.className = "log-entry " + event.type;

        const label = document.createElement("span");
        label.textContent =
            "EVENT " + String(index + 1).padStart(3, "0") +
            " // " + event.sender;

        const paragraph = document.createElement("p");
        paragraph.textContent = event.message;

        entry.appendChild(label);
        entry.appendChild(paragraph);
        logList.appendChild(entry);
    });

    counter.textContent = missionEvents.length + " EVENTS";
}

// OPEN LOGS
function showLogs() {
    cockpitMain.classList.add("hidden");
    subtitlePanel.classList.add("hidden");
    logsScreen.classList.remove("hidden");

    renderMissionLogs();
}

const logsButton = document.querySelector(
    '.nav-button[data-panel="logs"]'
);

if (logsButton) {
    logsButton.addEventListener("click", showLogs);
}

// CLOSE LOGS
document.querySelectorAll(".close-logs").forEach(button => {
    button.addEventListener("click", () => {
        logsScreen.classList.add("hidden");
        cockpitMain.classList.remove("hidden");
        subtitlePanel.classList.remove("hidden");
    });
});

console.log("MISSION LOGS INITIALIZED");



// ==========================================
// ALERTS INTERFACE
// ==========================================

const alertsScreen = document.getElementById("alerts-screen");
const alertsButton = document.getElementById("alertsButton");
const closeAlertsButton = document.getElementById("closeAlertsButton");
const acknowledgeAlertButton = document.getElementById("acknowledgeAlertButton");

function showAlerts() {
    cockpitMain.classList.add("hidden");
    subtitlePanel.classList.add("hidden");
    alertsScreen.classList.remove("hidden");
}

function closeAlerts() {
    alertsScreen.classList.add("hidden");
    cockpitMain.classList.remove("hidden");
    subtitlePanel.classList.remove("hidden");
}

alertsButton.addEventListener("click", showAlerts);

closeAlertsButton.addEventListener("click", closeAlerts);

acknowledgeAlertButton.addEventListener("click", () => {
    acknowledgeAlertButton.textContent = "ALERT ACKNOWLEDGED";
    acknowledgeAlertButton.disabled = true;

    addLog(
        "COMMANDER",
        "Secondary electrical bus warning acknowledged.",
        "warning"
    );

    document.getElementById("speakerName").textContent =
        "AUTOMATED SYSTEM";

    document.getElementById("subtitleText").textContent =
        "Warning acknowledged. Secondary electrical instability remains unresolved.";

    closeAlerts();
});

console.log("ALERTS INTERFACE INITIALIZED");


// ==========================================
// ELECTRICAL SYSTEM
// ==========================================

const electricalScreen = document.getElementById("electrical-screen");
const electricalButton = document.querySelector(
    '.console-button[data-system="electrical"]'
);

const closeElectricalButton = document.getElementById("closeElectricalButton");
const inspectCircuitButton = document.getElementById("inspectCircuitButton");
const isolateCircuitButton = document.getElementById("isolateCircuitButton");

function showElectrical() {
    cockpitMain.classList.add("hidden");
    subtitlePanel.classList.add("hidden");
    electricalScreen.classList.remove("hidden");
}

function closeElectrical() {
    electricalScreen.classList.add("hidden");
    cockpitMain.classList.remove("hidden");
    subtitlePanel.classList.remove("hidden");
}

electricalButton.addEventListener("click", showElectrical);
closeElectricalButton.addEventListener("click", closeElectrical);


// INSPECT CIRCUIT

inspectCircuitButton.addEventListener("click", () => {

    if (GameState.flags.electricalSystemChecked) return;

    GameState.flags.electricalSystemChecked = true;

    updateCrewStress("marcus", 5);

    document.getElementById("electricalAnalysis").textContent =
        "INSPECTION COMPLETE: Marcus identified an unstable connection " +
        "in the secondary electrical distribution circuit. The primary " +
        "bus remains stable. Controlled isolation is recommended.";

    document.getElementById("secondaryBusStatus").textContent =
        "FAULT CONFIRMED";

    document.getElementById("secondaryBusState").textContent =
        "READY FOR ISOLATION";

    inspectCircuitButton.textContent = "INSPECTION COMPLETED";
    inspectCircuitButton.disabled = true;

    document.getElementById("speakerName").textContent =
        "MARCUS CHEN";

    document.getElementById("subtitleText").textContent =
        "I've found the problem. The secondary bus has an unstable connection. " +
        "We can isolate it, but we need to do it carefully.";

    addLog(
        "MARCUS CHEN",
        "Circuit inspection completed. Secondary bus fault confirmed.",
        "warning"
    );

    addMessage(
        "MARCUS CHEN",
        "Circuit inspection complete. I found an unstable connection in the secondary bus. Controlled isolation is recommended.",
        "incoming"
    );
    showCrewDecision("electricalConflict");

    console.log("ELECTRICAL CIRCUIT INSPECTED");
});


// ISOLATE SECONDARY BUS

isolateCircuitButton.addEventListener("click", () => {

    if (GameState.flags.secondaryCircuitIsolated) return;

    GameState.flags.secondaryCircuitIsolated = true;

    if (GameState.flags.electricalSystemChecked) {

        updateResource("power", -5);
        updateCrewStress("marcus", 3);

        document.getElementById("electricalAnalysis").textContent =
            "ISOLATION SUCCESSFUL: The faulty secondary circuit has been " +
            "disconnected. Power distribution is now stable, although " +
            "available energy reserves have decreased slightly.";

        document.getElementById("secondaryBusStatus").textContent =
            "ISOLATED";

        document.getElementById("secondaryBusState").textContent =
            "FAULT CONTAINED";

        document.getElementById("speakerName").textContent =
            "AUTOMATED SYSTEM";

        document.getElementById("subtitleText").textContent =
            "Secondary bus successfully isolated. Power reserves reduced. " +
            "Primary distribution remains operational.";

        addLog(
            "AUTOMATED SYSTEM",
            "Controlled isolation successful. Secondary electrical fault contained.",
            "normal"
        );

    } else {

        updateResource("power", -15);
        updateCrewStress("marcus", 12);
        updateCrewStress("elena", 8);

        document.getElementById("electricalAnalysis").textContent =
            "WARNING: The secondary bus was isolated without prior inspection. " +
            "A power surge occurred during disconnection. The fault is contained, " +
            "but energy reserves have decreased significantly.";

        document.getElementById("secondaryBusStatus").textContent =
            "EMERGENCY ISOLATION";

        document.getElementById("secondaryBusState").textContent =
            "POWER LOSS DETECTED";

        document.getElementById("speakerName").textContent =
            "AUTOMATED SYSTEM";

        document.getElementById("subtitleText").textContent =
            "Warning. Unexpected power loss detected during isolation. " +
            "Secondary bus disconnected. Crew stress levels increased.";

        addLog(
            "AUTOMATED SYSTEM",
            "Premature electrical isolation caused an unexpected power loss.",
            "warning"
        );
    }

    inspectCircuitButton.disabled = true;
    isolateCircuitButton.disabled = true;

    isolateCircuitButton.textContent = "BUS ISOLATED";

    // Update cockpit resource display
    document.getElementById("energyValue").textContent =
        GameState.resources.power + "%";

    document.getElementById("statusPower").textContent =
        GameState.resources.power + "%";

    addMessage(
        "AUTOMATED SYSTEM",
        document.getElementById("subtitleText").textContent,
        "incoming"
    );

    console.log("SECONDARY ELECTRICAL BUS ISOLATED");
});

console.log("ELECTRICAL SYSTEM INITIALIZED");


// LIFE SUPPORT SYSTEM

const lifeSupportScreen = document.getElementById("life-support-screen");
const lifeSupportButton = document.querySelector('.console-button[data-system="life-support"]');
const closeLifeSupportButton = document.getElementById("closeLifeSupportButton");

const verifySensorsButton = document.getElementById("verifySensorsButton");
const adjustEnvironmentButton = document.getElementById("adjustEnvironmentButton");

function showLifeSupport() {
    cockpitMain.classList.add("hidden");
    subtitlePanel.classList.add("hidden");
    lifeSupportScreen.classList.remove("hidden");
}

function closeLifeSupport() {
    lifeSupportScreen.classList.add("hidden");
    cockpitMain.classList.remove("hidden");
    subtitlePanel.classList.remove("hidden");
}

lifeSupportButton.addEventListener("click", showLifeSupport);
closeLifeSupportButton.addEventListener("click", closeLifeSupport);


// VERIFY ENVIRONMENTAL SENSORS

verifySensorsButton.addEventListener("click", () => {

    if (GameState.flags.environmentalReadingsChecked) return;

    GameState.flags.environmentalReadingsChecked = true;

    updateCrewStress("amara", 3);

    document.getElementById("lifeSupportAnalysis").textContent =
        "VERIFICATION COMPLETE: Redundant sensors confirm that oxygen concentration, cabin pressure and temperature remain within operational limits. The discrepancy originates in the secondary electrical distribution system.";

    document.getElementById("lifeSupportFeedback").textContent =
        "Environmental conditions verified. No manual adjustment required.";

    verifySensorsButton.textContent = "VERIFICATION COMPLETED";
    verifySensorsButton.disabled = true;

    document.getElementById("speakerName").textContent = "AMARA OKAFOR";
    document.getElementById("subtitleText").textContent =
        "The environmental readings are stable. The sensors disagree because of the electrical anomaly. Don't adjust life support based on faulty telemetry.";

    addLog(
        "AMARA OKAFOR",
        "Redundant environmental readings verified. No environmental malfunction detected.",
        "normal"
    );

    addMessage(
        "AMARA OKAFOR",
        "The environmental readings are stable. The discrepancy comes from the electrical anomaly. Don't adjust life support based on faulty telemetry.",
        "incoming"
    );

    console.log("ENVIRONMENTAL SENSORS VERIFIED");
});


// MANUAL ENVIRONMENTAL ADJUSTMENT

adjustEnvironmentButton.addEventListener("click", () => {

    if (GameState.flags.environmentalReadingsChecked) return;

    if (GameState.flags.secondaryCircuitIsolated) {
        document.getElementById("lifeSupportAnalysis").textContent =
            "ADJUSTMENT CANCELLED: Environmental systems are stable. Sensor verification is required before any manual intervention.";

        document.getElementById("lifeSupportFeedback").textContent =
            "No changes applied.";

        adjustEnvironmentButton.disabled = true;
        adjustEnvironmentButton.textContent = "ADJUSTMENT CANCELLED";

        addLog(
            "AUTOMATED SYSTEM",
            "Unnecessary environmental adjustment prevented.",
            "normal"
        );

        return;
    }

    updateResource("power", -8);
    updateCrewStress("amara", 10);
    updateCrewStress("elena", 5);

    document.getElementById("lifeSupportAnalysis").textContent =
        "WARNING: Manual adjustment initiated using inconsistent sensor data. The environmental control system consumed additional power without improving cabin conditions.";

    document.getElementById("lifeSupportFeedback").textContent =
        "Adjustment unsuccessful. Environmental readings remain unchanged.";

    document.getElementById("speakerName").textContent = "AUTOMATED SYSTEM";
    document.getElementById("subtitleText").textContent =
        "Warning. Manual adjustment produced no measurable improvement. Additional power consumption detected.";

    adjustEnvironmentButton.disabled = true;
    adjustEnvironmentButton.textContent = "ADJUSTMENT FAILED";

    document.getElementById("energyValue").textContent =
        GameState.resources.power + "%";

    document.getElementById("statusPower").textContent =
        GameState.resources.power + "%";

    addLog(
        "AUTOMATED SYSTEM",
        "Manual environmental adjustment consumed additional power. No improvement detected.",
        "warning"
    );

    addMessage(
        "AUTOMATED SYSTEM",
        "Manual adjustment unsuccessful. Additional power consumption detected.",
        "incoming"
    );

    console.log("MANUAL ENVIRONMENTAL ADJUSTMENT FAILED");
});

console.log("LIFE SUPPORT SYSTEM INITIALIZED");


// CREW REACTIONS & TRUST DECISIONS

const crewDecisionModal = document.getElementById("crew-decision-modal");
const crewDialogueContainer = document.getElementById("crewDialogueContainer");
const crewDecisionTitle = document.getElementById("crewDecisionTitle");
const crewEventNumber = document.getElementById("crewEventNumber");

const crewChoiceA = document.getElementById("crewChoiceA");
const crewChoiceB = document.getElementById("crewChoiceB");

let currentCrewEvent = null;


// CREW EVENT: ELECTRICAL ANOMALY

const crewEvents = {

    electricalConflict: {
        number: "EVENT 001",
        title: "A DIFFERENCE OF OPINION",

        dialogue: [
            {
                name: "MARCUS CHEN",
                role: "FLIGHT ENGINEER",
                text: "I've inspected the circuit. We need to isolate the secondary bus before this gets worse."
            },
            {
                name: "AMARA OKAFOR",
                role: "SYSTEMS SCIENTIST",
                text: "We still need to understand the sensor discrepancies. Isolating the circuit too early could cost us valuable power."
            }
        ],

        choices: [
            {
                text: "01 — TRUST MARCUS",
                description: "Prioritize electrical containment.",

                effects: {
                    marcus: { trust: 12, stress: -5 },
                    amara: { trust: -8, stress: 4 }
                },
                resourceEffects: {
                power: 2
                },

                response: "Understood, Commander. I'll prepare the isolation sequence."
            },
            {
                text: "02 — TRUST AMARA",
                description: "Prioritize further system verification.",

                effects: {
                    amara: { trust: 12, stress: -5 },
                    marcus: { trust: -8, stress: 5 }
                },
                resourceEffects: {
                power: -3
                },

                response: "I appreciate that. We need to understand what we're dealing with first."
            }
        ]
    }
};


// OPEN CREW EVENT

function showCrewDecision(eventId) {

    const event = crewEvents[eventId];

    if (!event) return;

    currentCrewEvent = event;

    crewEventNumber.textContent = event.number;
    crewDecisionTitle.textContent = event.title;

    crewDialogueContainer.innerHTML = event.dialogue.map(character => `
        <article class="system-card">
            <strong>${character.name}</strong>
            <span class="system-state">${character.role}</span>
            <p>"${character.text}"</p>
        </article>
    `).join("");

    crewChoiceA.textContent =
        event.choices[0].text + " — " + event.choices[0].description;

    crewChoiceB.textContent =
        event.choices[1].text + " — " + event.choices[1].description;

    crewDecisionModal.classList.remove("hidden");
}


// APPLY PLAYER CHOICE

function applyCrewChoice(choiceIndex) {

    if (!currentCrewEvent) return;

    const choice = currentCrewEvent.choices[choiceIndex];

    Object.entries(choice.effects).forEach(([member, effects]) => {

        
if (effects.trust) {

    const previousTrust = GameState.crew[member].trust;

    GameState.crew[member].trust = Math.max(
        0,
        Math.min(100, previousTrust + effects.trust)
    );

    const trustChange =
        GameState.crew[member].trust - previousTrust;

    const memberName = GameState.crew[member].name;

    if (trustChange > 0) {
        addLog(
            "CREW RELATIONS",
            memberName + " gained " + trustChange +
            "% trust in the commander. Current trust: " +
            GameState.crew[member].trust + "%.",
            "normal"
        );
    }

    if (trustChange < 0) {
        addLog(
            "CREW RELATIONS",
            memberName + " lost " + Math.abs(trustChange) +
            "% trust in the commander. Current trust: " +
            GameState.crew[member].trust + "%.",
            "warning"
        );
    }
}

        if (effects.stress) {
            updateCrewStress(member, effects.stress);
        }

    });
    // Apply resource consequences
    if (choice.resourceEffects) {
        Object.entries(choice.resourceEffects).forEach(([resource, amount]) => {
            updateResource(resource, amount);
        });
    }

    // Record the decision
    recordDecision(choice.text);

    // Refresh resource displays
    document.getElementById("energyValue").textContent =
        GameState.resources.power + "%";

    document.getElementById("statusPower").textContent =
        GameState.resources.power + "%";
    updateCrewDisplay();

    addLog(
        "COMMANDER",
        "Crew decision: " + choice.text,
        "normal"
    );

    addLog(
        "CREW",
        choice.response,
        "normal"
    );

    document.getElementById("speakerName").textContent =
        choiceIndex === 0 ? "MARCUS CHEN" : "AMARA OKAFOR";

    document.getElementById("subtitleText").textContent =
        choice.response;

    crewDecisionModal.classList.add("hidden");

    currentCrewEvent = null;

    console.log("CREW DECISION APPLIED");
}


// CHOICE BUTTONS

crewChoiceA.addEventListener("click", () => {
    applyCrewChoice(0);
});

crewChoiceB.addEventListener("click", () => {
    applyCrewChoice(1);
});

console.log("CREW DECISION SYSTEM INITIALIZED");


// ==========================================
// MISSION ENDINGS SYSTEM
// ==========================================

const endingScreen = document.getElementById("ending-screen");
const endingRestartButton = document.getElementById("endingRestartButton");

let missionEnded = false;

function evaluateMissionOutcome() {

    const power = GameState.resources.power;
    const oxygen = GameState.resources.oxygen;
    const pressure = GameState.resources.pressure;

    const repaired = GameState.flags.secondaryCircuitRepaired;

    // Critical system failure
    if (power <= 5 || oxygen <= 10 || pressure <= 30) {
        return "lost";
    }

    // Successful mission
    if (
        repaired &&
        power >= 30 &&
        oxygen >= 30 &&
        pressure >= 50
    ) {
        return "success";
    }

    // Partial recovery or unresolved mission
    return "compromised";
}

function finishMission(forcedOutcome = null) {

    if (missionEnded) return;

    missionEnded = true;

    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    const outcome = forcedOutcome || evaluateMissionOutcome();

    const endings = {

        success: {
            title: "SUCCESSFUL MISSION",
            subtitle: "MISSION OBJECTIVE ACHIEVED",
            description:
                "The damaged electrical connection was successfully replaced. " +
                "Secondary power distribution has been restored. " +
                "Lunar-01 remains operational and the crew has stabilized the situation.",
            lastMessage:
                "\"Mission Control, this is Lunar-01. Systems are stable. " +
                "We are still here.\""
        },

        compromised: {
            title: "MISSION COMPROMISED",
            subtitle: "PARTIAL SYSTEM RECOVERY",
            description:
                "The mission could not be completed under optimal conditions. " +
                "Some systems remain operational, but the spacecraft has suffered " +
                "significant losses. The crew must prepare for an uncertain outcome.",
            lastMessage:
                "\"We did everything we could. Lunar-01 is still responding, " +
                "but we are running out of options.\""
        },

        lost: {
            title: "SIGNAL LOST",
            subtitle: "CRITICAL MISSION FAILURE",
            description:
                "Critical spacecraft resources have fallen below safe operational " +
                "limits. Communication and system stability have been compromised. " +
                "Lunar-01 can no longer guarantee crew survival.",
            lastMessage:
                "\"...Lunar-01, do you copy? ...Lunar-01?\""
        }
    };

    const result = endings[outcome];

    GameState.mission.status = outcome;
    GameState.mission.phase = "ended";

    endingScreen.classList.remove("hidden", "success", "compromised", "lost");
    endingScreen.classList.add(outcome);

    document.getElementById("endingTitle").textContent = result.title;
    document.getElementById("endingSubtitle").textContent = result.subtitle;
    document.getElementById("endingDescription").textContent = result.description;
    document.getElementById("endingLastMessage").textContent = result.lastMessage;

    document.getElementById("endingPower").textContent =
        GameState.resources.power + "%";

    document.getElementById("endingOxygen").textContent =
        GameState.resources.oxygen + "%";

    const crewMembers = Object.values(GameState.crew);

    const stableCrew = crewMembers.filter(
        member => member.condition === "stable"
    ).length;

    document.getElementById("endingCrew").textContent =
        stableCrew + " / " + crewMembers.length + " STABLE";

    addLog(
        "MISSION CONTROL",
        "Mission ended. Final outcome: " + result.title,
        outcome === "success" ? "normal" : "warning"
    );

    console.log("MISSION ENDED:", result.title);
}

// End mission when critical resources reach dangerous levels
function checkCriticalMissionState() {

    if (missionEnded) return;

    if (
        GameState.resources.power <= 5 ||
        GameState.resources.oxygen <= 10 ||
        GameState.resources.pressure <= 30
    ) {
        finishMission("lost");
    }
}

// Restart
endingRestartButton.addEventListener("click", () => {
    window.location.reload();
});

console.log("MISSION ENDINGS SYSTEM INITIALIZED");// ==========================================

// ==========================================
// CREDITS NAVIGATION
// ==========================================

const creditsScreen = document.getElementById("credits-screen");
const creditsButton = document.getElementById("creditsButton");
const backFromCreditsButton = document.getElementById("backFromCreditsButton");

creditsButton.addEventListener("click", () => {

    document.getElementById("game").classList.add("hidden");
    creditsScreen.classList.remove("hidden");

});

backFromCreditsButton.addEventListener("click", () => {

    creditsScreen.classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");

});

console.log("CREDITS SCREEN INITIALIZED");