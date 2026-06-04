import { useState } from "react";
import { supabase } from "../supabase";

export default function PhotoDropzone({ onUpload }) {
    const [images, setImages] = useState([]);

    // Bestandsnaam opschonen
    function sanitizeFileName(name) {
        return name
            .toLowerCase()
            .replace(/\s+/g, "-")          // spaties → -
            .replace(/[^a-z0-9.-]/g, "")   // verwijder speciale tekens
            .replace(/-+/g, "-");          // dubbele streepjes → enkel
    }

    async function uploadImage(file) {
        const cleanName = sanitizeFileName(file.name);
        const fileName = `${Date.now()}-${cleanName}`;

        const { error } = await supabase.storage
            .from("ugc-images")
            .upload(fileName, file);

        if (error) {
            console.error("Upload error:", error);
            return null;
        }

        const { data: urlData } = supabase.storage
            .from("ugc-images")
            .getPublicUrl(fileName);

        return urlData.publicUrl;
    }

    async function handleFileChange(e) {
        const files = Array.from(e.target.files);
        const uploadedUrls = [];

        for (const file of files) {
            const url = await uploadImage(file);
            if (url) uploadedUrls.push(url);
        }

        setImages((prev) => [...prev, ...uploadedUrls]);

        if (onUpload) onUpload(uploadedUrls);
    }

    return (
        <div className="photo-dropzone">
            <h3>Upload 1 or more pictures</h3>

            <label className="upload-button">
                Choose one or more images 
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />
            </label>  {' | '}

            <label className="upload-button">
                Choose one or more videos
                <input
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />
            </label>

            <div className="preview-grid">
                {images.map((url, index) => (
                    <div key={index} className="preview-item">
                        <img src={url} alt="preview" />
                    </div>
                ))}
            </div>
        </div>
    );
}
