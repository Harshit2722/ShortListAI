const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const errorMiddleware = require("./middlewares/error.middleware")
const authRoutes = require("./routes/auth.routes")
const jobRoutes = require("./routes/job.routes")
const userRoutes = require("./routes/user.routes")
const dashboardRoutes = require("./routes/dashboard.routes");


const app = express();

app.set("trust proxy", 1);

app.use(helmet());

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "ShortList AI Backend is live!"
    })
})

// Unauthenticated health check for Render zero-downtime and cold-start warming
app.get("/health", (req, res) => {
    return res.status(200).json({
        status: "ok"
    });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

app.use(errorMiddleware);

module.exports = app;