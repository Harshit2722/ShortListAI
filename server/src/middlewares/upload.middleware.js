const multer = require("multer");
const ApiError = require("../utils/ApiError");

const storage = multer.memoryStorage();

const fileFilter = (req,file,cb) => {
    const allowedTypes = ["application/pdf"];
    
    if(allowedTypes.includes(file.mimetype)){
        cb(null,true)
    }
    else{
        cb(new ApiError(400,"Only PDFs are allowed"),false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: fileFilter
})

module.exports = upload