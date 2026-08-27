const express = require("express");
const router = express.Router();

const verifyJWT = require("../middlewares/auth.middleware");
const dashboardController = require("../controllers/dashboard.controller");

router.use(verifyJWT);

router.get("/", dashboardController.getDashboard);

module.exports = router;