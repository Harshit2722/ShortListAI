const Groq = require("groq-sdk");
const ApiError = require("../../utils/ApiError");

let groqClient = null;

const getGroqClient = () => {
    if (!groqClient) {
        groqClient = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });
    }
    return groqClient;
};

const DEFAULT_AI_MODEL = "openai/gpt-oss-120b";

const getModel = () => {
    return process.env.AI_MODEL || DEFAULT_AI_MODEL;
};

const generateCompletion = async (prompt) => {
    const model = getModel();

    try {
        const client = getGroqClient();
        const completion = await client.chat.completions.create({
            model: model,
            temperature: 0.1,
            response_format: { type: "json_object" },
            messages: [
                {
                    role: "system",
                    content: "You are an expert technical recruiter evaluating resumes against job descriptions. Always respond with a valid JSON object strictly containing 'candidate' and 'analysis' top-level objects."
                },
                {
                    role: "user",
                    content: prompt
                }
            ]
        });

        let content = completion.choices[0]?.message?.content;
        if (!content) {
            throw new Error("Empty response received from Groq API");
        }

        // Some LLMs occasionally wrap json mode output in code blocks; clean before returning
        if (typeof content === "string") {
            content = content.trim();
            if (content.startsWith("```")) {
                content = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
            }
        }

        return content;
    } catch (error) {
        console.error("Groq Completion Error:", error.message || error);
        throw new ApiError(500, "Failed to generate AI response");
    }
};

module.exports = {
    generateCompletion,
    getModel,
    DEFAULT_AI_MODEL
};