const {buildResumeAnalysisPrompt} = require("./prompt");
const {generateCompletion} = require("./groq");
const {validateResponse} = require("./validator");

const analyzeResume = async ({resumeText,jobDescription,jobTitle,requiredSkills,requiredExperience,seniority}) => {

    const prompt = buildResumeAnalysisPrompt({resumeText,jobDescription,jobTitle,requiredSkills,requiredExperience,seniority});

    const response = await generateCompletion(prompt);

    const result = validateResponse(response);

    return result;
}

module.exports = {
    analyzeResume
}