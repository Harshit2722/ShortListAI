const { z } = require("zod");

const resumeListQuerySchema = z.object({

    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(100).default(10),

    sort: z.enum([
        "createdAt",
        "overallScore",
        "name"
    ]).default("createdAt"),

    order: z.enum([
        "asc",
        "desc"
    ]).default("desc"),

    search: z.string().trim().optional(),

    status: z.enum([
        "Pending",
        "Processing",
        "Failed",
        "Completed"
    ]).optional(),

    recommendation: z.enum([
        "Strong Match",
        "Good Match",
        "Average Match",
        "Poor Match"
    ]).optional(),

    minScore: z.coerce.number().min(0).max(10).optional(),

    maxScore: z.coerce.number().min(0).max(10).optional()

}).strict()
  .refine(
    (data) =>
        data.minScore === undefined ||
        data.maxScore === undefined ||
        data.minScore <= data.maxScore,
    {
        message: "minScore cannot be greater than maxScore",
        path: ["minScore"]
    }
);

module.exports = {
    resumeListQuerySchema
}
