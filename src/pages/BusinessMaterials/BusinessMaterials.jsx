import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { FaIdCard, FaCloudUploadAlt, FaListAlt, FaPen, FaCheckCircle, FaDownload, FaRedo } from "react-icons/fa";
// API Import
// import { submitBusinessCard } from '../../services/api';

// CSS Import
import './BusinessMaterials.css';

const BusinessMaterials = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  
  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [generatedMaterial, setGeneratedMaterial] = useState(null);

  // Logo Preview Handler
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) setLogoPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    // Basic validation
    if (!data.logoImage || data.logoImage.length === 0) {
        alert("Please upload your logo!");
        return;
    }

    setIsSubmitting(true);
    
    try {
        const formData = new FormData();
        
        // --- Inputs from Report ---
        formData.append("logoImage", data.logoImage[0]); 
        formData.append("designType", data.designType); 
        formData.append("details", data.details); 

        console.log("Submitting Business Material Request...");

        // --- SIMULATION MODE ---
        setTimeout(() => {
            // Fake Result
            const mockResult = "https://via.placeholder.com/600x400.png?text=Generated+Business+Card";
            setGeneratedMaterial(mockResult); 
            setIsSubmitting(false);
        }, 2500);

        // --- REAL API MODE ---
        /*
        const response = await submitBusinessCard(formData); [cite: 44]
        if (response.data && response.data.image_url) {
            setGeneratedMaterial(response.data.image_url);
        }
        setIsSubmitting(false);
        */

    } catch (error) {
        console.error("Error:", error);
        alert("Error creating marketing material.");
        setIsSubmitting(false);
    }
  };

  const handleReset = () => {
      setGeneratedMaterial(null);
      setLogoPreview(null);
      reset();
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="card shadow-lg border-0">
        
        {/* Header */}
        <div className="card-header bg-theme text-white p-4">
          <h2 className="mb-0 row justify-content-center"><div className='col-12 text-center'><FaIdCard className="me-2"/> Business Materials Creator</div></h2>
          <p className="mb-0 row justify-content-center" style={{ opacity: 0.9 }}>Generate cards, posters, and menus instantly.</p>
        </div>

        <div className="card-body p-4">

            {generatedMaterial ? (
                // === RESULT VIEW ===
                <div className="text-center fade-in py-4">
                    <FaCheckCircle className="text-success mb-3" size={50} />
                    <h3 className="text-success fw-bold mb-3">Design Generated!</h3>
                    <p className="text-muted mb-4">Here is your professional marketing material.</p>
                    
                    <div className="p-2 border rounded bg-light mb-4 d-inline-block shadow-sm">
                        <img src={generatedMaterial} alt="Generated Material" className="img-fluid rounded" style={{maxHeight: "450px"}} />
                    </div>

                    <div className="d-flex justify-content-center gap-3">
                        <a href={generatedMaterial} download="MarketingMaterial.png" className="btn btn-theme btn-lg px-4">
                            <FaDownload className="me-2"/> Download
                        </a>
                        <button onClick={handleReset} className="btn btn-outline-success btn-lg px-4">
                            <FaRedo className="me-2"/> Create New
                        </button>
                    </div>
                </div>
            ) : (
                // === FORM VIEW ===
                <form onSubmit={handleSubmit(onSubmit)}>
                    
                    {/* === Step 1: Logo Upload === */}
                    <div className="mb-5">
                        <h5 className="border-bottom pb-2 mb-3 text-dark">
                            <span className="step-badge">1</span> Upload Logo
                        </h5>
                        <div className="col-md-12">
                            <label className="form-label fw-bold">Brand Logo</label>
                            <div className="logo-upload-box mb-3 text-center text-muted">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Logo Preview" className="preview-img-contain" />
                                ) : (
                                    <div><FaCloudUploadAlt size={40} className="mb-2 text-success"/><p>Click to upload logo</p></div>
                                )}
                            </div>
                            <input 
                                type="file" className={`form-control ${errors.logoImage ? 'is-invalid' : ''}`}
                                accept="image/*"
                                {...register("logoImage", { required: "Logo is required", onChange: handleLogoChange })} 
                            />
                            {errors.logoImage && <span className="text-danger small">{errors.logoImage.message}</span>}
                        </div>
                    </div>

                    {/* === Step 2: Design Type Selection === */}
                    <div className="mb-5">
                        <h5 className="border-bottom pb-2 mb-3 text-dark">
                            <span className="step-badge">2</span> Select Design Type
                        </h5>
                        <div className="col-md-6">
                            <label className="form-label fw-bold"><FaListAlt className="me-2 text-success"/>What do you want to create?</label>
                            <select className="form-select" {...register("designType", { required: "Please select a type" })}>
                                <option value="">Select Option...</option>
                                <option value="business_card">Business Card</option> 
                                <option value="poster">Promotional Poster</option> 
                                <option value="menu">Restaurant Menu</option> 
                                <option value="other">Other Marketing Material</option> 
                            </select>
                            {errors.designType && <span className="text-danger small">{errors.designType.message}</span>}
                        </div>
                    </div>

                    {/* === Step 3: Business Details === */}
                    <div className="mb-5">
                        <h5 className="border-bottom pb-2 mb-3 text-dark">
                            <span className="step-badge">3</span> Business Details
                        </h5>
                        <div className="col-12">
                            <label className="form-label fw-bold"><FaPen className="me-2 text-success"/>Enter Details</label>
                            <textarea 
                                className="form-control" 
                                rows="5" 
                                placeholder="Include Business Name, Phone Number, Email, Address, Slogan, and Services offered..." 
                                {...register("details", { required: "Details are required for the design" })}
                            ></textarea> 
                            <small className="text-muted">Tip: Put all text here exactly as you want it to appear on the card/poster.</small>
                            {errors.details && <span className="text-danger small">{errors.details.message}</span>}
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
                                   <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                   GENERATING MATERIAL...
                                </>
                            ) : (
                                <>
                                    <FaIdCard className="me-2"/> Generate Material
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

export default BusinessMaterials;