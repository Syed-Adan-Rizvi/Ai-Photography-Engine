import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { FaPenNib, FaUsers, FaPalette, FaLightbulb, FaDownload, FaRedo, FaCheckCircle } from "react-icons/fa";
// API service import (Jab backend ready ho tab uncomment karein)
// import { submitLogoDesign } from '../../services/api'; 
import { submitLogoDesign } from '../../services/cloudefix';

// CSS Import
import './LogoDesign.css';

const LogoDesign = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  
  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedLogo, setGeneratedLogo] = useState(null); // Result store karne ke liye

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
        console.log("Submitting Logo Request:", data);

        // --- SIMULATION MODE (Testing ke liye) ---
        // setTimeout(() => {
        //     // Fake Backend Response
        //     const mockLogoUrl = "https://via.placeholder.com/500x500.png?text=AI+Generated+Logo";
            
        //     setGeneratedLogo(mockLogoUrl); // Result state update
        //     setIsSubmitting(false);
        // }, 2000);

        // --- REAL API MODE (Backend connect karne ke liye) ---
        
        const response = await submitLogoDesign(data); // Logo design JSON bhejta hai (FormData nahi)
        // if (response.data && response.data.image_url) {
        //      setGeneratedLogo(response.data.image_url);
        // }
        // const imageBlob = response.data;
        //     const imageUrl = URL.createObjectURL(imageBlob);
        //     setGeneratedLogo(imageUrl);
        // setIsSubmitting(false);
        console.log("Backend Response:", response);
        let finalImageUrl = null;

        if (response) {
            // Try different possible structures
            finalImageUrl = response.image_url           // Direct: {image_url: "..."}
                         || response?.result?.image_url  // Nested: {result: {image_url: "..."}}
                         || response?.data?.image_url;   // API wrapper: {data: {image_url: "..."}}
        }

        if (finalImageUrl) {
            console.log("✅ Final Image URL:", finalImageUrl);
            setGeneratedLogo(finalImageUrl);
        } else {
            console.error("❌ No image URL found in response:", response);
            alert("Design generated but image URL not found. Please try again.");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Error generating logo.");
        setIsSubmitting(false);
    }
  };

  // Reset Function (New Logo banane ke liye)
  const handleReset = () => {
      setGeneratedLogo(null);
      reset();
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="card shadow-lg border-0">
        
        {/* Header */}
        <div className="card-header bg-theme text-white p-4">
          <h2 className="mb-0 row justify-content-center"><div className='col-12 text-center'><FaPenNib className="me-2"/> AI Logo Creator</div></h2>
          <p className="mb-0 row justify-content-center" style={{ opacity: 0.9 }}>Build a distinct brand identity in seconds.</p>
        </div>

        <div className="card-body p-4">
            
            {/* === CONDITIONAL RENDERING === */}
            
            {generatedLogo ? (
                // ---------------- RESULT VIEW ----------------
                <div className="text-center fade-in py-4">
                    <FaCheckCircle className="text-success mb-3" size={50} />
                    <h3 className="text-success fw-bold mb-3">Logo Concepts Ready!</h3>
                    <p className="text-muted mb-4">Based on your requirements, here is your unique brand identity.</p>
                    
                    {/* Final Image */}
                    <div className="result-container mb-4 shadow-sm">
                        <img 
                            src={generatedLogo} 
                            alt="Generated Logo" 
                            className="img-fluid rounded" 
                            style={{maxHeight: "400px", width: "auto"}} 
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex justify-content-center gap-3">
                        <a href={generatedLogo} download="MyLogo.png" className="btn btn-theme btn-lg px-4">
                            <FaDownload className="me-2"/> Download Logo
                        </a>
                        <button onClick={handleReset} className="btn btn-outline-success btn-lg px-4">
                            <FaRedo className="me-2"/> Create New
                        </button>
                    </div>
                </div>

            ) : (
                // ---------------- FORM VIEW ----------------
                <form onSubmit={handleSubmit(onSubmit)}>
                    
                   
                    

                    {/* === STEP 1: Initial Concept === */}
                    <div className="mb-5">
                        <h5 className="border-bottom pb-2 mb-3 text-dark">
                            <span className="step-badge">1</span> Initial Concept
                        </h5>
                        <div className="mb-3">
                            <label className="form-label fw-bold"><FaLightbulb className="me-2 text-success"/>Product Information</label>
                            <textarea 
                                className={`form-control ${errors.productInfo ? 'is-invalid' : ''}`}
                                rows="2" 
                                placeholder="What is the product or service? (e.g., A mobile app for fitness tracking)"
                                {...register("productInfo", { required: "Product info is required" })}
                            ></textarea>
                             {errors.productInfo && <span className="text-danger small">{errors.productInfo.message}</span>}
                        </div>
                    </div>

                    {/* === STEP 2: Brand Identity === */}
                    <div className="mb-5">
                        <h5 className="border-bottom pb-2 mb-3 text-dark">
                            <span className="step-badge">2</span> Brand Identity
                        </h5>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Brand Name</label>
                                <input type="text" className="form-control" placeholder="e.g. SnapFit" {...register("brandName", { required: "Required" })} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Industry</label>
                                <select className="form-select" {...register("industry", { required: "Select Industry" })}>
                                    <option value="">Select...</option>
                                    <option value="tech">Technology</option>
                                    <option value="fashion">Fashion</option>
                                    <option value="food">Food & Beverage</option>
                                    <option value="health">Health & Wellness</option>
                                    <option value="realestate">Real Estate</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="col-12">
                                <label className="form-label">Core Mission (Optional)</label>
                                <textarea className="form-control" rows="2" placeholder="e.g. To make fitness accessible for everyone" {...register("mission")}></textarea>
                            </div>
                        </div>
                    </div>

                    {/* === STEP 3: Audience Persona === */}
                    <div className="mb-5">
                        <h5 className="border-bottom pb-2 mb-3 text-dark">
                            <span className="step-badge">3</span> Audience Persona
                        </h5>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label"><FaUsers className="me-2 text-success"/>Target Audience</label>
                                <input type="text" className="form-control" placeholder="e.g. Gen Z, Corporate Professionals" {...register("audience", { required: "Required" })} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Emotional Response</label>
                                <select className="form-select" {...register("emotion")}>
                                    <option value="trust">Trust & Professionalism</option>
                                    <option value="excitement">Excitement & Energy</option>
                                    <option value="luxury">Luxury & Elegance</option>
                                    <option value="friendly">Friendly & Playful</option>
                                    <option value="innovation">Innovation & Tech</option>
                                </select>
                            </div>
                        </div>
                    </div>

                     {/* === STEP 4: Stylistic Preferences === */}
                     <div className="mb-5">
                        <h5 className="border-bottom pb-2 mb-3 text-dark">
                            <span className="step-badge">4</span> Stylistic Preferences
                        </h5>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label"><FaPalette className="me-2 text-success"/>Brand Colors</label>
                                <input type="text" className="form-control" placeholder="e.g. Blue and White, or Hex codes" {...register("colors")} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Additional Instructions</label>
                                <input type="text" className="form-control" placeholder="e.g. Minimalist, Vintage style" {...register("instructions")} />
                            </div>
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
                                   GENERATING LOGO CONCEPTS...
                                </>
                            ) : (
                                <>
                                    <FaPenNib className="me-2"/>
                                    GENERATE LOGO CONCEPTS
                                    
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

export default LogoDesign;