import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { FaBoxOpen, FaCloudUploadAlt, FaChartLine, FaPalette, FaDownload, FaRedo } from "react-icons/fa";
// Agar api.js nahi bani to is line ko comment ker dein, code phir bhi chalega (Simulation mode mein)
// import { submitPackageDesign } from '../../services/api';
import { uploadToCloudinary } from '../../services/cloudinary';

// import { submitPackageDesign } from '../../services/jsonapi';
// import { submitPackageDesign } from '../../services/pollingapi';
// import { submitPackageDesign } from '../../services/cloudefix';
import { submitPackageDesign } from '../../services/testingApi';

// CSS Import
import './PackageDesign.css';

const PackageDesign = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  
  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null); // Upload preview
  const [generatedImage, setGeneratedImage] = useState(null); // Final Result Image

  // Image Upload Preview Logic
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Form Submit Logic
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
        // // --- DATA PREPARATION ---
        // const formData = new FormData();
        // formData.append("productDefinition", data.productDefinition);
        
        // // File Handling
        // if (data.customImage && data.customImage[0]) {
        //     formData.append("customImage", data.customImage[0]);
        // }

        // // Optional Fields
        // formData.append("brandName", data.brandName || "");
        // formData.append("productName", data.productName || "");
        // formData.append("slogan", data.slogan || "");
        // formData.append("brandColors", data.brandColors || "");
        // formData.append("designIdeas", data.designIdeas || "");
        // formData.append("targetAudience", data.targetAudience || "");
        // formData.append("region", data.region || "");
        // formData.append("industry", data.industry || "");
        // formData.append("standOut", data.standOut || "");

        // console.log("Sending Data to Backend...");

        // // --- SIMULATION MODE (Testing ke liye) ---
        // // Jab tak Backend ready nahi hai, ye code chalega aur 2 sec baad fake result dikhayega
        // // setTimeout(() => {
        // //     // Fake Backend Response URL
        // //     const mockResponseImage = "https://via.placeholder.com/600x400.png?text=AI+Generated+Package+Design";
            
        // //     setGeneratedImage(mockResponseImage); // Result Show karein
        // //     setIsSubmitting(false); // Loading Stop
            
        // //     // alert("Design Generated! (Simulation Mode)");
        // // }, 2000);

        // // --- REAL API MODE (Jab Backend connect karna ho tab ise uncomment karein) ---


        console.log("Uploading image to Cloudinary...");
        
        // 1. Pehle Image Cloudinary per upload kero
        const imageUrl = await uploadToCloudinary(data.customImage[0]);
        
        if (!imageUrl) {
            alert("Image upload failed");
            setIsSubmitting(false);
            return;
        }

        console.log("Image Uploaded:", imageUrl);

        // 2. Ab Backend ke liye JSON data banao (FormData nahi)
        const payload = {
            imageUrl: imageUrl, // File ki jagah URL gaya
            productDefinition: data.productDefinition,
            brandName: data.brandName,
            productName: data.productName,
            slogan: data.slogan,
            brandColors: data.brandColors,
            designIdeas: data.designIdeas,
            targetAudience: data.targetAudience,
            region: data.region,
            industry: data.industry,
            standOut: data.standOut
        };
        
        const response = await submitPackageDesign(payload);
        console.log("Backend Response:", response);
        // if (response.data && response.data.image_url) {
        //      setGeneratedImage(response.data.image_url);
        // }

        // if (response && response.image_url) {
        //     setGeneratedImage(response.image_url);
        // }
        let finalImageUrl = null;

        if (response) {
            // const imageUrl = response.data.split("=")[1].trim();
            // console.log(imageUrl);

            // finalImageUrl = imageUrl;
            // Try different possible structures
            finalImageUrl = response.image_url           // Direct: {image_url: "..."}
                         || response?.result?.image_url  // Nested: {result: {image_url: "..."}}
                         || response?.data?.image_url
                         || response?.data?.url;   // API wrapper: {data: {image_url: "..."}};   // API wrapper: {data: {image_url: "..."}}
        }

        if (finalImageUrl) {
            console.log("✅ Final Image URL:", finalImageUrl);
            setGeneratedImage(finalImageUrl);
        } else {
            console.error("❌ No image URL found in response:", response);
            alert("Design generated but image URL not found. Please try again.");
        }


        
        // const imageBlob = response.data;
        //     const imageUrl = URL.createObjectURL(imageBlob);
        //     setGeneratedImage(imageUrl);
        setIsSubmitting(false);
        

    } catch (error) {
        console.error("Error submitting form:", error);
        alert("Error connecting to server.");
        setIsSubmitting(false);
    }
  };

  // Reset Function (New Design banane ke liye)
  const handleReset = () => {
      setGeneratedImage(null); // Result hatao
      setImagePreview(null);   // Upload preview hatao
      reset();                 // Inputs clear karo
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="card shadow-lg border-0">
        
        {/* Header - Always Visible */}
        <div className="card-header bg-theme text-white p-4 ">
          <h2 className="mb-0  row justify-content-center "><div className='col-12 text-center'><FaBoxOpen className="me-2 "/>AI Package Design Studio</div> </h2>
          <p className="mb-0 row justify-content-center" style={{ opacity: 0.9 }}>Define your product and let AI create the magic.</p>
        </div>

        <div className="card-body p-4">

            {/* === CONDITIONAL RENDERING === */}
            {/* Agar Result aa gaya hai to Result dikhao, nahi to Form dikhao */}
            
            {generatedImage ? (
                // ---------------- RESULT VIEW ----------------
                <div className="text-center fade-in py-4">
                    <h3 className="text-success fw-bold mb-3">🎉 Design Generated Successfully!</h3>
                    <p className="text-muted mb-4">Here is your AI generated packaging design concept.</p>
                    
                    {/* Final Image */}
                    <div className="p-2 border rounded bg-light mb-4 d-inline-block shadow-sm">
                        <img 
                            src={generatedImage} 
                            alt="AI Result" 
                            className="img-fluid rounded" 
                            style={{maxHeight: "450px", width: "auto"}} 
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex justify-content-center gap-3">
                        <a href={generatedImage} download="MyPackageDesign.png" className="btn btn-theme btn-lg px-4">
                            <FaDownload className="me-2"/> Download Image
                        </a>
                        <button onClick={handleReset} className="btn btn-outline-success btn-lg px-4">
                            <FaRedo className="me-2"/> Create New Design
                        </button>
                    </div>
                </div>

            ) : (
                // ---------------- FORM VIEW ----------------
                <form onSubmit={handleSubmit(onSubmit)}>
                    
                   

                    {/* === STEP 1: Product Definition === */}
                    <div className="mb-5">
                        <h4 className="border-bottom pb-2 mb-3">
                            <span className="badge section-badge me-2">1</span> Product Definition
                        </h4>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Describe your product</label>
                            <textarea 
                                className={`form-control ${errors.productDefinition ? 'is-invalid' : ''}`}
                                rows="3" 
                                placeholder="E.g., An organic coffee brand targeting young professionals..."
                                {...register("productDefinition", { required: "Description is required" })}
                            ></textarea>
                            {errors.productDefinition && <span className="text-danger small">{errors.productDefinition.message}</span>}
                        </div>
                    </div>

                    {/* === STEP 2: Reference Upload (ONLY OPTION) === */}
                    <div className="mb-5">
                        <h4 className="border-bottom pb-2 mb-3">
                            <span className="badge section-badge me-2">2</span> Upload Reference Design
                        </h4>
                        
                        <div className="row">
                            <div className="col-md-12">
                                <label className="form-label fw-bold">Upload a sketch or inspiration image</label>
                                
                                {/* Preview Box */}
                                <div className="preview-box mb-3 text-center text-muted">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="preview-img" />
                                    ) : (
                                        <div>
                                            <FaCloudUploadAlt size={40} className="mb-2 text-success" />
                                            <p className="mb-0">Click below to upload reference</p>
                                        </div>
                                    )}
                                </div>

                                {/* File Input */}
                                <input 
                                    type="file" 
                                    className={`form-control ${errors.customImage ? 'is-invalid' : ''}`}
                                    accept="image/*"
                                    {...register("customImage", { 
                                        required: "Please upload a reference image", 
                                        onChange: (e) => handleImageChange(e) 
                                    })} 
                                />
                                {errors.customImage && <span className="text-danger small">{errors.customImage.message}</span>}
                            </div>
                        </div>
                    </div>

                    {/* === STEP 3: Branding Specifics === */}
                    <div className="mb-5">
                        <h4 className="border-bottom pb-2 mb-3">
                            <span className="badge section-badge me-2">3</span> Branding Specifics
                        </h4>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Brand Name</label>
                                <input type="text" className="form-control" placeholder="My Brand" {...register("brandName")} />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Product Name</label>
                                <input type="text" className="form-control" placeholder="Premium Coffee" {...register("productName")} />
                            </div>
                            <div className="col-12 mb-3">
                                <label className="form-label">Slogan / Tagline</label>
                                <input type="text" className="form-control" placeholder="Taste the difference" {...register("slogan")} />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label"><FaPalette className="me-1"/> Brand Colors & Styles</label>
                                <input type="text" className="form-control" placeholder="e.g., Gold and Black, Minimalist" {...register("brandColors")} />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Specific Design Ideas</label>
                                <input type="text" className="form-control" placeholder="e.g., Use leaf patterns" {...register("designIdeas")} />
                            </div>
                        </div>
                    </div>

                    {/* === STEP 4: Market Strategy === */}
                    <div className="mb-5">
                        <h4 className="border-bottom pb-2 mb-3">
                            <span className="badge section-badge me-2">4</span> Market Strategy <span className="text-muted fs-6">(Optional)</span>
                        </h4>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label"><FaChartLine className="me-1"/> Target Audience</label>
                                <input type="text" className="form-control" placeholder="e.g., Teenagers, Professionals" {...register("targetAudience")} />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Region</label>
                                <input type="text" className="form-control" placeholder="e.g., USA, Asia, Global" {...register("region")} />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Industry</label>
                                <select className="form-select" {...register("industry")}>
                                    <option value="">Select Industry...</option>
                                    <option value="food">Food & Beverage</option>
                                    <option value="cosmetics">Cosmetics</option>
                                    <option value="electronics">Electronics</option>
                                    <option value="clothing">Clothing</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">How to Stand Out?</label>
                                <input type="text" className="form-control" placeholder="e.g., Eco-friendly packaging" {...register("standOut")} />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="d-grid gap-2">
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className={`btn btn-theme btn-lg py-3 ${isSubmitting ? 'btn-loading' : ''}`}
                        >
                            {isSubmitting ? (
                                <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                GENERATING DESIGN...
                                </>
                            ) : (
                                <>
                                    <FaBoxOpen className="me-2"/> GENERATE DESIGN
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

export default PackageDesign;