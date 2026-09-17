const { z } = require("zod");
const ApiError = require("../../utils/ApiError");

// Safe array of strings preprocessor
const stringArraySchema = z.preprocess((val) => {
    if (Array.isArray(val)) return val.map(String);
    if (typeof val === "string" && val.trim()) return [val.trim()];
    return [];
}, z.array(z.string()).default([]));

// Safe score preprocessor (0-10 integer)
const scoreSchema = z.preprocess((val) => {
    const num = Number(val);
    if (isNaN(num)) return 5;
    return Math.max(0, Math.min(10, Math.round(num)));
}, z.number().int().min(0).max(10).default(5));

const resumeAnalysisSchema = z.object({
    candidate: z.object({
        name: z.string().nullable().optional().default(null),
        email: z.string().nullable().optional().default(null),
        phone: z.string().nullable().optional().default(null),
        skills: stringArraySchema,
        education: stringArraySchema,
        experience: stringArraySchema
    }).default({}),
    analysis: z.object({
        skillsScore: scoreSchema,
        experienceScore: scoreSchema,
        educationScore: scoreSchema,
        resumeScore: scoreSchema,
        projectsScore: scoreSchema,
        summary: z.preprocess(
            (val) => (typeof val === "string" && val.trim() ? val : "Candidate evaluation completed."),
            z.string().default("Candidate evaluation completed.")
        ),
        strengths: stringArraySchema,
        weaknesses: stringArraySchema,
        missingSkills: stringArraySchema
    }).default({})
});

const validateResponse = (response) => {
    try {
        let cleanResponse = response;
        if (typeof cleanResponse === "string") {
            cleanResponse = cleanResponse.trim();
            // Strip markdown code blocks if model returned ```json ... ```
            if (cleanResponse.startsWith("```")) {
                cleanResponse = cleanResponse.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
            }
        }

        let parsed = typeof cleanResponse === "string" ? JSON.parse(cleanResponse) : cleanResponse;

        // Unwrap outer wrapper if LLM returned { data: ... }, { result: ... }, or { response: ... }
        if (parsed && typeof parsed === "object") {
            if (parsed.data && typeof parsed.data === "object" && (parsed.data.analysis || parsed.data.candidate)) {
                parsed = parsed.data;
            } else if (parsed.result && typeof parsed.result === "object" && (parsed.result.analysis || parsed.result.candidate)) {
                parsed = parsed.result;
            } else if (parsed.response && typeof parsed.response === "object" && (parsed.response.analysis || parsed.response.candidate)) {
                parsed = parsed.response;
            }
        }

        if (!parsed || typeof parsed !== "object") {
            parsed = {};
        }

        // If analysis is under an alternate key
        if (!parsed.analysis || typeof parsed.analysis !== "object") {
            parsed.analysis = 
                parsed.evaluation || 
                parsed.assessment || 
                parsed.scores || 
                parsed.candidateAnalysis || 
                parsed.candidate_analysis || 
                parsed.review || 
                parsed.analysis_result || 
                null;
        }

        // If analysis fields were flattened at the root level
        if (!parsed.analysis && (parsed.skillsScore !== undefined || parsed.summary !== undefined || parsed.strengths !== undefined)) {
            parsed.analysis = {
                skillsScore: parsed.skillsScore,
                experienceScore: parsed.experienceScore,
                educationScore: parsed.educationScore,
                resumeScore: parsed.resumeScore,
                projectsScore: parsed.projectsScore,
                summary: parsed.summary,
                strengths: parsed.strengths,
                weaknesses: parsed.weaknesses,
                missingSkills: parsed.missingSkills
            };
        }

        if (!parsed.candidate || typeof parsed.candidate !== "object") {
            parsed.candidate = {};
        }

        if (!parsed.analysis || typeof parsed.analysis !== "object") {
            parsed.analysis = {};
        }

        return resumeAnalysisSchema.parse(parsed);
    } catch (error) {
        console.error("AI Response Validation Error:", error);
        console.error("Raw AI Response Content:", response);
        throw new ApiError(500, "Failed to validate AI response");
    }
};

module.exports = {
    validateResponse
};