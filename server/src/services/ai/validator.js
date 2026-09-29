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

// Safe project item schema
const projectItemSchema = z.object({
    name: z.preprocess(
        (val) => (typeof val === "string" && val.trim() ? val.trim() : "Project"),
        z.string().default("Project")
    ),
    techStack: stringArraySchema,
    summary: z.preprocess(
        (val) => (typeof val === "string" && val.trim() ? val.trim() : ""),
        z.string().default("")
    ),
    link: z.preprocess(
        (val) => (typeof val === "string" && val.trim() ? val.trim() : null),
        z.string().nullable().optional().default(null)
    )
});

// Safe projects array schema
const projectsArraySchema = z.preprocess((val) => {
    if (Array.isArray(val)) {
        return val.filter(item => item && typeof item === "object");
    }
    return [];
}, z.array(projectItemSchema).default([]));

// Safe score reasons schema
const reasonStringSchema = z.preprocess(
    (val) => (typeof val === "string" && val.trim() ? val.trim() : ""),
    z.string().default("")
);

const scoreReasonsSchema = z.object({
    skills: reasonStringSchema,
    experience: reasonStringSchema,
    projects: reasonStringSchema,
    education: reasonStringSchema,
    resume: reasonStringSchema
}).default({});

const resumeAnalysisSchema = z.object({
    candidate: z.object({
        name: z.string().nullable().optional().default(null),
        email: z.string().nullable().optional().default(null),
        phone: z.string().nullable().optional().default(null),
        skills: stringArraySchema,
        education: stringArraySchema,
        experience: stringArraySchema,
        projects: projectsArraySchema
    }).default({}),
    analysis: z.object({
        skillsScore: scoreSchema,
        experienceScore: scoreSchema,
        educationScore: scoreSchema,
        resumeScore: scoreSchema,
        projectsScore: scoreSchema,
        scoreReasons: scoreReasonsSchema,
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
            // Extract JSON from markdown code block if wrapped (with or without preamble)
            const codeBlockMatch = cleanResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
            if (codeBlockMatch) {
                cleanResponse = codeBlockMatch[1].trim();
            } else if (cleanResponse.startsWith("```")) {
                cleanResponse = cleanResponse.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
            } else {
                const firstBrace = cleanResponse.indexOf("{");
                const lastBrace = cleanResponse.lastIndexOf("}");
                if (firstBrace !== -1 && lastBrace > firstBrace) {
                    cleanResponse = cleanResponse.slice(firstBrace, lastBrace + 1);
                }
            }
        }

        let parsed = typeof cleanResponse === "string" ? JSON.parse(cleanResponse) : cleanResponse;

        // Unwrap outer wrapper if LLM returned { data: ... }, { result: ... }, or { response: ... }
        if (parsed && typeof parsed === "object") {
            const possibleWrappers = ["data", "result", "response", "output", "payload"];
            for (const wrapperKey of possibleWrappers) {
                const inner = parsed[wrapperKey];
                if (inner && typeof inner === "object" && (inner.analysis || inner.Analysis || inner.candidate || inner.Candidate)) {
                    parsed = inner;
                    break;
                }
            }
        }

        if (!parsed || typeof parsed !== "object") {
            parsed = {};
        }

        // Resolve candidate object
        if (!parsed.candidate || typeof parsed.candidate !== "object") {
            parsed.candidate = 
                parsed.Candidate || 
                parsed.candidateProfile || 
                parsed.candidate_profile || 
                parsed.applicant || 
                parsed.profile || 
                {};
        }
        if (typeof parsed.candidate !== "object" || parsed.candidate === null) {
            parsed.candidate = {};
        }

        // If candidate contains nested analysis/evaluation
        if (!parsed.analysis && parsed.candidate && typeof parsed.candidate === "object") {
            if (parsed.candidate.analysis && typeof parsed.candidate.analysis === "object") {
                parsed.analysis = parsed.candidate.analysis;
                delete parsed.candidate.analysis;
            } else if (parsed.candidate.evaluation && typeof parsed.candidate.evaluation === "object") {
                parsed.analysis = parsed.candidate.evaluation;
                delete parsed.candidate.evaluation;
            } else if (parsed.candidate.scores && typeof parsed.candidate.scores === "object") {
                parsed.analysis = parsed.candidate.scores;
                delete parsed.candidate.scores;
            }
        }

        // If analysis is under an alternate key
        if (!parsed.analysis || typeof parsed.analysis !== "object") {
            parsed.analysis = 
                parsed.Analysis || 
                parsed.evaluation || 
                parsed.Evaluation || 
                parsed.assessment || 
                parsed.Assessment || 
                parsed.scores || 
                parsed.Scores || 
                parsed.scoring || 
                parsed.Scoring || 
                parsed.candidateAnalysis || 
                parsed.candidate_analysis || 
                parsed.CandidateAnalysis || 
                parsed.review || 
                parsed.Review || 
                parsed.analysis_result || 
                parsed.analysisResult || 
                parsed.ratings || 
                parsed.Ratings || 
                parsed.jobFit || 
                parsed.fitAnalysis || 
                null;
        }

        // If analysis was returned as stringified JSON
        if (typeof parsed.analysis === "string") {
            try {
                const parsedInner = JSON.parse(parsed.analysis);
                if (parsedInner && typeof parsedInner === "object") {
                    parsed.analysis = parsedInner;
                }
            } catch (_) {}
        }

        // If analysis fields were flattened at the root level
        if (!parsed.analysis || typeof parsed.analysis !== "object") {
            const hasFlattenedScores = 
                parsed.skillsScore !== undefined || 
                parsed.skills_score !== undefined || 
                parsed.summary !== undefined || 
                parsed.strengths !== undefined;
            if (hasFlattenedScores) {
                parsed.analysis = {
                    skillsScore: parsed.skillsScore ?? parsed.skills_score,
                    experienceScore: parsed.experienceScore ?? parsed.experience_score,
                    educationScore: parsed.educationScore ?? parsed.education_score,
                    resumeScore: parsed.resumeScore ?? parsed.resume_score,
                    projectsScore: parsed.projectsScore ?? parsed.projects_score,
                    scoreReasons: parsed.scoreReasons || parsed.score_reasons || parsed.reasons,
                    summary: parsed.summary,
                    strengths: parsed.strengths,
                    weaknesses: parsed.weaknesses,
                    missingSkills: parsed.missingSkills ?? parsed.missing_skills
                };
            }
        }

        // If projects were placed at root level
        if (!parsed.candidate.projects && (parsed.projects || parsed.Projects)) {
            parsed.candidate.projects = parsed.projects || parsed.Projects;
        }

        // Normalize internal analysis field names
        if (parsed.analysis && typeof parsed.analysis === "object") {
            if (parsed.analysis.skillsScore === undefined) {
                parsed.analysis.skillsScore = parsed.analysis.skills_score ?? (typeof parsed.analysis.skills === "number" ? parsed.analysis.skills : undefined);
            }
            if (parsed.analysis.experienceScore === undefined) {
                parsed.analysis.experienceScore = parsed.analysis.experience_score ?? (typeof parsed.analysis.experience === "number" ? parsed.analysis.experience : undefined);
            }
            if (parsed.analysis.projectsScore === undefined) {
                parsed.analysis.projectsScore = parsed.analysis.projects_score ?? (typeof parsed.analysis.projects === "number" ? parsed.analysis.projects : undefined);
            }
            if (parsed.analysis.educationScore === undefined) {
                parsed.analysis.educationScore = parsed.analysis.education_score ?? (typeof parsed.analysis.education === "number" ? parsed.analysis.education : undefined);
            }
            if (parsed.analysis.resumeScore === undefined) {
                parsed.analysis.resumeScore = parsed.analysis.resume_score ?? (typeof parsed.analysis.resume === "number" ? parsed.analysis.resume : undefined);
            }

            if (!parsed.analysis.summary) {
                parsed.analysis.summary = parsed.analysis.Summary || parsed.analysis.executiveSummary || parsed.analysis.executive_summary || parsed.analysis.overview || parsed.analysis.verdict;
            }

            if (!parsed.analysis.strengths) {
                parsed.analysis.strengths = parsed.analysis.Strengths || parsed.analysis.keyStrengths || parsed.analysis.key_strengths || parsed.analysis.pros;
            }

            if (!parsed.analysis.weaknesses) {
                parsed.analysis.weaknesses = parsed.analysis.Weaknesses || parsed.analysis.areasForImprovement || parsed.analysis.areas_for_improvement || parsed.analysis.areasOfImprovement || parsed.analysis.gaps || parsed.analysis.cons;
            }

            if (!parsed.analysis.missingSkills) {
                parsed.analysis.missingSkills = parsed.analysis.missing_skills || parsed.analysis.MissingSkills;
            }

            if (!parsed.analysis.scoreReasons) {
                parsed.analysis.scoreReasons = parsed.analysis.score_reasons || parsed.analysis.reasons || parsed.analysis.score_explanation || parsed.analysis.scoreExplanations;
            }
        }

        // If scoreReasons were placed at root level
        if (parsed.analysis && typeof parsed.analysis === "object" && !parsed.analysis.scoreReasons) {
            if (parsed.scoreReasons || parsed.score_reasons || parsed.reasons) {
                parsed.analysis.scoreReasons = parsed.scoreReasons || parsed.score_reasons || parsed.reasons;
            }
        }

        // Check if any genuine analysis was provided by LLM before defaults take over
        const hasScores = Boolean(
            parsed.analysis && typeof parsed.analysis === "object" && (
                parsed.analysis.skillsScore !== undefined ||
                parsed.analysis.experienceScore !== undefined ||
                parsed.analysis.projectsScore !== undefined ||
                parsed.analysis.educationScore !== undefined ||
                parsed.analysis.resumeScore !== undefined
            )
        );
        const hasSummary = Boolean(
            parsed.analysis && typeof parsed.analysis === "object" &&
            typeof parsed.analysis.summary === "string" &&
            parsed.analysis.summary.trim() &&
            parsed.analysis.summary.trim() !== "Candidate evaluation completed."
        );

        const analysisWasDefaulted = !hasScores && !hasSummary;

        if (!parsed.analysis || typeof parsed.analysis !== "object") {
            parsed.analysis = {};
        }

        const validated = resumeAnalysisSchema.parse(parsed);

        return {
            ...validated,
            analysisWasDefaulted
        };
    } catch (error) {
        console.error("AI Response Validation Error:", error);
        console.error("Raw AI Response Content:", response);
        throw new ApiError(500, "Failed to validate AI response");
    }
};

module.exports = {
    validateResponse
};