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
    }),
    analysis: z.object({
        score: z.number().min(0).max(10),

        recommendation: z.enum(["Strong Match","Good Match","Average Match","Poor Match"]),

        summary: z.string(),

        strengths: z.array(z.string()),
        weaknesses: z.array(z.string()),
        missingSkills: z.array(z.string())
    })
})

const validateResponse = (response) => {

    try{
        const parsedResponse = JSON.parse(response);

        return resumeAnalysisSchema.parse(parsedResponse);
    }
    catch(error){
        console.log(error.message);
        throw new ApiError(500,"Failed to validate AI response")
    }
}

module.exports = {
    validateResponse
}