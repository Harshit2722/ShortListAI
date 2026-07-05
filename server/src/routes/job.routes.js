const express = require("express");
const router = express.Router();

const jobController = require("../controllers/job.controller");
const resumeController = require("../controllers/resume.controller");
const upload = require("../middlewares/upload.middleware")
const verifyJWT = require("../middlewares/auth.middleware");
const {createJobSchema,updateJobSchema} = require("../validators/job.validator");
const validate = require("../middlewares/validation.middleware");
const {authenticatedLimiter} = require("../middlewares/rate.limitor");

router.use(verifyJWT);

// Job Routes
/**
 * @route POST api/v1/jobs/ 
 * @desc Create a new job
 * @access Private (Recruiter)
 */
router.post("/",authenticatedLimiter,validate(createJobSchema),jobController.createJob);

/**
 * @route GET api/v1/jobs/ 
 * @desc Get all jobs of recruiter
 * @access Private (Recruiter)
 */

router.get("/",jobController.getAllJobsOfARecruiter);

/**
 * @route PATCH api/v1/jobs/:jobId
 * @desc Update a job
 * @access Private (Recruiter)
 */

router.patch("/:jobId",authenticatedLimiter,validate(updateJobSchema),jobController.updateJob);

/**
 * @route GET api/v1/jobs/:jobId
 * @desc Get a job by ID
 * @access Private (Recruiter)
 */

router.get("/:jobId",jobController.getJobById);

/**
 * @route DELETE api/v1/jobs/:jobId
 * @desc Delete a job
 * @access Private (Recruiter)
 */

router.delete("/:jobId",authenticatedLimiter,jobController.deleteJob);


//Resume Routes
/**
 * @route POST /api/v1/jobs/:jobId/resumes
 * @desc Upload resume for a job
 * @access Private
 */
router.post("/:jobId/resumes",authenticatedLimiter,upload.single("resume"),resumeController.createResume);

/**
 * @route GET /api/v1/jobs/:jobId/resumes/:resumeId
 * @desc Get resume by ID
 * @access Private
 */
router.get("/:jobId/resumes/:resumeId",resumeController.getResumeById);

/**
 * @route GET /api/v1/jobs/:jobId/resumes
 * @desc Get all resumes for a job
 * @access Private
 */
router.get("/:jobId/resumes",resumeController.getResumesByJob);

/**
 * @route DELETE /api/v1/jobs/:jobId/resumes/:resumeId
 * @desc Delete resume
 * @access Private
 */
router.delete("/:jobId/resumes/:resumeId",authenticatedLimiter,resumeController.deleteResume);

/**
 * @route POST /api/v1/jobs/:jobId/resumes/:resumeId/analyze
 * @desc Analyze resume
 * @access Private
 */
router.post("/:jobId/resumes/:resumeId/analyze",authenticatedLimiter,resumeController.analyzeResume);


module.exports = router;