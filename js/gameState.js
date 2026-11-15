const GameState = {
    mission: {
        id: "001",
        name: "CASCADE",
        phase: "intro",
        status: "active"
    },

    resources: {
        power: 87,
        oxygen: 96,
        pressure: 100
    },

    crew: {
        elena: {
            name: "Elena Voss",
            role: "Commander",
            condition: "stable",
            stress: 20
        },

        marcus: {
            name: "Marcus Chen",
            role: "Flight Engineer",
            condition: "stable",
            stress: 35
        },

        amara: {
            name: "Amara Okafor",
            role: "Systems Scientist",
            condition: "stable",
            stress: 15
        },

        daniel: {
            name: "Daniel Reyes",
            role: "Medical Officer",
            condition: "stable",
            stress: 10
        }
    },

    decisions: [],

    flags: {
        electricalSystemChecked: false,
        environmentalReadingsChecked: false,
        secondaryCircuitIsolated: false
    }
};

function updateResource(resource, amount) {
    if (!(resource in GameState.resources)) {
        console.error("Unknown resource:", resource);
        return;
    }

    GameState.resources[resource] = Math.max(
        0,
        Math.min(100, GameState.resources[resource] + amount)
    );
}

function recordDecision(decision) {
    GameState.decisions.push({
        id: decision,
        timestamp: Date.now()
    });
}

function updateCrewStress(member, amount) {
    const astronaut = GameState.crew[member];

    if (!astronaut) return;

    astronaut.stress = Math.max(
        0,
        Math.min(100, astronaut.stress + amount)
    );
}

console.log("NO SIGNAL // Game state initialized");
