const express = require("express");
const router = express.Router();

const jobController = require("../controllers/job.controller");
const verifyJWT = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const {createJobSchema,updateJobSchema} = require("../validations/job.validation");
const validate = require("../middlewares/validation.middleware");
const {authenticatedLimiter} = require("../middlewares/rate.limitor");

router.use(verifyJWT);
router.use(authenticatedLimiter);
router.use(authorize("recruiter"));

/**
 * @route POST api/v1/jobs/ 
 * @desc Create a new job
 * @access Private (Recruiter)
 */
router.post("/",validate(createJobSchema),jobController.createJob);

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

router.patch("/:jobId",validate(updateJobSchema),jobController.updateJob);

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

router.delete("/:jobId",jobController.deleteJob);

module.exports = router;