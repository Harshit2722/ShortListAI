const DashboardService = require("../services/dashboard.service");
const ApiResponse = require("../utils/ApiResponse");

const getDashboard = async (req, res) => {

    const dashboard = await DashboardService.getDashboard(req.user._id);

    return res.status(200).json(
        new ApiResponse(
            200,
            dashboard,
            "Dashboard data fetched successfully"
        )
    );
};

module.exports = {
    getDashboard
};