const rateLimit = require("express-rate-limit");

// General Api Rate Limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,

    standardHeaders: true,
    legacyHeaders: false,

    handler: (req, res) => {
        return res.status(429).json({
            success: false,
            message: "Too many requests. Please try again later."
        });
    }
});

// Public Routes Rate Limiter (register,login)
const publicLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,

    keyGenerator: (req) => {
        const email =
            typeof req.body?.email === "string"
            ? req.body.email.trim().toLowerCase()
            : "unknown";

        return `${req.ip}:${email}`;
    },

    standardHeaders: true,
    legacyHeaders: false,

    skipSuccessfulRequests: true,

    handler: (req, res) => {
        return res.status(429).json({
            success: false,
            message: "Too many requests on public endpoints. Please try again after 15 minutes."
        });
    }
});

// refresh rate limitor
const refreshLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,

    standardHeaders: true,
    legacyHeaders: false,

    skipSuccessfulRequests: true,

    handler: (req, res) => {
        return res.status(429).json({
            success: false,
            message: "Too many refresh token requests. Please try again after 15 minutes."
        });
    }
})

module.exports = {
    apiLimiter,
    publicLimiter,
    refreshLimiter
}