const { z } = require("zod");

const passwordSchema = z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string"
})
.min(8, "Password must be at least 8 characters long")
.max(64, "Password must be at most 64 characters long")
.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).*$/,
    "Password must contain at least one lowercase letter, one uppercase letter, one number and one special character"
)

const emailSchema = z.string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string"
})
.trim()
.toLowerCase()
.email("Invalid email address")

module.exports = {
    passwordSchema,
    emailSchema
}