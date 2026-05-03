import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { FaSwatchbook, FaCloudUploadAlt, FaPalette, FaCheckCircle, FaDownload, FaRedo } from "react-icons/fa";
// API Import
// import { submitBrandMoodboard } from '../../services/api';
import{ submitBrandMoodboard } from '../../services/testingApi';

// CSS Import
import './BrandMoodboard.css';

const BrandMoodboard = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  
  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null); // Optional Logo Preview
  const [generatedMoodboard, setGeneratedMoodboard] = useState(null); // Result

  // Logo Preview Logic
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
        const formData = new FormData();
        
        // --- Required Fields ---
        formData.append("brandName", data.brandName);
        formData.append("industry", data.industry);
        formData.append("description", data.description);
        formData.append("targetCustomer", data.targetCustomer);
        formData.append("emotion", data.emotion);
        
        // --- Optional Fields ---
        formData.append("brandColors", data.brandColors || "");
        
        if (data.brandLogo && data.brandLogo[0]) {
            formData.append("brandLogo", data.brandLogo[0]);
        }

        console.log("Submitting Moodboard Request...");

        // --- SIMULATION MODE ---
        // setTimeout(() => {
        //     const mockResult = "https://via.placeholder.com/800x600.png?text=AI+Generated+Brand+Moodboard";
        //     setGeneratedMoodboard(mockResult);
        //     setIsSubmitting(false);
        // }, 2000);

        // --- REAL API MODE (Uncomment later) ---
        
        const response = await submitBrandMoodboard(formData);
        // if (response.data && response.data.image_url) {
        //     setGeneratedMoodboard(response.data.image_url);
        // }
            const imageBlob = response.data;
            const imageUrl = URL.createObjectURL(imageBlob);
            setGeneratedMoodboard(imageUrl);
            setIsSubmitting(false);
        

    } catch (error) {
        console.error("Error:", error);
        alert("Error generating moodboard.");
        setIsSubmitting(false);
    }
  };

  const handleReset = () => {
      setGeneratedMoodboard(null);
      setLogoPreview(null);
      reset();
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="card shadow-lg border-0">
        
        {/* Header */}
        <div className="card-header bg-theme text-white p-4">
          <h2 className="mb-0 row justify-content-center"><div className='col-12 text-center'><FaSwatchbook className="me-2"/> Brand Moodboard Generator</div></h2>
          <p className="mb-0 row justify-content-center" style={{ opacity: 0.9 }}>Visualize your brand's personality, colors, and vibe.</p>
        </div>

        <div className="card-body p-4">

            {generatedMoodboard ? (
                // === RESULT VIEW ===
                <div className="text-center fade-in py-4">
                    <FaCheckCircle className="text-success mb-3" size={50} />
                    <h3 className="text-success fw-bold mb-3">Moodboard Ready!</h3>
                    <p className="text-muted mb-4">Here is the visual direction for your brand.</p>
                    
                    <div className="p-2 border rounded bg-light mb-4 d-inline-block shadow-sm">
                        <img src={generatedMoodboard} alt="Moodboard Result" className="img-fluid rounded" style={{maxHeight: "500px"}} />
                    </div>

                    <div className="d-flex justify-content-center gap-3">
                        <a href={generatedMoodboard} download="BrandMoodboard.png" className="btn btn-theme btn-lg px-4">
                            <FaDownload className="me-2"/> Download Image
                        </a>
                        <button onClick={handleReset} className="btn btn-outline-success btn-lg px-4">
                            <FaRedo className="me-2"/> Create New
                        </button>
                    </div>
                </div>
            ) : (
                // === FORM VIEW ===
                <form onSubmit={handleSubmit(onSubmit)}>
                    
                    {/* === STEP 1: Core Identity === */}
                    <div className="mb-5">
                        <h5 className="border-bottom pb-2 mb-3 text-dark">
                            <span className="step-badge">1</span> Core Identity
                        </h5>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Brand Name</label>
                                <input type="text" className="form-control" placeholder="e.g. EcoLife" {...register("brandName", { required: "Brand Name is required" })} />
                                {errors.brandName && <span className="text-danger small">{errors.brandName.message}</span>}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Industry</label>
                                <select className="form-select" {...register("industry", { required: "Industry is required" })}>
                                    <option value="">Select...</option>
                                    <option value="fashion">Fashion</option>
                                    <option value="tech">Technology</option>
                                    <option value="food">Food & Beverage</option>
                                    <option value="health">Health & Wellness</option>
                                    <option value="lifestyle">Lifestyle</option>
                                </select>
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-bold">What does the brand do?</label>
                                <textarea 
                                    className="form-control" 
                                    rows="3" 
                                    placeholder="Brief description (e.g., We sell sustainable bamboo products...)"
                                    {...register("description", { required: "Description is required" })}
                                ></textarea>
                                {errors.description && <span className="text-danger small">{errors.description.message}</span>}
                            </div>
                        </div>
                    </div>

                    {/* === STEP 2: Vibe & Audience === */}
                    <div className="mb-5">
                        <h5 className="border-bottom pb-2 mb-3 text-dark">
                            <span className="step-badge">2</span> Vibe & Audience
                        </h5>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Target Customer</label>
                                <input type="text" className="form-control" placeholder="e.g. Young urban professionals" {...register("targetCustomer", { required: "Required" })} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Desired Emotional Feeling</label>
                                <select className="form-select" {...register("emotion", { required: "Required" })}>
                                    <option value="">Select Vibe...</option>
                                    <option value="minimalist">Minimalist & Clean</option>
                                    <option value="luxury">Luxury & Premium</option>
                                    <option value="playful">Playful & Fun</option>
                                    <option value="trustworthy">Trustworthy & Corporate</option>
                                    <option value="energetic">Energetic & Bold</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* === STEP 3: Visual Elements === */}
                    <div className="mb-5">
                        <h5 className="border-bottom pb-2 mb-3 text-dark">
                            <span className="step-badge">3</span> Visual Elements <span className="text-muted small fw-normal">(Optional)</span>
                        </h5>
                        
                        <div className="row g-4">
                            <div className="col-md-6">
                                <label className="form-label fw-bold"><FaPalette className="me-2 text-success"/>Brand Colors</label>
                                <input type="text" className="form-control mb-2" placeholder="e.g. Earthy tones, Green and Brown" {...register("brandColors")} />
                                <small className="text-muted">Leave blank if you want AI to suggest colors.</small>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-bold">Upload Existing Logo</label>
                                <div className="logo-upload-box mb-2 text-center text-muted">
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Logo Preview" className="preview-img-small" />
                                    ) : (
                                        <div><FaCloudUploadAlt size={30} className="mb-1"/><p className="small mb-0">Upload Logo (if any)</p></div>
                                    )}
                                </div>
                                <input 
                                    type="file" className="form-control form-control-sm"
                                    accept="image/*"
                                    {...register("brandLogo", {  required: "Required" ,onChange: handleLogoChange })} 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button WITH SPINNER */}
                    <div className="d-grid gap-2">
                        <button 
                            type="submit" 
                            disabled={isSubmitting} 
                            className={`btn btn-theme btn-lg py-3 ${isSubmitting ? 'btn-loading' : ''}`}
                        >
                            {isSubmitting ? (
                                <>
                                   {/* Spinner Added Here */}
                                   <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                   GENERATING MOODBOARD...
                                </>
                            ) : (
                                <>
                                    <FaSwatchbook className="me-2"/> Generate Moodboard 
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

export default BrandMoodboard;