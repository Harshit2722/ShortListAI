require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const { getModel } = require("./services/ai/groq");

const startServer = async () => {
    try {
        await connectDB();
        
        const activeModel = getModel();
        console.log(`[AI Engine] Active Model: ${activeModel}`);

        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
};

startServer();

