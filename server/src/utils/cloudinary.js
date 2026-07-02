const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadResume = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "raw",
                folder: process.env.CLOUDINARY_RESUME_FOLDER
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                resolve({
                    url: result.secure_url,
                    publicId: result.public_id
                });
            }
        );

        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

const deleteResume = async (publicId) => {
    await cloudinary.uploader.destroy(publicId, {
        resource_type: "raw"
    });
};

module.exports = {
    uploadResume,
    deleteResume
};