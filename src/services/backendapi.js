import axios from 'axios';

// ------------------------------------------------------------------
// BASE URL SETUP
// ------------------------------------------------------------------
// Jab Backend Developer aapko Ngrok ya Cloud ka link de, 
// to is variable ko update kar dena.
// Example: const API_URL = "https://your-backend-app.onrender.com";
const API_URL = "http://127.0.0.1:8000"; 

// ------------------------------------------------------------------
// 1. PACKAGE DESIGN (Image + Text)
// ------------------------------------------------------------------
export const submitPackageDesign = async (formData) => {
    return await axios.post(`${API_URL}/api/package-design`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

// ------------------------------------------------------------------
// 2. LOGO DESIGN (Text Only - JSON)
// ------------------------------------------------------------------
export const submitLogoDesign = async (data) => {
    // Note: Isme koi image nahi hai, isliye 'application/json'
    return await axios.post(`${API_URL}/api/logo-design`, data, {
        headers: { "Content-Type": "application/json" },
    });
};

// ------------------------------------------------------------------
// 3. EDIT IMAGE (Image + Text)
// ------------------------------------------------------------------
export const submitEditImage = async (formData) => {
    return await axios.post(`${API_URL}/api/edit-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

// ------------------------------------------------------------------
// 4. AI PHOTOSHOOT (Image + Text)
// ------------------------------------------------------------------
export const submitAiPhotoshoot = async (formData) => {
    return await axios.post(`${API_URL}/api/ai-photoshoot`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

// ------------------------------------------------------------------
// 5. PACKAGE RANGE (Image + Checkboxes)
// ------------------------------------------------------------------
export const submitPackageRange = async (formData) => {
    // Response mein Array of Images aayega
    return await axios.post(`${API_URL}/api/package-range`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

// ------------------------------------------------------------------
// 6. BRAND MOODBOARD (Text + Optional Image)
// ------------------------------------------------------------------
export const submitBrandMoodboard = async (formData) => {
    return await axios.post(`${API_URL}/api/brand-moodboard`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

// ------------------------------------------------------------------
// 7. BUSINESS MATERIALS (Image + Text)
// ------------------------------------------------------------------
export const submitBusinessCard = async (formData) => {
    return await axios.post(`${API_URL}/api/business-materials`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};