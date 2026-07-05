const Groq = require("groq-sdk");
const ApiError = require("../../utils/ApiError");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const generateCompletion = async (prompt) => {

    try{
        const completion = await groq.chat.completions.create({
            model: process.env.AI_MODEL,
            temperature: 0.2,
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        });

        return completion.choices[0].message.content;
    }
    catch(error){
        console.error(error);
        throw new ApiError(500,"Failed to generate AI response");
    }
}

module.exports = {
    generateCompletion
}