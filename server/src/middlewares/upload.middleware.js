const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req,file,cb) => {
    const allowedTypes = ["application/pdf"];
    
    if(allowedTypes.includes(file.mimetype)){
        cb(null,true)
    }
    else{
        cb(new Error("Only PDF and WORD Documents are allowed"),false)
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