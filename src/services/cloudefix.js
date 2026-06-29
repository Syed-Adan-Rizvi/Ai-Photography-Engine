import axios from 'axios';

const API_URL =import.meta.env.VITE_API_URL; 

// ✅ IMPROVED POLLING WITH ERROR HANDLING
const pollJobResult = async (jobId) => {
    return new Promise((resolve, reject) => {
        let attemptCount = 0;
        const maxAttempts = 60; // 5 minutes max (60 * 5 seconds)
        
        const intervalId = setInterval(async () => {
            try {
                attemptCount++;
                console.log(`🔄 Attempt ${attemptCount}: Checking Job ${jobId}...`);
                
                // ✅ Add ngrok bypass header
                const response = await axios.get(`${API_URL}/api/jobs/${jobId}`, {
                    headers: {
                        'ngrok-skip-browser-warning': 'true',
                        'Content-Type': 'application/json'
                    }
                });
                
                // ✅ Validate response is JSON
                if (typeof response.data === 'string' || !response.data) {
                    console.warn("⚠️ Invalid response format, retrying...");
                    return;
                }

                const { status, result  } = response.data;
                
                console.log(`📊 Status: ${status}`);

                if (status && status.toUpperCase() === 'COMPLETED') {
                    console.log("✅ Job completed!");
                    clearInterval(intervalId);
                    resolve(result );
                } else if (status && status.toUpperCase() === 'FAILED') {
                    console.error("❌ Job failed");
                    clearInterval(intervalId);
                    reject(new Error("AI generation failed on server."));
                } else if (attemptCount >= maxAttempts) {
                    console.error("⏱️ Timeout: Max attempts reached");
                    clearInterval(intervalId);
                    reject(new Error("Job timeout - took too long"));
                } else {
                    console.log(`⏳ Still pending (${attemptCount}/${maxAttempts})...`);
                }
                
            } catch (error) {
                console.error("❌ Network error:", error.message);
                
                // Stop after too many errors
                if (attemptCount >= maxAttempts) {
                    clearInterval(intervalId);
                    reject(new Error("Network error: " + error.message));
                }
            }
        }, 5000);
    });
};

// --- API FUNCTIONS ---

export const submitPackageDesign = async (jsonData) => {
    const response = await axios.post(`${API_URL}/api/package-design`, jsonData, {
        headers: { 
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true"  // ✅ Add here too
        },
    });
    console.log("📦 Job created:", response.data);
    const jobId = response.data.job_id;
    return await pollJobResult(jobId);
};

export const submitLogoDesign = async (jsonData) => {
    const response = await axios.post(`${API_URL}/api/logo-design`, jsonData, {
        headers: { 
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true"
        },
    });
    const jobId = response.data.job_id;
    return await pollJobResult(jobId);
};

export const submitEditImage = async (jsonData) => {
    const response = await axios.post(`${API_URL}/api/edit-image`, jsonData, {
        headers: { 
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true"
        },
    });
    const jobId = response.data.job_id;
    return await pollJobResult(jobId);
};

export const submitAiPhotoshoot = async (jsonData) => {
    const response = await axios.post(`${API_URL}/api/ai-photoshoot`, jsonData, {
        headers: { 
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true"
        },
    });
    const jobId = response.data.job_id;
    return await pollJobResult(jobId);
};

export const submitPackageRange = async (jsonData) => {
    const response = await axios.post(`${API_URL}/api/package-range`, jsonData, {
        headers: { 
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true"
        },
    });
    const jobId = response.data.job_id;
    return await pollJobResult(jobId);
};

export const submitBrandMoodboard = async (jsonData) => {
    const response = await axios.post(`${API_URL}/api/brand-moodboard`, jsonData, {
        headers: { 
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true"
        },
    });
    const jobId = response.data.job_id;
    return await pollJobResult(jobId);
};

export const submitBusinessCard = async (jsonData) => {
    const response = await axios.post(`${API_URL}/api/business-materials`, jsonData, {
        headers: { 
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true"
        },
    });
    const jobId = response.data.job_id;
    return await pollJobResult(jobId);
};