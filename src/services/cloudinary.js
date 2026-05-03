import axios from 'axios';

// Apni Cloudinary details yahan dalein
const CLOUD_NAME = "do5mr4zxc"; 
const UPLOAD_PRESET = "snapfit_uploads"; 

export const uploadToCloudinary = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            formData
        );
        // Humein sirf URL chahiye
        return response.data.secure_url;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw error;
    }
};