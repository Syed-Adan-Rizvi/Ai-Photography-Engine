import axios from "axios";

/**
 * 🔗 Single n8n Webhook (Production HTTPS)
 * IMPORTANT:
 * - Ye woh link hoga jo n8n developer ne diya hai
 * - webhook-test ❌
 * - webhook ✅ (production)
 */
const N8N_WEBHOOK_URL =
  "https://65eaec5fcfa7.ngrok-free.app/webhook/2c6294fb-4c2b-43e4-8f1c-462ca2b37f06";

/**
 * 🔁 Common Axios Config
 * - Sab forms image + text bhej rahe hain
 * - Sab responses image (binary) hain
 */
const axiosConfig = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
  responseType: "blob", // 🔥 VERY IMPORTANT (image response)
};

/**
 * =========================
 * 1️⃣ PACKAGE DESIGN
 * =========================
 */
export const submitPackageDesign = async (formData) => {
  formData.append("action", "package_design");

  return axios.post(N8N_WEBHOOK_URL, formData, axiosConfig);
};

/**
 * =========================
 * 2️⃣ LOGO DESIGN
 * =========================
 */
export const submitLogoDesign = async (formData) => {
  formData.append("action", "logo_design");

  return axios.post(N8N_WEBHOOK_URL, formData, axiosConfig);
};

/**
 * =========================
 * 3️⃣ EDIT IMAGE
 * =========================
 */
export const submitEditImage = async (formData) => {
  formData.append("action", "edit_image");

  return axios.post(N8N_WEBHOOK_URL, formData, axiosConfig);
};

/**
 * =========================
 * 4️⃣ AI PHOTOSHOOT
 * =========================
 */
export const submitAiPhotoshoot = async (formData) => {
  formData.append("action", "ai_photoshoot");

  return axios.post(N8N_WEBHOOK_URL, formData, axiosConfig);
};



//  PackageRange 


export const submitPackageRange = async (formData) => {
  formData.append("action", "ai_photoshoot");

  return axios.post(N8N_WEBHOOK_URL, formData, axiosConfig);
};




// BrandMoodboard


export const submitBrandMoodboard = async (formData) => {
  formData.append("action", "ai_photoshoot");

  return axios.post(N8N_WEBHOOK_URL, formData, axiosConfig);
};


// BusinessMaterials


export const submitBusinessCard = async (formData) => {
  formData.append("action", "ai_photoshoot");

  return axios.post(N8N_WEBHOOK_URL, formData, axiosConfig);
};