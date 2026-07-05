const {z} = require("zod");
const ApiError = require("../../utils/ApiError");

const resumeAnalysisSchema = z.object({
    candidate: z.object({
        name: z.string().nullable(),
        email: z.string().email().nullable(),
        phone: z.string().nullable(),
        skills: z.array(z.string()),
        education: z.array(z.string()),
        experience: z.array(z.string())
    }).strict(),
    analysis: z.object({
        skillsScore: z.number().int().min(0).max(10),
        experienceScore: z.number().int().min(0).max(10),
        educationScore: z.number().int().min(0).max(10),
        resumeScore: z.number().int().min(0).max(10),
        projectsScore: z.number().int().min(0).max(10),
        summary: z.string(),
        strengths: z.array(z.string()),
        weaknesses: z.array(z.string()),
        missingSkills: z.array(z.string())
    }).strict()
}).strict()

const validateResponse = (response) => {

    try{
        const parsedResponse = JSON.parse(response);

        return resumeAnalysisSchema.parse(parsedResponse);
    }
    catch(error){
        console.error("AI Response Validation Error:", error);
        throw new ApiError(500,"Failed to validate AI response")
    }
}

module.exports = {
    validateResponse
}