import axios from "axios";

// n8n webhook URLs (FULL URLs)
const PACKAGE_DESIGN_URL =
  "https://ahmed098.app.n8n.cloud/webhook/pacakage-design0";

const LOGO_DESIGN_URL =
  "https://n8n-bilal.onrender.com/webhook-test/LOGO_ID";

const EDIT_IMAGE_URL =
  "https://n8n-bilal.onrender.com/webhook-test/EDIT_ID";

const AI_PHOTOSHOOT_URL =
  "https://ahmed098.app.n8n.cloud/webhook/product-design0";

const PACKAGE_RANGE_URL =
  "https://hb007.app.n8n.cloud/webhook/product-variations";

const BRAND_MOODBOARD_URL =
  "https://hb007.app.n8n.cloud/webhook-test/fff50311-dc8f-439e-bca1-24ef35cc69b5";  

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




