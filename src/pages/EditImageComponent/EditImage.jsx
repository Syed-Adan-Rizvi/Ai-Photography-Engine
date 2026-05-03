import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { FaImage, FaMagic, FaCloudUploadAlt, FaEdit, FaCheckCircle, FaDownload, FaRedo } from "react-icons/fa";
import { submitEditImage } from '../../services/cloudefix';
import { uploadToCloudinary } from '../../services/cloudinary';
import './EditImage.css';

const EditImage = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [editedImage, setEditedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ✅ DOWNLOAD FUNCTION
  const handleDownload = async (imageUrl, filename) => {
    try {
        console.log("📥 Starting download...");
        
        const response = await fetch(imageUrl);
        
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        
        console.log("✅ Download successful!");
        
    } catch (error) {
        console.error("❌ Download error:", error);
        
        // Fallback: Try Cloudinary fl_attachment
        let downloadUrl = imageUrl;
        if (imageUrl.includes('cloudinary.com') && !imageUrl.includes('fl_attachment')) {
            downloadUrl = imageUrl.replace('/upload/', '/upload/fl_attachment/');
        }
        
        window.open(downloadUrl, '_blank');
        alert("Direct download failed. Image opened in new tab. Please right-click and select 'Save Image As'.");
    }
  };

  const onSubmit = async (data) => {
    if (!data.image || data.image.length === 0) {
        alert("❌ Please upload an image first!");
        return;
    }

    setIsSubmitting(true);
    
    try {
        console.log("📤 Submitting Edit Request...");

        // ✅ 1. Upload to Cloudinary
        console.log("☁️ Uploading image to Cloudinary...");
        const imageUrl = await uploadToCloudinary(data.image[0]);
        
        if (!imageUrl) {
            alert("❌ Image upload failed. Please try again.");
            setIsSubmitting(false);
            return;
        }

        // ✅ Validate URL
        if (!imageUrl.startsWith('http')) {
            alert("❌ Invalid image URL format");
            setIsSubmitting(false);
            return;
        }

        console.log("✅ Image Uploaded:", imageUrl);

        // ✅ 2. Create JSON payload (NOT FormData)
        const payload = {
            imageUrl: imageUrl,  // Cloudinary URL
            instructions: data.instructions?.trim() || "Edit this image"
        };

        // ✅ Debug log
        console.log("📦 Payload:", JSON.stringify(payload, null, 2));

        // ✅ 3. Submit to backend
        const response = await submitEditImage(payload);
        
        console.log("📥 Backend Response:", response);

        // ✅ 4. Handle different response structures
        let finalImageUrl = null;

        if (response) {
            finalImageUrl = response.image_url           
                         || response?.result?.image_url  
                         || response?.data?.image_url;
        }

        if (finalImageUrl) {
            console.log("✅ Final Image URL:", finalImageUrl);
            setEditedImage(finalImageUrl);
        } else {
            console.error("❌ No image URL found in response:", response);
            alert("❌ Image edited but URL not found. Please try again.");
        }

        setIsSubmitting(false);

    } catch (error) {
        console.error("❌ Submission Error:", error);
        
        // ✅ Detailed error handling
        if (error.response) {
            console.error("Backend Error:", error.response.data);
            
            if (error.response.status === 422) {
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
      setEditedImage(null);
      setImagePreview(null);
      reset();
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="card shadow-lg border-0">
        
        <div className="card-header bg-theme text-white p-4">
          <h2 className="mb-0 row justify-content-center">
            <div className='col-12 text-center'>
              <FaImage className="me-2"/> Smart Image Editor
            </div>
          </h2>
          <p className="mb-0 row justify-content-center" style={{ opacity: 0.9 }}>
            Upload an image and describe the magic you want.
          </p>
        </div>

        <div className="card-body p-4">

            {editedImage ? (
                <div className="text-center fade-in py-4">
                    <FaCheckCircle className="text-success mb-3" size={50} />
                    <h3 className="text-success fw-bold mb-3">Magic Applied Successfully!</h3>
                    <p className="text-muted mb-4">Your image has been processed based on your instructions.</p>
                    
                    <div className="result-container mb-4 shadow-sm">
                        <img 
                            src={editedImage} 
                            alt="Edited Result" 
                            className="img-fluid rounded" 
                            style={{maxHeight: "450px", width: "auto"}} 
                        />
                    </div>

                    {/* ✅ IMPROVED Download Button */}
                    <div className="d-flex justify-content-center gap-3">
                        <button 
                            onClick={() => handleDownload(editedImage, "EditedImage.png")}
                            className="btn btn-theme btn-lg px-4"
                        >
                            <FaDownload className="me-2"/> Download Image
                        </button>
                        <button onClick={handleReset} className="btn btn-outline-success btn-lg px-4">
                            <FaRedo className="me-2"/> Edit Another
                        </button>
                    </div>
                </div>

            ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    
                    {/* STEP 1: Source Input */}
                    <div className="mb-5">
                        <h5 className="border-bottom pb-2 mb-3 text-dark">
                            <span className="badge bg-theme me-2">1</span> Source Input
                        </h5>
                        
                        <div className="row">
                            <div className="col-md-12">
                                <label className="form-label fw-bold">Upload Original Image *</label>
                                
                                <div className="image-preview-box mb-3 text-center text-muted">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="preview-img" />
                                    ) : (
                                        <div>
                                            <FaCloudUploadAlt size={50} className="mb-2 text-success" />
                                            <p className="mb-0">Click or Drop image here</p>
                                        </div>
                                    )}
                                </div>

                                <input 
                                    type="file" 
                                    className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                                    accept="image/*"
                                    {...register("image", { 
                                        required: "Image is required", 
                                        onChange: (e) => handleImageChange(e) 
                                    })} 
                                />
                                {errors.image && <span className="text-danger small">{errors.image.message}</span>}
                            </div>
                        </div>
                    </div>

                    {/* STEP 2: Modification Details */}
                    <div className="mb-5">
                        <h5 className="border-bottom pb-2 mb-3 text-dark">
                            <span className="badge bg-theme me-2">2</span> Modification Details
                        </h5>
                        <div className="mb-3">
                            <label className="form-label fw-bold">
                                <FaEdit className="me-2 text-success"/>Describe Changes *
                            </label>
                            <textarea 
                                className={`form-control ${errors.instructions ? 'is-invalid' : ''}`}
                                rows="4" 
                                placeholder="E.g., Change the background to a beach sunset, remove the object on the left, make the colors more vibrant..."
                                {...register("instructions", { required: "Please describe the changes" })}
                            ></textarea>
                            {errors.instructions && <span className="text-danger small">{errors.instructions.message}</span>}
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
                                   PROCESSING IMAGE... (This may take 20-30 seconds)
                                </>
                            ) : (
                                <>
                                   <FaMagic className="me-2" /> APPLY CHANGES
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

export default EditImage;






























// import React, { useState } from 'react';
// import { useForm } from "react-hook-form";
// import { FaImage, FaMagic, FaCloudUploadAlt, FaEdit, FaCheckCircle, FaDownload, FaRedo } from "react-icons/fa";
// // API Service Import (Uncomment when backend is ready)
// // import { submitEditImage } from '../../services/api';
// import { submitEditImage } from '../../services/cloudefix';
// import { uploadToCloudinary } from '../../services/cloudinary';

// // CSS Import
// import './EditImage.css';

// const EditImage = () => {
//   const { register, handleSubmit, formState: { errors }, reset } = useForm();
  
//   // States
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [imagePreview, setImagePreview] = useState(null); // Upload Preview
//   const [editedImage, setEditedImage] = useState(null);   // Final Result

//   // Handle Image Upload Preview
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const onSubmit = async (data) => {
//     if (!data.image || data.image.length === 0) {
//         alert("Please upload an image first!");
//         return;
//     }

//     setIsSubmitting(true);
    
//     try {
//         const formData = new FormData();
//         formData.append("image", data.image[0]);
//         formData.append("instructions", data.instructions);

//         console.log("Submitting Edit Request...");

//         // --- SIMULATION MODE (Testing ke liye) ---
//         // setTimeout(() => {
//         //     // Fake Backend Response (Maan lo ye edited image hai)
//         //     const mockEditedImage = "https://via.placeholder.com/600x400.png?text=Edited+Image+Result";
            
//         //     setEditedImage(mockEditedImage); // Result Show karo
//         //     setIsSubmitting(false);
//         // }, 2000);

//         // --- REAL API MODE ---
        
//         const response = await submitEditImage(formData);
//         // if (response.data && response.data.image_url) {
//         //     setEditedImage(response.data.image_url);
//         // }
//         const imageBlob = response.data;
//             const imageUrl = URL.createObjectURL(imageBlob);
//             setEditedImage(imageUrl);
//         setIsSubmitting(false);
        

//     } catch (error) {
//         console.error("Error:", error);
//         alert("Error processing image.");
//         setIsSubmitting(false);
//     }
//   };

//   // Reset Function
//   const handleReset = () => {
//       setEditedImage(null);
//       setImagePreview(null);
//       reset();
//   };

//   return (
//     <div className="container mt-4 mb-5">
//       <div className="card shadow-lg border-0">
        
//         {/* Header */}
//         <div className="card-header bg-theme text-white p-4">
//           <h2 className="mb-0 row justify-content-center"><div className='col-12 text-center'><FaImage className="me-2"/> Smart Image Editor</div></h2>
//           <p className="mb-0 row justify-content-center" style={{ opacity: 0.9 }}>Upload an image and describe the magic you want.</p>
//         </div>

//         <div className="card-body p-4">

//             {/* === CONDITIONAL RENDERING === */}
            
//             {editedImage ? (
//                 // ---------------- RESULT VIEW ----------------
//                 <div className="text-center fade-in py-4">
//                     <FaCheckCircle className="text-success mb-3" size={50} />
//                     <h3 className="text-success fw-bold mb-3">Magic Applied Successfully!</h3>
//                     <p className="text-muted mb-4">Your image has been processed based on your instructions.</p>
                    
//                     {/* Final Image */}
//                     <div className="result-container mb-4 shadow-sm">
//                         <img 
//                             src={editedImage} 
//                             alt="Edited Result" 
//                             className="img-fluid rounded" 
//                             style={{maxHeight: "450px", width: "auto"}} 
//                         />
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="d-flex justify-content-center gap-3">
//                         <a href={editedImage} download="EditedImage.png" className="btn btn-theme btn-lg px-4">
//                             <FaDownload className="me-2"/> Download Image
//                         </a>
//                         <button onClick={handleReset} className="btn btn-outline-success btn-lg px-4">
//                             <FaRedo className="me-2"/> Edit Another
//                         </button>
//                     </div>
//                 </div>

//             ) : (
//                 // ---------------- FORM VIEW ----------------
//                 <form onSubmit={handleSubmit(onSubmit)}>
                    
//                     {/* === STEP 1: Source Input (Image Upload) === */}
//                     <div className="mb-5">
//                         <h5 className="border-bottom pb-2 mb-3 text-dark">
//                             <span className="badge bg-theme me-2">1</span> Source Input
//                         </h5>
                        
//                         <div className="row">
//                             <div className="col-md-12">
//                                 <label className="form-label fw-bold">Upload Original Image</label>
                                
//                                 {/* Custom Preview Box */}
//                                 <div className="image-preview-box mb-3 text-center text-muted">
//                                     {imagePreview ? (
//                                         <img src={imagePreview} alt="Preview" className="preview-img" />
//                                     ) : (
//                                         <div>
//                                             <FaCloudUploadAlt size={50} className="mb-2 text-success" />
//                                             <p className="mb-0">Click or Drop image here</p>
//                                         </div>
//                                     )}
//                                 </div>

//                                 <input 
//                                     type="file" 
//                                     className={`form-control ${errors.image ? 'is-invalid' : ''}`}
//                                     accept="image/*"
//                                     {...register("image", { 
//                                         required: "Image is required", 
//                                         onChange: (e) => handleImageChange(e) 
//                                     })} 
//                                 />
//                                 {errors.image && <span className="text-danger small">{errors.image.message}</span>}
//                             </div>
//                         </div>
//                     </div>

//                     {/* === STEP 2: Description (Prompt) === */}
//                     <div className="mb-5">
//                         <h5 className="border-bottom pb-2 mb-3 text-dark">
//                             <span className="badge bg-theme me-2">2</span> Modification Details
//                         </h5>
//                         <div className="mb-3">
//                             <label className="form-label fw-bold"><FaEdit className="me-2 text-success"/>Describe Changes</label>
//                             <textarea 
//                                 className={`form-control ${errors.instructions ? 'is-invalid' : ''}`}
//                                 rows="4" 
//                                 placeholder="E.g., Change the background to a beach sunset, remove the object on the left, make the colors more vibrant..."
//                                 {...register("instructions", { required: "Please describe the changes" })}
//                             ></textarea>
//                              {errors.instructions && <span className="text-danger small">{errors.instructions.message}</span>}
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
//                                    PROCESSING IMAGE...
//                                 </>
//                             ) : (
//                                 <>
//                                    <FaMagic className="me-2" /> APPLY CHANGES
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

// export default EditImage;