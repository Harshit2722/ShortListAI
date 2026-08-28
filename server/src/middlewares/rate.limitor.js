const { rateLimit, ipKeyGenerator } = require("express-rate-limit");

// Public Routes Rate Limiter (register,login)
const publicLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,

    keyGenerator: (req) => {
    const email =
        typeof req.body?.email === "string"
            ? req.body.email.trim().toLowerCase()
            : "unknown";

    return `${ipKeyGenerator(req.ip)}:${email}`;
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

// Authenticated Users Rate Limiter (jobs,applications)
const authenticatedLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,

    keyGenerator: (req) => {
        return req.user._id.toString();
    },

    standardHeaders: true,
    legacyHeaders: false,

    handler: (req, res) => {
        return res.status(429).json({
            success: false,
            message: "Too many requests. Please try again after 15 minutes."
        });
    }
});

const emailLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,

    keyGenerator: (req) => {
        return req.user._id.toString()
    },

    standardHeaders: true,
    legacyHeaders: false,

    skipSuccessfulRequests: true,

    handler: (req,res) => {
        return res.status(429).json({
            success: false,
            message: "Too many email update attempts. Please try again after 15 minutes."
        })
    }
})

const passwordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,

    keyGenerator: (req) => {
        return req.user._id.toString()
    },

    standardHeaders: true,
    legacyHeaders: false,

    skipSuccessfulRequests: true,

    handler: (req,res) => {
        return res.status(429).json({
            success: false,
            message: "Too many password change attempts. Please try again after 15 minutes."
        })
    }
})

const deleteAccountLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 2,

    keyGenerator: (req) => {
        return req.user._id.toString()
    },

    standardHeaders: true,
    legacyHeaders: false,

    skipSuccessfulRequests: true,

    handler: (req,res) => {
        return res.status(429).json({
            success: false,
            message: "Too many account deletion attempts. Please try again after 15 minutes."
        })
    }
})

module.exports = {
    publicLimiter,
    refreshLimiter,
    authenticatedLimiter,
    emailLimiter,
    passwordLimiter,
    deleteAccountLimiter
}