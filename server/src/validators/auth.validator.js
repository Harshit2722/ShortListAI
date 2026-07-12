const {z} = require("zod");
const {emailSchema, passwordSchema} = require("./common.validator")

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
    .regex(/^[a-zA-Z0-9\s.&-]+$/,"Company can only contain letters, numbers, spaces, dots, ampersands and hyphens")
    ,

    designation: z.string({
        invalid_type_error: "Designation must be a string"
    })
    .min(2,"Designation must be at least 2 characters long")
    .max(100,"Designation must be at most 100 characters long")
    .trim()
    .regex(/^[a-zA-Z0-9\s.&-]+$/,"Designation can only contain letters, numbers, spaces, dots, ampersands and hyphens")
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