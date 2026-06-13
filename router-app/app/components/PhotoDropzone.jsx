import { useState, useRef } from "react";
import imgIcon from "../assets/icons/imgIcon.png";
import cameraIcon from "../assets/icons/cameraIcon.png";
import "./PhotoDropzone.css";

export default function PhotoDropzone({ onUpload }) {
    const [media, setMedia] = useState([]);
    const [cameraOpen, setCameraOpen] = useState(false);
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    async function uploadToCloudinary(blob) {
        const formData = new FormData();
        formData.append("file", blob);
        formData.append("upload_preset", "rec_photos");

        const res = await fetch("https://api.cloudinary.com/v1_1/dthynp3xm/upload", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        return data.secure_url;
    }

    async function handleFileChange(e) {
        const files = Array.from(e.target.files);
        const urls = [];

        for (const file of files) {
            const url = await uploadToCloudinary(file);
            urls.push(url);
        }

        setMedia((prev) => {
            const all = [...prev, ...urls];
            if (onUpload) onUpload(all);
            return all;
        });
    }

    async function openCamera() {
        setCameraOpen(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch {
            alert("Geen toegang tot camera.");
            setCameraOpen(false);
        }
    }

    function closeCamera() {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
        setCameraOpen(false);
    }

    function removeMedia(index) {
        const updated = media.filter((_, i) => i !== index);
        setMedia(updated);
        if (onUpload) onUpload(updated);
    }

    async function takePhoto() {
        const video = videoRef.current;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0);

        canvas.toBlob(async (blob) => {
            const url = await uploadToCloudinary(blob);
            setMedia((prev) => {
                const all = [...prev, url];
                if (onUpload) onUpload(all);
                return all;
            });
            closeCamera();
        }, "image/jpeg");
    }

    return (
        <div className="photo-dropzone">
            <div className="photo-dropzone__actions">
                <label className="dropzone-card" htmlFor="upload-library">
                    <img src={imgIcon} alt="" className="dropzone-card__icon" />
                    <span>Choose from library</span>
                    <input
                        id="upload-library"
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
                </label>

                <div className="dropzone-card" onClick={openCamera}>
                    <img src={cameraIcon} alt="" className="dropzone-card__icon" />
                    <span>Take photo/ video</span>
                </div>
            </div>

            {media.length > 0 && (
                <div className="photo-dropzone__preview">
                    {media.map((url, index) => (
                        <div key={index} className="preview-item">
                            {url.includes("video") ? (
                                <video src={url} controls />
                            ) : (
                                <img src={url} alt="preview" />
                            )}
                            <button
                                type="button"
                                className="preview-item__remove"
                                onClick={() => removeMedia(index)}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {cameraOpen && (
                <div className="camera-overlay">
                    <video ref={videoRef} autoPlay playsInline className="camera-stream" />
                    <div className="camera-controls">
                        <button type="button" className="camera-btn camera-btn--capture" onClick={takePhoto}>
                            Take photo
                        </button>
                        <button type="button" className="camera-btn camera-btn--close" onClick={closeCamera}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
