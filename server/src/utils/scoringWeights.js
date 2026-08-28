const SCORING_WEIGHTS = {
    Intern: {
        skills: 0.45,
        experience: 0.10,
        projects: 0.30,
        education: 0.10,
        resume: 0.05
    },

    Junior: {
        skills: 0.40,
        experience: 0.20,
        projects: 0.25,
        education: 0.10,
        resume: 0.05
    },

    "Mid-Level": {
        skills: 0.35,
        experience: 0.35,
        projects: 0.15,
        education: 0.10,
        resume: 0.05
    },

    Senior: {
        skills: 0.30,
        experience: 0.45,
        projects: 0.10,
        education: 0.10,
        resume: 0.05
    },

    Staff: {
        skills: 0.25,
        experience: 0.50,
        projects: 0.10,
        education: 0.10,
        resume: 0.05
    },

    Principal: {
        skills: 0.20,
        experience: 0.55,
        projects: 0.10,
        education: 0.10,
        resume: 0.05
    }
};

const getScoringWeights = (seniority) => {
    return SCORING_WEIGHTS[seniority] ?? SCORING_WEIGHTS["Mid-Level"];
};

module.exports = {
    getScoringWeights
};