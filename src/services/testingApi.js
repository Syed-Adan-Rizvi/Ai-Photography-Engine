import axios from "axios";


// n8n webhook URLs (FULL URLs)
const PACKAGE_DESIGN_URL =import.meta.env.VITE_PACKAGE_DESIGN_URL
  

const LOGO_DESIGN_URL =import.meta.env.VITE_LOGO_DESIGN_URL

const EDIT_IMAGE_URL =import.meta.env.VITE_EDIT_IMAGE_URL

const AI_PHOTOSHOOT_URL =import.meta.env.VITE_AI_PHOTOSHOOT_URL

const PACKAGE_RANGE_URL =import.meta.env.VITE_PACKAGE_RANGE_URL

const BRAND_MOODBOARD_URL =import.meta.env.VITE_BRAND_MOODBOARD_URL

// --- APIs ---

export const submitPackageDesign = async (formData) => {
  return axios.post(PACKAGE_DESIGN_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
   
  });
};

export const submitLogoDesign = async (data) => {
  return axios.post(LOGO_DESIGN_URL, data, {
    headers: { "Content-Type": "application/json" },
  });
};

export const submitEditImage = async (formData) => {
  return axios.post(EDIT_IMAGE_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// export const submitAiPhotoshoot = async (formData) => {
//   return axios.post(AI_PHOTOSHOOT_URL, formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
// };


export const submitAiPhotoshoot = async (formData) => {
  return axios.post(AI_PHOTOSHOOT_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    // responseType: "blob" // 🔥 Important for binary response
  });
};


// Package Range
// export const submitPackageRange = async (formData) => {
//   return axios.post(PACKAGE_RANGE_URL, formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//     responseType: "blob" // 🔥 Important for binary response
//   });
// };

export const submitPackageRange = async (formData) => {
  return axios.post(PACKAGE_RANGE_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};


// Brand Moodboard
export const submitBrandMoodboard = async (formData) => {
  return axios.post(BRAND_MOODBOARD_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    responseType: "blob" // 🔥 Important for binary response
  });
}




