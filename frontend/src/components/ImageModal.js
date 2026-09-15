import { useEffect, useRef } from "react";

function ImageModal({ src, alt, onClose }) {
    const dialogRef = useRef(null)

    useEffect(() => {
        const dialog = dialogRef.current
        if (src && !dialog.open) dialog.showModal()
        if (!src && dialog.open) dialog.close()
    }, [src])

    return (
        <dialog className="image-modal" ref={dialogRef} onClose={onClose} onClick={(event) => event.target === event.currentTarget && event.currentTarget.close()} aria-label={`${alt || "პროდუქტი"} — სრული სურათი`}>
            <button className="image-modal-close" type="button" onClick={() => dialogRef.current.close()} aria-label="დახურვა">×</button>
            {src && <img src={src} alt={alt} />}
        </dialog>
    )
}

export default ImageModal;
