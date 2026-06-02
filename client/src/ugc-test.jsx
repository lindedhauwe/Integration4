import { useEffect, useRef, useState } from 'react'

export default function UGCBlock() {
    const [uploads, setUploads] = useState([])
    const nextIdRef = useRef(1)
    const uploadsRef = useRef([])

    useEffect(() => {
        uploadsRef.current = uploads
    }, [uploads])

    useEffect(() => {
        return () => {
            for (const upload of uploadsRef.current) {
                URL.revokeObjectURL(upload.previewUrl)
            }
        }
    }, [])

    const handleChange = (event) => {
        const files = Array.from(event.target.files ?? []).filter((file) => file.type.startsWith('image/'))

        if (files.length === 0) {
            event.target.value = ''
            return
        }

        setUploads((currentUploads) => [
            ...currentUploads,
            ...files.map((file) => ({
                id: nextIdRef.current++,
                file,
                previewUrl: URL.createObjectURL(file),
            })),
        ])

        event.target.value = ''
    }

    const removeUpload = (id) => {
        setUploads((currentUploads) => {
            const uploadToRemove = currentUploads.find((upload) => upload.id === id)

            if (uploadToRemove) {
                URL.revokeObjectURL(uploadToRemove.previewUrl)
            }

            return currentUploads.filter((upload) => upload.id !== id)
        })
    }

    return (
        <section>
            <h2>UGC test</h2>
            <p>Upload hier afbeeldingen om user generated content te testen.</p>

            <label>
                Upload afbeeldingen
                <input type="file" accept="image/*" multiple onChange={handleChange} />
            </label>

            {uploads.length > 0 ? (
                <div aria-label="Geüploade afbeeldingen">
                    {uploads.map((upload) => (
                        <article key={upload.id}>
                            <img src={upload.previewUrl} alt={upload.file.name} width="120" />
                            <p>{upload.file.name}</p>
                            <button type="button" onClick={() => removeUpload(upload.id)}>
                                Verwijder
                            </button>
                        </article>
                    ))}
                </div>
            ) : null}
        </section>
    )
}