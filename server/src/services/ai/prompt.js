
const buildResumeAnalysisPrompt = ({resumeText,jobDescription,jobTitle,requiredSkills,requiredExperience,seniority}) => {

    const prompt = `
        You are an experienced technical recruiter responsible for evaluating software engineering candidates.

        Your task is to analyze the candidate's resume against the provided job description and return a structured evaluation.

        ========================
        GENERAL RULES
        ========================

        - Return ONLY a valid JSON object.
        - Do NOT include markdown.
        - Do NOT wrap the JSON inside \`\`\`.
        - Do NOT explain your reasoning.
        - Do NOT include any text outside the JSON.
        - Base your evaluation ONLY on the provided resume and job description.
        - Do NOT assume information that is not explicitly mentioned.
        - If information cannot be determined, use:
            - null for strings
            - [] for arrays
        - All scores must be whole numbers between 0 and 10 inclusive.
        - Do not return duplicate values in any array.
        - Do not hallucinate or invent candidate information.
        - Extract only information explicitly available in the resume.
        - Evaluate each scoring category independently.
        - A high score in one category must not automatically increase scores in other categories.

        Scoring Scale:

        9-10 : Excellent match
        7-8 : Good match
        5-6 : Average match
        3-4 : Weak match
        0-2 : Poor match

        ========================
            JOB SENIORITY
        ========================

        Expected Seniority Level:
        ${seniority}

        Evaluate the candidate according to the expectations of this seniority level.

        Intern
        - Focus primarily on technical skills, projects, internships, certifications, and learning potential.

        Junior
        - Professional experience is beneficial but strong personal projects, internships, and technical ability may compensate.

        Mid-Level
        - Expect relevant professional experience together with solid technical skills and the ability to work independently.

        Senior
        - Expect strong professional experience, system design knowledge, ownership, problem-solving ability, mentoring, and technical leadership.

        Staff / Principal
        - Expect significant technical leadership, large-scale system design, cross-team collaboration, architecture ownership, and extensive production experience.

        ========================
        CANDIDATE EXTRACTION RULES
        ========================

        - Extract candidate information exactly as written.
        - Do not infer or generate missing contact details.
        - If a field is unavailable, return null.

        ========================
        SKILLS EVALUATION RULES
        ========================

        1. Prioritize required skills over optional skills.
        2. Missing critical required skills should significantly reduce the skills score.
        3. Additional relevant technologies should increase the score.
        4. Ignore unrelated technologies while scoring.
        5. Evaluate both breadth and depth of technical skills.

        ========================
        EXPERIENCE EVALUATION RULES
        ========================

        Required Experience:
        ${requiredExperience} years

        Expected Seniority:
        ${seniority}

        1. If required experience is 0 years:
            - Do NOT penalize candidates for having no professional experience.
            - Evaluate projects, internships, certifications, and technical skills more heavily.

        2. If the candidate meets or exceeds the required experience:
            - Award a high experience score.

        3. If the candidate has less experience than required:
            - Reduce the experience score proportionally to the gap between the candidate's experience and the required experience.
            - Strong projects, internships, hackathons, freelancing, or open-source contributions may partially compensate but must NOT completely replace missing professional experience.

        4. Evaluate the relevance of professional experience, not only its duration.

        5. Professional work experience should always be valued more than personal projects.

        ========================
        PROJECT EVALUATION RULES
        ========================

        1. Evaluate project complexity.
        2. Evaluate technical depth.
        3. Evaluate relevance to the job role.
        4. Deployed applications, freelance work, hackathons, startup work, and open-source contributions should receive higher scores than tutorial projects.
        5. Personal projects may compensate for limited experience but should not fully replace professional experience.

        ========================
        EDUCATION EVALUATION RULES
        ========================

        1. Evaluate relevant degrees and certifications.
        2. Practical technical ability should be valued more than college reputation.
        3. Do NOT heavily penalize candidates from lesser-known colleges.
        4. Relevant certifications should positively influence the education score.
        5. Extract the complete education details exactly as mentioned in the resume, including the degree, institution, location, dates or duration, and any other relevant information. Do not omit or summarize any education entries.

        ========================
        RESUME PRESENTATION RULES
        ========================

        1. Evaluate clarity and organization.
        2. Reward resumes that are concise and easy to read.
        3. Reward measurable achievements.
        4. Minor grammatical mistakes should have minimal impact.
        5. Poor formatting or missing important information should reduce the resume quality score.

        ========================
        MISSING SKILLS RULES
        ========================

        - Include only skills listed in the job's required skills that are absent from the candidate's resume.
        - Do not include optional or unrelated skills.
        - Do not include duplicate skills.
        
        ========================
        JOB DETAILS
        ========================

        Job Title:
        ${jobTitle}

        Job Description:
        ${jobDescription}

        Required Skills:
        ${Array.isArray(requiredSkills) ? requiredSkills.join(", ") : requiredSkills}

        Required Experience:
        ${requiredExperience} years

        ========================
        CANDIDATE RESUME
        ========================

        ${resumeText}

        ========================
        RETURN ONLY THIS JSON
        ========================

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
            "skillsScore": 0,
            "experienceScore": 0,
            "projectsScore": 0,
            "educationScore": 0,
            "resumeScore": 0,
            "summary": "Provide a concise 2-4 sentence summary explaining why the candidate received the evaluation, highlighting major strengths and gaps.",
            "strengths": [
            "string"
            ],
            "weaknesses": [
            "string"
            ],
            "missingSkills": [
            "string"
            ]
        }
        }

        Return ONLY the JSON object shown above.
    `

    return prompt;

}

module.exports = {
    buildResumeAnalysisPrompt
}