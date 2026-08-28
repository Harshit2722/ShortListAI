const { z } = require("zod");
const { passwordSchema, emailSchema } = require("./common.validator");

const updateProfileSchema = z.object({

    name: z.string({
        invalid_type_error: "Name must be a string"
    })
        .min(2, "Name must be at least 2 characters long")
        .max(30, "Name must be at most 30 characters long")
        .trim()
        .regex(/^[a-zA-Z\s]+$/, "Name can only contain alphabetic characters")
    ,

    company: z.string({
        invalid_type_error: "Company must be a string"
    })
        .min(2, "Company must be at least 2 characters long")
        .max(100, "Company must be at most 100 characters long")
        .trim()
        .regex(/^[a-zA-Z0-9\s.&-]+$/, "Company can only contain alphabetic characters, numbers, spaces, dots, ampersands and hyphens")
    ,

    designation: z.string({
        invalid_type_error: "Designation must be a string"
    })
        .min(2, "Designation must be at least 2 characters long")
        .max(100, "Designation must be at most 100 characters long")
        .trim()
        .regex(/^[a-zA-Z0-9\s.&-]+$/, "Designation can only contain letters, numbers, spaces, dots, ampersands and hyphens")

}).partial()
    .strict()
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field must be provided."
        }
    )

const requestEmailChangeSchema = z.object({
    newEmail: emailSchema,
    password: passwordSchema
}).strict()

const verifyEmailChangeSchema = z.object({
    otp: z.string({
        required_error: "OTP is required",
        invalid_type_error: "OTP must be a string"
    })
        .trim()
        .length(6, "OTP must be 6 digits")
        .regex(/^[0-9]+$/, "OTP must be numeric")
}).strict()

const updatePasswordSchema = z.object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema
}).refine(
    (data) => data.newPassword !== data.currentPassword,
    {
        message: "New Password cannot be same as current Password",
        path: ["newPassword"]
    }
).strict()

const deleteUserSchema = z.object({
    password: passwordSchema
}).strict()

module.exports = {
    updateProfileSchema,
    requestEmailChangeSchema,
    verifyEmailChangeSchema,
    updatePasswordSchema,
    deleteUserSchema
}