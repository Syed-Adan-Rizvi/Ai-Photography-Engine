import axios from 'axios';

// Backend URL (Ngrok ya Live Link)
const API_URL = "https://da89-121-52-153-10.ngrok-free.app"; 

// --- GENERIC POLLING HELPER (Smart Function) ---
// Yeh function bar bar backend se poochega jab tak 'COMPLETED' na ho jaye
// const pollJobResult = async (jobId) => {
//     return new Promise((resolve, reject) => {
//         const intervalId = setInterval(async () => {
//             try {
//                 console.log(`Checking status for Job ID: ${jobId}...`);
                
//                 // Backend se status poocho
//                 const response = await axios.get(`${API_URL}/api/jobs/${jobId}`);
//                 if (response.status === 200) {
//                     console.log("printing response:-----",response);
//                 // console.log("printing responseData:-----",response.data);

//                 const { status, output_data } = response.data;

//                 if (status === 'Completed') {
//                     // Kaam ho gaya! Loop roko aur result wapis karo
//                     console.log("image mil gi ");
//                     clearInterval(intervalId);
//                     resolve(output_data); // Isme image_url ya image_urls honge
//                 } else if (status === 'FAILED') {
//                     // Error aa gaya
//                     clearInterval(intervalId);
//                     reject(new Error("AI generation failed on server."));
//                 } else {
//                     // Status 'PENDING' hai, abhi aur wait karo...
//                     console.log("Still pending...");
//                 }
//                 } 
                
//             } catch (error) {
//                 clearInterval(intervalId);
//                 reject(error);
//             }
//         }, 5000); // Har 3 second (3000ms) baad check karega
//     });
// };

const pollJobResult = async (jobId) => {
    return new Promise((resolve, reject) => {
        const intervalId = setInterval(async () => {
            try {
                console.log(`Checking status for Job ID: ${jobId}...`);
                
                const response = await axios.get(`${API_URL}/api/jobs/${jobId}`);
                if (response.status === 200) {
                    console.log("printing response:-----", response);

                    const { status, result } = response.data;  // ✅ Changed output_data to result

                    // ✅ Case-insensitive check
                    if (status.toUpperCase() === 'COMPLETED') {
                        console.log("image mil gi ");
                        clearInterval(intervalId);
                        resolve(result);  // ✅ Changed output_data to result
                    } else if (status.toUpperCase() === 'FAILED') {
                        clearInterval(intervalId);
                        reject(new Error("AI generation failed on server."));
                    } else {
                        console.log("Still pending... Current status:", status);
                    }
                } 
            } catch (error) {
                clearInterval(intervalId);
                reject(error);
            }
        }, 5000);
    });
};

// --- API FUNCTIONS ---

// 1. PACKAGE DESIGN
export const submitPackageDesign = async (jsonData) => {
    // Step 1: Job Start karo
    const response = await axios.post(`${API_URL}/api/package-design`, jsonData, {
        headers: { "Content-Type": "application/json" },
        
    });
    console.log("printing response",response.data)
    // Step 2: Job ID mil gayi, ab Polling shuru karo
    const jobId = response.data.job_id;
    return await pollJobResult(jobId);
};

// 2. LOGO DESIGN
export const submitLogoDesign = async (jsonData) => {
    const response = await axios.post(`${API_URL}/api/logo-design`, jsonData, {
        headers: { "Content-Type": "application/json" },
    });
    const jobId = response.data.job_id;
    return await pollJobResult(jobId);
};

// 3. EDIT IMAGE
export const submitEditImage = async (jsonData) => {
    const response = await axios.post(`${API_URL}/api/edit-image`, jsonData, {
        headers: { "Content-Type": "application/json" },
    });
    const jobId = response.data.job_id;
    return await pollJobResult(jobId);
};

// 4. AI PHOTOSHOOT
export const submitAiPhotoshoot = async (jsonData) => {
    const response = await axios.post(`${API_URL}/api/ai-photoshoot`, jsonData, {
        headers: { "Content-Type": "application/json" },
    });
    const jobId = response.data.job_id;
    return await pollJobResult(jobId);
};

// 5. PACKAGE RANGE (Array of Images)
export const submitPackageRange = async (jsonData) => {
    const response = await axios.post(`${API_URL}/api/package-range`, jsonData, {
        headers: { "Content-Type": "application/json" },
    });
    const jobId = response.data.job_id;
    return await pollJobResult(jobId);
};

// 6. BRAND MOODBOARD
export const submitBrandMoodboard = async (jsonData) => {
    const response = await axios.post(`${API_URL}/api/brand-moodboard`, jsonData, {
        headers: { "Content-Type": "application/json" },
    });
    const jobId = response.data.job_id;
    return await pollJobResult(jobId);
};

// 7. BUSINESS MATERIALS
export const submitBusinessCard = async (jsonData) => {
    const response = await axios.post(`${API_URL}/api/business-materials`, jsonData, {
        headers: { "Content-Type": "application/json" },
    });
    const jobId = response.data.job_id;
    return await pollJobResult(jobId);
};