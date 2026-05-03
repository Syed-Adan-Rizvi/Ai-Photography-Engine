import axios from 'axios';

const API_URL = "https://e7838610c2af.ngrok-free.app"; // Backend Developer ka link

// --- 1. PACKAGE DESIGN (Updated) ---
export const submitPackageDesign = async (jsonData) => {
    // Ab FormData nahi, JSON jayega
    return await axios.post(`${API_URL}/api/package-design`, jsonData, {
        headers: { "Content-Type": "application/json" },
    });
};

// --- 2. EDIT IMAGE (Updated) ---
export const submitEditImage = async (jsonData) => {
    return await axios.post(`${API_URL}/api/edit-image`, jsonData, {
        headers: { "Content-Type": "application/json" },
    });
};

// --- 3. AI PHOTOSHOOT (Updated) ---
export const submitAiPhotoshoot = async (jsonData) => {
    return await axios.post(`${API_URL}/api/ai-photoshoot`, jsonData, {
        headers: { "Content-Type": "application/json" },
    });
};

// ... Baaki functions (Range, Moodboard, Business) ko bhi same 'application/json' kar dena ...

export const submitLogoDesign = async (jsonData) => {
    return await axios.post(`${API_URL}/api/logo-design`, jsonData, {
        headers: { "Content-Type": "application/json" },
    });
};

export const submitBusinessCard = async (jsonData) => {
    return await axios.post(`${API_URL}/api/business-materials`, jsonData, {
        headers: { "Content-Type": "application/json" },
    });
};

export const submitBrandMoodboard = async (jsonData) => {
    return await axios.post(`${API_URL}/api/brand-moodboard`, jsonData, {
        headers: { "Content-Type": "application/json" },
    });
};

export const submitPackageRange = async (jsonData) => {
    return await axios.post(`${API_URL}/api/package-range`, jsonData, {
        headers: { "Content-Type": "application/json" },
    });
};

// export default { submitPackageDesign, submitEditImage, submitAiPhotoshoot, submitLogoDesign, submitBusinessCard, submitBrandMoodboard, submitPackageRange };