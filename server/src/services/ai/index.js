const { buildResumeAnalysisPrompt } = require("./prompt");
const { generateCompletion } = require("./groq");
const { validateResponse } = require("./validator");

const analyzeResume = async ({ resumeText, jobDescription, jobTitle, requiredSkills, requiredExperience, seniority }) => {
    const prompt = buildResumeAnalysisPrompt({ resumeText, jobDescription, jobTitle, requiredSkills, requiredExperience, seniority });

    const response = await generateCompletion(prompt);

    let result = validateResponse(response);

    // If analysis was completely missing from the model's response, retry once with an explicit prompt
    if (result.analysisWasDefaulted) {
        console.warn("AI returned response with missing analysis section. Retrying once with explicit analysis prompt...");
        const retryPrompt = `${prompt}\n\nCRITICAL REQUIREMENT: You MUST generate BOTH top-level keys: "candidate" AND "analysis". Under "analysis", you MUST include detailed numerical scores (skillsScore, experienceScore, projectsScore, educationScore, resumeScore), scoreReasons, summary, strengths, weaknesses, and missingSkills. Do not omit the analysis object under any circumstance.`;
        try {
            const retryResponse = await generateCompletion(retryPrompt);
            const retryResult = validateResponse(retryResponse);
            if (!retryResult.analysisWasDefaulted) {
                result = retryResult;
            }
        } catch (retryErr) {
            console.error("Retry prompt failed, keeping best-effort parsed result:", retryErr.message);
        }
    }

    return result;
};

module.exports = {
    analyzeResume
};