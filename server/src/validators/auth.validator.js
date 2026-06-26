const {z} = require("zod");

const emailSchema = z.string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string"
})
.email("Invalid email address")
.trim()
.toLowerCase()

const passwordSchema = z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string"
})
.min(8,"Password must be at least 8 characters long")
.max(64,"Password must be at most 64 characters long")
.trim()
.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).*$/,
"Password must contain at least one lowercase letter, one uppercase letter, one number and one special character"
)

const registerSchema = z.object({
    name: z.string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string"
    })
    .min(2,"Name must be at least 2 characters long")
    .max(30,"Name must be at most 30 characters long")
    .trim()
    .regex(/^[a-zA-Z\s]+$/,"Name can only contain alphabetic characters")
    ,

    email: emailSchema,

    password: passwordSchema
    ,

    company: z.string({
        invalid_type_error: "Company must be a string"
    })
    .min(2,"Company must be at least 2 characters long")
    .max(100,"Company must be at most 100 characters long")
    .trim()
    .regex(/^[a-zA-Z0-9\s.&-]+$/,"Company can only contain alphabetic characters, numbers, spaces, dots, ampersands and hyphens")
    .optional()
    ,

    designation: z.string({
        invalid_type_error: "Designation must be a string"
    })
    .min(2,"Designation must be at least 2 characters long")
    .max(100,"Designation must be at most 100 characters long")
    .trim()
    .optional()
    ,

    avatar: z.string({
        invalid_type_error: "Avatar must be a string"
    })
    .url("Invalid URL")
    .trim()
    .optional()

}).strict()

const loginSchema = z.object({
    email: emailSchema,
    
    password: passwordSchema
    
}).strict()



module.exports = {
    registerSchema,
    loginSchema
}