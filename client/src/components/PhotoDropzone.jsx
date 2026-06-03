import { useState } from "react";

export default function PhotoDropzone() {
    const [images, setImages] = useState([]);

    function handleFileChange(e) {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        setImages((prev) => [...prev, ...newImages]);
    }

    function removeImage(index) {
        setImages((prev) => prev.filter((_, i) => i !== index));
    }

    return (
        <div className="photo-dropzone">
            <h3>Upload your photos</h3>

            {/* Duidelijke knop */}
            <label className="upload-button">
                Choose files
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />
            </label>

            {/* Previews */}
            <div className="preview-grid">
                {images.map((img, index) => (
                    <div key={index} className="preview-item">
                        <img src={img.preview} alt="preview" />
                        <button
                            className="remove-button"
                            onClick={() => removeImage(index)}
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
