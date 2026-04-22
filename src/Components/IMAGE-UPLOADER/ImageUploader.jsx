import React, { useState, useRef } from "react";
import { UploadCloud, Loader2, Image as ImageIcon, XCircle, CheckCircle2, Link } from "lucide-react";

const server_url=import.meta.env.VITE_API_URL;

const ImageUploader = () => {
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // 🔥 Updated state (matches schema)
  const [formData, setFormData] = useState({
    page: "",
    section: "",
    title: "",
    url: "",
  });

  // 🔹 Upload to backend
  const uploadImage = async (file) => {
    const data = new FormData();
    data.append("image", file);

    const res = await fetch(`${VITE_API_URL}/api/upload`, {
      method: "POST",
      body: data,
    });

    if (!res.ok) throw new Error("Upload failed");
    return res.json();
  };

  // 🔹 Handle file select
  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError("");
    setPreview(URL.createObjectURL(file));

    try {
      setLoading(true);
      const data = await uploadImage(file);

      setFormData((prev) => ({
        ...prev,
        title: file.name,
        url: data.url,
      }));

    } catch (err) {
      setError("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Save to DB
  const handleSave = async () => {
    try {
      if (!formData.page || !formData.section || !formData.url) {
        return alert("Please fill all fields");
      }

      await fetch(`${server_url}/api/page-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      alert("Saved to DB ✅");

      // reset
      setFormData({
        page: "",
        section: "",
        title: "",
        url: "",
      });
      setPreview("");

    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  const triggerFileInput = () => fileInputRef.current.click();

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4">

      {/* 🔥 Page Input */}
      <input
        type="text"
        placeholder="Page (e.g. home)"
        value={formData.page}
        onChange={(e) =>
          setFormData({ ...formData, page: e.target.value })
        }
        className="w-full border p-2 rounded"
      />

      {/* 🔥 Section Input */}
      <input
        type="text"
        placeholder="Section (e.g. hero)"
        value={formData.section}
        onChange={(e) =>
          setFormData({ ...formData, section: e.target.value })
        }
        className="w-full border p-2 rounded"
      />

      {/* Hidden Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept="image/*"
        className="hidden"
      />

      {/* Upload UI */}
      <div
        onClick={triggerFileInput}
        className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer
        ${preview ? 'border-gray-200' : 'border-blue-300'}`}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" />
            <p>Uploading...</p>
          </>
        ) : preview ? (
          <img src={preview} className="h-40 object-contain" />
        ) : (
          <>
            <ImageIcon />
            <p>Click to upload</p>
          </>
        )}
      </div>

      {/* Error */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Success Info */}
      {formData.url && (
        <div className="p-3 border rounded bg-green-50">
          <p><b>Title:</b> {formData.title}</p>
          <p><b>URL:</b> {formData.url}</p>
        </div>
      )}

      {/* 🔥 Save Button */}
      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 rounded"
      >
        Save Image
      </button>

    </div>
  );
};

export default ImageUploader;