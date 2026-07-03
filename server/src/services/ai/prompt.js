
const buildResumeAnalysisPrompt = ({resumeText,jobDescription,jobTitle,requiredSkills}) => {

    const prompt = `
            You are an experienced technical recruiter.

            Your task is to evaluate a candidate's resume against a job posting.

            Analyze the resume carefully and return ONLY a valid JSON object.

            Rules:
            - Do NOT include markdown.
            - Do NOT wrap the JSON inside \`\`\`.
            - Do NOT explain your reasoning.
            - Return ONLY valid JSON.
            - If any information cannot be determined, use null for strings and [] for arrays.
            - The score must be between 0 and 10.

            Job Title:
            ${jobTitle}

            Job Description:
            ${jobDescription}

            Required Skills:
            ${(Array.isArray(requiredSkills) ? requiredSkills : []).join(", ")}

            Resume:
            ${resumeText}

            Return the following JSON structure exactly:

            {
            "candidate": {
                "name": "string | null",
                "email": "string | null",
                "phone": "string | null",
                "skills": ["string"],
                "education": ["string"],
                "experience": ["string"]
            },
            "analysis": {
                "score": 0,
                "recommendation": "Strong Match | Good Match | Average Match | Poor Match",
                "summary": "string",
                "strengths": ["string"],
                "weaknesses": ["string"],
                "missingSkills": ["string"]
            }
        }
    `

    return prompt;

}

module.exports = {
    buildResumeAnalysisPrompt
}