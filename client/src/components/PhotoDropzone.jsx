import { useState } from "react";
import imgIcon from "../assets/icons/imgIcon.png";
import cameraIcon from "../assets/icons/cameraIcon.png";

export default function PhotoDropzone({ onUpload }) {
    const [media, setMedia] = useState([]);

    async function uploadToCloudinary(file) {
        const url = "https://api.cloudinary.com/v1_1/dthynp3xm/upload";

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "rec_photos"); // jouw preset

        const res = await fetch(url, {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        return data.secure_url; // Cloudinary URL
    }

    async function handleFileChange(e) {
        const files = Array.from(e.target.files);
        const urls = [];

        for (const file of files) {
            const uploadedUrl = await uploadToCloudinary(file);
            urls.push(uploadedUrl);
        }

        setMedia((prev) => [...prev, ...urls]);

        if (onUpload) onUpload(urls);
    }

    return (
        <div className="photo-dropzone">
            <div className="photo-dropzone__actions">
                <label className="dropzone-card" htmlFor="upload-images">
                    <img src={imgIcon} alt="Library" className="dropzone-card__icon" />
                    <span>Choose from library</span>
                    <input
                        id="upload-images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
                </label>

                <label className="dropzone-card" htmlFor="upload-videos">
                    <img src={cameraIcon} alt="Camera" className="dropzone-card__icon" />
                    <span>Take photo/video</span>
                    <input
                        id="upload-videos"
                        type="file"
                        accept="video/*,image/*"
                        multiple
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
                </label>
            </div>

            <p className="photo-dropzone__hint">
                Upload 1 or more pictures or videos
            </p>

            <label className="upload-button">
                Choose images quickly
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />
            </label>

            <label className="upload-button">
                Choose videos quickly
                <input
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />
            </label>

            <div className="preview-grid">
                {media.map((url, index) => (
                    <div key={index} className="preview-item">
                        {url.includes("video") ? (
                            <video src={url} controls width="150" />
                        ) : (
                            <img src={url} alt="preview" width="150" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
