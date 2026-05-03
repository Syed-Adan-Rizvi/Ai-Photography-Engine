import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { FaCamera, FaLayerGroup, FaLightbulb, FaUpload, FaCheckCircle, FaDownload, FaRedo } from "react-icons/fa";
import { uploadToCloudinary } from '../../services/cloudinary';
// import { submitAiPhotoshoot } from '../../services/cloudefix';
// import { submitAiPhotoshoot } from '../../services/jsonapi';
// import { submitAiPhotoshoot } from '../../services/pollingapi';
import { submitAiPhotoshoot } from '../../services/testingApi';
import './AiPhotoshoot.css';

const AiPhotoshoot = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [generatedPhotoshoot, setGeneratedPhotoshoot] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Component ke andar, onSubmit ke baad yeh function add karo:

const handleDownload = async (imageUrl, filename) => {
    try {
        console.log("📥 Downloading image...");
        
        // ✅ Method 1: Cloudinary fl_attachment (Recommended)
        // Cloudinary URL ko modify karke force download
        let downloadUrl = imageUrl;
        
        if (imageUrl.includes('cloudinary.com')) {
            // Check if already has fl_attachment
            if (!imageUrl.includes('fl_attachment')) {
                // Add fl_attachment before /upload/
                downloadUrl = imageUrl.replace('/upload/', '/upload/fl_attachment/');
            }
        }
        
        // Open in new tab with download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log("✅ Download started!");
        
    } catch (error) {
        console.error("❌ Download failed:", error);
        alert("Download failed. Please try right-click > Save Image As");
    }
};

  const onSubmit = async (data) => {
    if (!data.productImage || data.productImage.length === 0) {
        alert("❌ Please upload a product image!");
        return;
    }

    setIsSubmitting(true);
    
    try {
        console.log("📤 Submitting Photoshoot Request...");

        // 1. Upload to Cloudinary
        console.log("☁️ Uploading image to Cloudinary...");
        const imageUrl = await uploadToCloudinary(data.productImage[0]);
        
        if (!imageUrl) {
            alert("❌ Image upload failed. Please try again.");
            setIsSubmitting(false);
            return;
        }

        // ✅ Validate URL format
        if (!imageUrl.startsWith('http')) {
            alert("❌ Invalid image URL format");
            setIsSubmitting(false);
            return;
        }

        console.log("✅ Image Uploaded:", imageUrl);

        // ✅ 2. Create payload with validation and defaults
        const payload = {
            productImageUrl: imageUrl,
            purpose: data.purpose?.trim() || "ecommerce",  // ✅ Default value
            industry: data.industry?.trim() || "general",
            audience: data.audience?.trim() || "General Audience",
            sceneDescription: data.sceneDescription?.trim() || "Professional studio lighting"
        };

        // ✅ Debug log
        console.log("📦 Payload:", JSON.stringify(payload, null, 2));

        // 3. Submit to backend
        const response = await submitAiPhotoshoot(payload);
        
        console.log("📥 Backend Response:", response);

        // ✅ 4. Handle different response structures
        let finalImageUrl = null;

        if (response) {
            finalImageUrl = response.image_url           
                         || response?.result?.image_url  
                         || response?.data?.image_url
                         || response?.data?.url;
        }

        if (finalImageUrl) {
            console.log("✅ Final Image URL:", finalImageUrl);
            setGeneratedPhotoshoot(finalImageUrl);
        } else {
            console.error("❌ No image URL found in response:", response);
            alert("❌ Photoshoot generated but image URL not found. Please try again.");
        }

        setIsSubmitting(false);

    } catch (error) {
        console.error("❌ Submission Error:", error);
        
        // ✅ Detailed error handling
        if (error.response) {
            console.error("Backend Error:", error.response.data);
            
            if (error.response.status === 422) {
                // Validation error
                const validationErrors = error.response.data?.detail || [];
                console.error("Validation Errors:", validationErrors);
                
                const errorMsg = validationErrors.map(err => 
                    `Field: ${err.loc?.join('.')}, Error: ${err.msg}`
                ).join('\n');
                
                alert(`❌ Validation Error:\n${errorMsg}`);
            } else {
                alert(`❌ Server Error: ${error.response.data?.detail || error.message}`);
            }
        } else if (error.request) {
            alert("🌐 Network error. Please check your internet connection.");
        } else if (error.message.includes("timeout")) {
            alert("⏱️ Request timed out. Please try again.");
        } else {
            alert(`❌ Error: ${error.message || "Something went wrong."}`);
        }
        
        setIsSubmitting(false);
    }
  };

  const handleReset = () => {
      setGeneratedPhotoshoot(null);
      setImagePreview(null);
      reset();
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="card shadow-lg border-0">
        
        <div className="card-header bg-theme text-white p-4">
          <h2 className="mb-0 row justify-content-center">
            <div className='col-12 text-center'>
              <FaCamera className="me-2"/> Virtual AI Photoshoot
            </div>
          </h2>
          <p className="mb-0 row justify-content-center" style={{ opacity: 0.9 }}>
            Create professional studio-grade photos instantly.
          </p>
        </div>

        <div className="card-body p-4">

            {generatedPhotoshoot ? (
                <div className="text-center fade-in py-4">
                    <FaCheckCircle className="text-success mb-3" size={50} />
                    <h3 className="text-success fw-bold mb-3">Photoshoot Complete!</h3>
                    <p className="text-muted mb-4">Here is your product in a professional studio setting.</p>
                    
                    <div className="result-container mb-4 shadow-sm">
                        <img 
                            src={generatedPhotoshoot} 
                            alt="Photoshoot Result" 
                            className="img-fluid rounded" 
                            style={{maxHeight: "450px", width: "auto"}} 
                        />
                    </div>

                    <div className="d-flex justify-content-center gap-3">
                        {/* <a href={generatedPhotoshoot} download="MyPhotoshoot.png" className="btn btn-theme btn-lg px-4">
                            <FaDownload className="me-2"/> Download Image
                        </a> */}
                        <a 
                                href={generatedPhotoshoot} 
                                download="MyPackageDesign.png" 
                                className="btn btn-theme btn-lg px-4"
                                onClick={(e) => {
                                    e.preventDefault();  // Default behavior roko
                                    handleDownload(generatedPhotoshoot, "MyAIPhotoshoot.png");
                                }}
                            >
                                <FaDownload className="me-2"/> Download Image
                        </a>
                        <button onClick={handleReset} className="btn btn-outline-success btn-lg px-4">
                            <FaRedo className="me-2"/> New Photoshoot
                        </button>
                    </div>
                </div>

            ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    
                    {/* STEP 1: Product Upload */}
                    <div className="mb-5">
                        <h5 className="border-bottom pb-2 mb-3 text-dark">
                            <span className="step-number">1</span> Product Upload
                        </h5>
                        
                        <div className="row">
                            <div className="col-md-12">
                                <label className="form-label fw-bold">Upload Raw Product Photo *</label>
                                
                                <div className="preview-box mb-3 text-center text-muted">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="preview-img" />
                                    ) : (
                                        <div>
                                            <FaUpload size={40} className="mb-2 text-success" />
                                            <p className="mb-0">Drop your product image here</p>
                                        </div>
                                    )}
                                </div>

                                <input 
                                    type="file" 
                                    className={`form-control ${errors.productImage ? 'is-invalid' : ''}`}
                                    accept="image/*"
                                    {...register("productImage", { 
                                        required: "Product image is required", 
                                        onChange: (e) => handleImageChange(e) 
                                    })} 
                                />
                                {errors.productImage && <span className="text-danger small">{errors.productImage.message}</span>}
                            </div>
                        </div>
                    </div>

                    {/* STEP 2: Contextual Setup */}
                    <div className="mb-5">
                        <h5 className="border-bottom pb-2 mb-3 text-dark">
                            <span className="step-number">2</span> Contextual Setup
                        </h5>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Photoshoot Purpose *</label>
                                <select 
                                    className={`form-select ${errors.purpose ? 'is-invalid' : ''}`}
                                    {...register("purpose", { required: "Select purpose" })}
                                >
                                    <option value="">Select Purpose...</option>
                                    <option value="social_media">Instagram / Social Media</option>
                                    <option value="ecommerce">E-Commerce Listing</option>
                                    <option value="advertisement">Paid Advertisement</option>
                                    <option value="website">Website Hero Banner</option>
                                </select>
                                {errors.purpose && <span className="text-danger small">{errors.purpose.message}</span>}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Industry</label>
                                <select className="form-select" {...register("industry")}>
                                    <option value="">Select Industry...</option>
                                    <option value="fashion">Fashion & Apparel</option>
                                    <option value="beauty">Beauty & Cosmetics</option>
                                    <option value="tech">Gadgets & Tech</option>
                                    <option value="food">Food & Beverage</option>
                                    <option value="home">Home Decor</option>
                                    <option value="general">General / Other</option>
                                </select>
                            </div>
                            <div className="col-12">
                                <label className="form-label">Target Audience</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="e.g. Gen Z shoppers, Luxury buyers (Optional)" 
                                    {...register("audience")} 
                                />
                            </div>
                        </div>
                    </div>

                    {/* STEP 3: Custom Scene Selection */}
                    <div className="mb-5">
                        <h5 className="border-bottom pb-2 mb-3 text-dark">
                            <span className="step-number">3</span> Custom Scene Selection
                        </h5>
                        <div className="mb-3">
                            <label className="form-label fw-bold">
                                <FaLightbulb className="me-2 text-success"/>Describe the Environment *
                            </label>
                            <textarea 
                                className={`form-control ${errors.sceneDescription ? 'is-invalid' : ''}`}
                                rows="3" 
                                placeholder="E.g., Studio lighting on a clean white backdrop, or placed on a wooden table with sunlight streaming in..."
                                {...register("sceneDescription", { required: "Please describe the scene" })}
                            ></textarea>
                            {errors.sceneDescription && <span className="text-danger small">{errors.sceneDescription.message}</span>}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="d-grid gap-2 mt-4">
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className={`btn btn-theme btn-lg py-3 ${isSubmitting ? 'btn-loading' : ''}`}
                        >
                            {isSubmitting ? (
                                <>
                                   <span className="spinner-border spinner-border-sm me-2"></span>
                                   RENDERING SCENE... (This may take 20-30 seconds)
                                </>
                            ) : (
                                <>
                                   <FaLayerGroup className="me-2" /> GENERATE PHOTOSHOOT
                                </>
                            )}
                        </button>
                    </div>

                </form>
            )}

        </div>
      </div>
    </div>
  );
};

export default AiPhotoshoot;




































// import React, { useState } from 'react';
// import { useForm } from "react-hook-form";
// import { FaCamera, FaLayerGroup, FaLightbulb, FaUpload, FaCheckCircle, FaDownload, FaRedo } from "react-icons/fa";
// // API Service Import (Uncomment when backend is ready)
// // import { submitAiPhotoshoot } from '../../services/api';
// import { uploadToCloudinary } from '../../services/cloudinary';
// import { submitAiPhotoshoot } from '../../services/cloudefix';

// // CSS Import
// import './AiPhotoshoot.css';

// const AiPhotoshoot = () => {
//   const { register, handleSubmit, formState: { errors }, reset } = useForm();
  
//   // States
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [imagePreview, setImagePreview] = useState(null); // Product Preview
//   const [generatedPhotoshoot, setGeneratedPhotoshoot] = useState(null); // Final Result

//   // Handle Image Upload Preview
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const onSubmit = async (data) => {
//     if (!data.productImage || data.productImage.length === 0) {
//         alert("Please upload a product image!");
//         return;
//     }

//     setIsSubmitting(true);
    
//     try {
//         // const formData = new FormData();
//         // formData.append("productImage", data.productImage[0]);
//         // formData.append("purpose", data.purpose);
//         // formData.append("industry", data.industry);
//         // formData.append("audience", data.audience);
//         // formData.append("sceneDescription", data.sceneDescription);

//         console.log("Submitting Photoshoot Request...");

//         // --- SIMULATION MODE (Testing ke liye) ---
//         // setTimeout(() => {
//         //     // Fake Backend Response
//         //     const mockResult = "https://via.placeholder.com/600x400.png?text=AI+Studio+Photoshoot+Result";
            
//         //     setGeneratedPhotoshoot(mockResult); // Result Show karein
//         //     setIsSubmitting(false);
//         // }, 2500);

//         // --- REAL API MODE ---


//         console.log("Uploading image to Cloudinary...");
                
//                 // 1. Pehle Image Cloudinary per upload kero
//                 const imageUrl = await uploadToCloudinary(data.productImage[0]);
                
//                 if (!imageUrl) {
//                     alert("Image upload failed");
//                     setIsSubmitting(false);
//                     return;
//                 }
        
//                 console.log("Image Uploaded:", imageUrl);
        
//                 // 2. Ab Backend ke liye JSON data banao (FormData nahi)
//                 const payload = {
//                     productImageUrl: imageUrl, // File ki jagah URL gaya
//                     purpose: data.purpose,
//                     industry: data.industry,
//                     audience: data.audience,
//                     sceneDescription: data.sceneDescription,
                    
//                 };
        
//         const response = await submitAiPhotoshoot(payload);
//         // if (response.data && response.data.image_url) {
//         //     setGeneratedPhotoshoot(response.data.image_url);
//         // }
//         //     const imageBlob = response.data;
//         //     const imageUrl = URL.createObjectURL(imageBlob);
//         //     setGeneratedPhotoshoot(imageUrl);
//         // setIsSubmitting(false);
//         console.log("Backend Response:", response);
//         let finalImageUrl = null;

//         if (response) {
//             // Try different possible structures
//             finalImageUrl = response.image_url           // Direct: {image_url: "..."}
//                          || response?.result?.image_url  // Nested: {result: {image_url: "..."}}
//                          || response?.data?.image_url;   // API wrapper: {data: {image_url: "..."}}
//         }

//         if (finalImageUrl) {
//             console.log("✅ Final Image URL:", finalImageUrl);
//             setGeneratedPhotoshoot(finalImageUrl);
//         } else {
//             console.error("❌ No image URL found in response:", response);
//             alert("Design generated but image URL not found. Please try again.");
//         }
        

//     } catch (error) {
//         console.error("Error:", error);
//         alert("Error generating photoshoot.");
//         setIsSubmitting(false);
//     }
//   };

//   // Reset Function
//   const handleReset = () => {
//       setGeneratedPhotoshoot(null);
//       setImagePreview(null);
//       reset();
//   };

//   return (
//     <div className="container mt-4 mb-5">
//       <div className="card shadow-lg border-0">
        
//         {/* Header */}
//         <div className="card-header bg-theme text-white p-4">
//           <h2 className="mb-0 row justify-content-center"><div className='col-12 text-center'><FaCamera className="me-2"/> Virtual AI Photoshoot</div></h2>
//           <p className="mb-0 row justify-content-center" style={{ opacity: 0.9 }}>Create professional studio-grade photos instantly.</p>
//         </div>

//         <div className="card-body p-4">

//             {/* === CONDITIONAL RENDERING === */}
            
//             {generatedPhotoshoot ? (
//                 // ---------------- RESULT VIEW ----------------
//                 <div className="text-center fade-in py-4">
//                     <FaCheckCircle className="text-success mb-3" size={50} />
//                     <h3 className="text-success fw-bold mb-3">Photoshoot Complete!</h3>
//                     <p className="text-muted mb-4">Here is your product in a professional studio setting.</p>
                    
//                     {/* Final Image */}
//                     <div className="result-container mb-4 shadow-sm">
//                         <img 
//                             src={generatedPhotoshoot} 
//                             alt="Photoshoot Result" 
//                             className="img-fluid rounded" 
//                             style={{maxHeight: "450px", width: "auto"}} 
//                         />
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="d-flex justify-content-center gap-3">
//                         <a href={generatedPhotoshoot} download="MyPhotoshoot.png" className="btn btn-theme btn-lg px-4">
//                             <FaDownload className="me-2"/> Download Image
//                         </a>
//                         <button onClick={handleReset} className="btn btn-outline-success btn-lg px-4">
//                             <FaRedo className="me-2"/> New Photoshoot
//                         </button>
//                     </div>
//                 </div>

//             ) : (
//                 // ---------------- FORM VIEW ----------------
//                 <form onSubmit={handleSubmit(onSubmit)}>
                    
//                     {/* === STEP 1: Product Upload === */}
//                     <div className="mb-5">
//                         <h5 className="border-bottom pb-2 mb-3 text-dark">
//                             <span className="step-number">1</span> Product Upload
//                         </h5>
                        
//                         <div className="row">
//                             <div className="col-md-12">
//                                 <label className="form-label fw-bold">Upload Raw Product Photo</label>
                                
//                                 {/* Preview Area */}
//                                 <div className="preview-box mb-3 text-center text-muted">
//                                     {imagePreview ? (
//                                         <img src={imagePreview} alt="Preview" className="preview-img" />
//                                     ) : (
//                                         <div>
//                                             <FaUpload size={40} className="mb-2 text-success" />
//                                             <p className="mb-0">Drop your product image here</p>
//                                         </div>
//                                     )}
//                                 </div>

//                                 <input 
//                                     type="file" 
//                                     className={`form-control ${errors.productImage ? 'is-invalid' : ''}`}
//                                     accept="image/*"
//                                     {...register("productImage", { 
//                                         required: "Product image is required", 
//                                         onChange: (e) => handleImageChange(e) 
//                                     })} 
//                                 />
//                                 {errors.productImage && <span className="text-danger small">{errors.productImage.message}</span>}
//                             </div>
//                         </div>
//                     </div>

//                     {/* === STEP 2: Contextual Setup === */}
//                     <div className="mb-5">
//                         <h5 className="border-bottom pb-2 mb-3 text-dark">
//                             <span className="step-number">2</span> Contextual Setup
//                         </h5>
//                         <div className="row g-3">
//                             <div className="col-md-6">
//                                 <label className="form-label">Photoshoot Purpose</label>
//                                 <select className="form-select" {...register("purpose", { required: "Select purpose" })}>
//                                     <option value="">Select Purpose...</option>
//                                     <option value="social_media">Instagram / Social Media</option>
//                                     <option value="ecommerce">E-Commerce Listing</option>
//                                     <option value="advertisement">Paid Advertisement</option>
//                                     <option value="website">Website Hero Banner</option>
//                                 </select>
//                             </div>
//                             <div className="col-md-6">
//                                 <label className="form-label">Industry</label>
//                                 <select className="form-select" {...register("industry")}>
//                                     <option value="fashion">Fashion & Apparel</option>
//                                     <option value="beauty">Beauty & Cosmetics</option>
//                                     <option value="tech">Gadgets & Tech</option>
//                                     <option value="food">Food & Beverage</option>
//                                     <option value="home">Home Decor</option>
//                                 </select>
//                             </div>
//                             <div className="col-12">
//                                 <label className="form-label">Target Audience</label>
//                                 <input type="text" className="form-control" placeholder="e.g. Gen Z shoppers, Luxury buyers" {...register("audience")} />
//                             </div>
//                         </div>
//                     </div>

//                     {/* === STEP 3: Custom Scene Selection === */}
//                     <div className="mb-5">
//                         <h5 className="border-bottom pb-2 mb-3 text-dark">
//                             <span className="step-number">3</span> Custom Scene Selection
//                         </h5>
//                         <div className="mb-3">
//                             <label className="form-label fw-bold"><FaLightbulb className="me-2 text-success"/>Describe the Environment</label>
//                             <textarea 
//                                 className={`form-control ${errors.sceneDescription ? 'is-invalid' : ''}`}
//                                 rows="3" 
//                                 placeholder="E.g., Studio lighting on a clean white backdrop, or placed on a wooden table with sunlight streaming in..."
//                                 {...register("sceneDescription", { required: "Please describe the scene" })}
//                             ></textarea>
//                              {errors.sceneDescription && <span className="text-danger small">{errors.sceneDescription.message}</span>}
//                         </div>
//                     </div>

//                     {/* Submit Button */}
//                     <div className="d-grid gap-2 mt-4">
//                         <button 
//                             type="submit" 
//                             disabled={isSubmitting}
//                             className={`btn btn-theme btn-lg py-3 ${isSubmitting ? 'btn-loading' : ''}`}
//                         >
//                             {isSubmitting ? (
//                                 <>
//                                    <span className="spinner-border spinner-border-sm me-2"></span>
//                                    RENDERING SCENE...
//                                 </>
//                             ) : (
//                                 <>
//                                    <FaLayerGroup className="me-2" /> GENERATE PHOTOSHOOT
//                                 </>
//                             )}
//                         </button>
//                     </div>

//                 </form>
//             )}

//         </div>
//       </div>
//     </div>
//   );
// };

// export default AiPhotoshoot;