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

const uploadAvatar = (buffer) => {
    return new Promise((resolve,reject) => {

        const uploadStream = cloudinary.uploader.upload_stream({
            resource_type: "image",
            folder: process.env.CLOUDINARY_AVATAR_FOLDER,
        },(error,result)=>{
            if(error){
                return reject(error)
            }
            else{
                resolve({
                    url: result.secure_url,
                    publicId: result.public_id
                })
            }
        })
        streamifier.createReadStream(buffer).pipe(uploadStream);
    })
}

const deleteAvatar = async (publicId) => {
    return await cloudinary.uploader.destroy(publicId, {
        resource_type: "image"
    });
};

module.exports = {
    uploadResume,
    deleteResume,
    uploadAvatar,
    deleteAvatar
};