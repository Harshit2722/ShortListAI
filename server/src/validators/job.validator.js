const {z} = require("zod");

const titleSchema = z.string({
    required_error: "Job title is required",
    invalid_type_error: "Job title must be a string"
})
.trim()
.min(3,"Job title must be at least 3 characters long")
.max(100,"Job title cannot exceed 100 characters");

const descriptionSchema = z.string({
    required_error: "Job description is required",
    invalid_type_error: "Job description must be a string"
})
.trim()
.min(50,"Job description must be at least 50 characters long");


const locationSchema = z.string({
    required_error: "Job location is required",
    invalid_type_error: "Job location must be a string"
})
.trim()
.min(1,"Job location is required");

const workModeSchema = z.enum(["On-Site","Remote","Hybrid"],{
    required_error: "Work mode is required",
    invalid_type_error: "Work mode must be one of On-Site, Remote, or Hybrid"
});

const employmentTypeSchema = z.enum(["Full-Time","Part-Time","Contract","Internship"],{
    required_error: "Employment type is required",
    invalid_type_error: "Employment type must be one of Full-Time, Part-Time, Contract, or Internship"
});

const experienceLevelSchema = z.number({
    required_error: "Experience level is required",
    invalid_type_error: "Experience level must be a number"
})
.min(0,"Experience level cannot be negative")
.max(50,"Experience level cannot be more than 50 years");

const durationSchema = z.object({
    value: z.number({
        required_error: "Duration value is required",
        invalid_type_error: "Duration value must be a number"
    })
    .min(1,"Duration value must be at least 1"),
    
    unit: z.enum(["days","weeks","months","years"],{
        required_error: "Duration unit is required",
        invalid_type_error: "Duration unit must be one of days, weeks, months, or years"
    })
}).optional()

const requiredSkillsSchema = z.array(z.string().trim().min(1,"Skill cannot be empty"),{
    required_error: "Required skills are required",
    invalid_type_error: "Required skills must be an array of strings"
})
.min(1,"At least one required skill is required")


const salarySchema = z.object({
    min: z.number({
        required_error: "Minimum salary is required",
        invalid_type_error: "Minimum salary must be a number"
    })
    .min(0,"Minimum salary cannot be negative"),

    max: z.number({
        required_error: "Maximum salary is required",
        invalid_type_error: "Maximum salary must be a number"
    })
    .min(0,"Maximum salary cannot be negative"),

    currency: z.string({
        required_error: "Currency is required",
        invalid_type_error: "Currency must be a string"
    })
    .trim()
    .length(3,"Currency must be 3 characters long")
    .toUpperCase()
})

const applicationDeadlineSchema = z.coerce.date({
    required_error: "Application deadline is required",
    invalid_type_error: "Application deadline must be a date"
})

const createJobSchema = z.object({
    title: titleSchema,
    description: descriptionSchema,
    location: locationSchema,
    workMode: workModeSchema,
    employmentType: employmentTypeSchema,
    duration : durationSchema,
    requiredSkills: requiredSkillsSchema,
    experience: experienceLevelSchema,
    salary: salarySchema,
    applicationDeadline: applicationDeadlineSchema

}).strict()

const updateJobSchema = createJobSchema.partial().strict();

module.exports = {
    createJobSchema,
    updateJobSchema
}