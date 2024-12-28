import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddQuestionForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    photo_upload: [],
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const backendEndpoint = import.meta.env.VITE_BACKEND_ENDPOINT;

  const categories = [
    "AI / Machine Learning",
    "Animation",
    "Cloud Computing",
    "Cybersecurity",
    "UI/UX Design",
    "Data Analysis & Visualization",
    "Data Science",
    "DevOps",
    "Game Development",
    "Product Management",
    "Quality Assurance",
    "Software Development",
  ];

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file upload with preview
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, photo_upload: files });

    // Generate image previews
    const imagePreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(imagePreviews);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const questionData = new FormData();
    questionData.append("title", formData.title);
    questionData.append("description", formData.description);
    questionData.append("category", formData.category);
    formData.photo_upload.forEach((file) => {
      questionData.append("photo_upload", file);
    });

    for (let pair of questionData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
    }    

    
    try {
      const response = await axios.post(
        `${backendEndpoint}/api/v1/question`,
        questionData,
        { withCredentials: true }
      );
      toast.success(response?.data?.message || "Question created successfully!")

      setTimeout(() => {
        navigate("/");
      }, 3000);
      
      setFormData({ title: "", description: "", category: "", photo_upload: [] });
      setPreviewImages([]);
    } catch (error) {
        toast.error(error.response?.data || error.response?.data?.message || error.message || "Error creating question. Try again!");
      // console.error("Error adding question:", error);
    }
    setLoading(false);
  };

  return (
    <section className="add-question bg-gradient-to-r from-gray-100 to-gray-50 py-12">
      <div className="container mx-auto px-6 md:w-3/4 lg:w-1/2">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-10">
          Ask a New Question
        </h2>
        <form
          className="p-6 bg-white shadow-lg rounded-lg space-y-6"
          onSubmit={handleSubmit} method="post" encType='multipart/form-data'
        >
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-green-300"
              placeholder="Enter a descriptive title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-green-300"
              placeholder="Provide details about your question"
              rows="6"
              required
            ></textarea>
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-green-300"
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Upload Images (optional)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-green-300"
            />
            {/* Image Previews */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              {previewImages.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-32 object-cover rounded-lg shadow"
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white bg-green-600 rounded-lg shadow-lg hover:bg-green-500 transition ${
              loading && "opacity-50 cursor-not-allowed"
            }`}
          >
            {loading ? "Submitting..." : "Submit Question"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddQuestionForm;
