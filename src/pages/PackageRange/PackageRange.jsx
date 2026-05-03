import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaShapes,
  FaUpload,
  FaDownload,
  FaRedo,
  FaCheckCircle,
} from "react-icons/fa";

import { submitPackageRange } from "../../services/testingApi";
import "./PackageRange.css";

const PackageRange = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [generatedRange, setGeneratedRange] = useState([]); // 🔥 MULTIPLE IMAGES

  // Image Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    // Checkbox validation
    if (
      !data.boxPackaging &&
      !data.wrapperPackaging &&
      !data.glassPackaging
    ) {
      alert("Please select at least one packaging type!");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("customImage", data.productImage[0]);
      formData.append("boxPackaging", data.boxPackaging || false);
      formData.append("wrapperPackaging", data.wrapperPackaging || false);
      formData.append("glassPackaging", data.glassPackaging || false);

      console.log("Submitting Package Range...");

      const response = await submitPackageRange(formData);
      console.log(response.data);


      if (!response.data || !response.data.images) {
        throw new Error("Invalid response from server");
      }

      setGeneratedRange(response.data.images);
    } catch (error) {
      console.error("Error:", error);
      alert("Error generating package range.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setGeneratedRange([]);
    setImagePreview(null);
    reset();
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="card shadow-lg border-0">
        {/* HEADER */}
        <div className="card-header bg-theme text-white p-4">
          <h2 className="mb-0 row justify-content-center">
            <div className="col-12 text-center"><FaShapes className="me-2" /> Package Range Generator</div>
            
          </h2>
          <p className="mb-0 row justify-content-center" style={{ opacity: 0.9 }}>
            Generate your product in multiple packaging styles.
          </p>
        </div>

        <div className="card-body p-4">
          {generatedRange.length > 0 ? (
            // ================= RESULT VIEW =================
            <div className="text-center fade-in py-4">
              <FaCheckCircle
                className="text-success mb-3"
                size={50}
              />
              <h3 className="text-success fw-bold mb-3">
                Packaging Range Ready!
              </h3>

              <div className="row g-3">
                {generatedRange.map((img, index) => (
                  <div key={index} className="col-md-6">
                    <div className="border rounded p-2 bg-light shadow-sm">
                      <img
                        src={img}
                        alt={`Packaging ${index + 1}`}
                        className="img-fluid rounded"
                        style={{
                          maxHeight: "300px",
                          objectFit: "contain",
                        }}
                      />
                      <a
                        href={img}
                        download={`PackageRange-${index + 1}.png`}
                        className="btn btn-theme btn-sm w-100 mt-2"
                      >
                        <FaDownload className="me-2" />
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleReset}
                className="btn btn-outline-success btn-lg mt-4"
              >
                <FaRedo className="me-2" />
                Create New
              </button>
            </div>
          ) : (
            // ================= FORM VIEW =================
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* IMAGE UPLOAD */}
              <div className="mb-5">
                <h5 className="border-bottom pb-2 mb-3">
                  <span className="badge bg-theme me-2">1</span>
                  Upload Product Image
                </h5>

                <div className="preview-box mb-3 text-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="preview-img"
                    />
                  ) : (
                    <div className="text-muted">
                      <FaUpload size={40} />
                      <p>Upload product image</p>
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  className={`form-control ${
                    errors.productImage ? "is-invalid" : ""
                  }`}
                  {...register("productImage", {
                    required: "Image is required",
                    onChange: handleImageChange,
                  })}
                />
                {errors.productImage && (
                  <small className="text-danger">
                    {errors.productImage.message}
                  </small>
                )}
              </div>

              {/* PACKAGING OPTIONS */}
              <div className="mb-5">
                <h5 className="border-bottom pb-2 mb-3">
                  <span className="badge bg-theme me-2">2</span>
                  Select Packaging Types
                </h5>

                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    {...register("boxPackaging")}
                  />
                  <label className="form-check-label">
                    Box Packaging
                  </label>
                </div>

                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    {...register("wrapperPackaging")}
                  />
                  <label className="form-check-label">
                    Wrapper Packaging
                  </label>
                </div>

                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    {...register("glassPackaging")}
                  />
                  <label className="form-check-label">
                    Glass Packaging
                  </label>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-theme btn-lg w-100 py-3"
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FaShapes className="me-2" />
                    Generate Packaging Range
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackageRange;
