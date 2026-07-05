const determineSeniority = (jobTitle, requiredExperience) => {

    const title = jobTitle.toLowerCase();

    if (title.includes("intern")) {
        return "Intern";
    }

    if (title.includes("junior") || title.includes("jr")) {
        return "Junior";
    }

    if (title.includes("senior") || title.includes("sr")) {
        return "Senior";
    }

    if (title.includes("staff")) {
        return "Staff";
    }

    if (title.includes("principal")) {
        return "Principal";
    }

    if (requiredExperience === 0) {
        return "Intern";
    }

    if (requiredExperience <= 2) {
        return "Junior";
    }

    if (requiredExperience <= 5) {
        return "Mid-Level";
    }

    if (requiredExperience <= 8) {
        return "Senior";
    }

    return "Staff";
};

module.exports = {
    determineSeniority
};