import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function CreateProducts(){
    const [name,setName] = useState("")
    const [price,setPrice] = useState("")
    const [description,setDescription] = useState("")
    const [category,setCategory] = useState("")
    const [stock,setStock] = useState("")
    const [image,setImage] = useState(null)
    const [imageUrl,setImageUrl] = useState("")
    const [categories,setCategories] = useState([])
    const [error,setError] = useState("")
    const [loading,setLoading] = useState(false)
    const fileInput = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        api.get("/api/category/")
            .then((response) => setCategories(response.data))
            .catch(() => setError("კატეგორიები ვერ ჩაიტვირთა."))
    }, [])

    async function handleSubmit(e){
        e.preventDefault()
        setError("")
        setLoading(true)
        try {
            const data = new FormData()
            Object.entries({ name, price, description, category, stock, image_url: imageUrl }).forEach(([key, value]) => data.append(key, value))
            if (image) data.append("image", image)
            await api.post("/api/product/", data)
            navigate("/products")
        } catch (error) {
            setError("პროდუქტის შექმნა ვერ შესრულდა. შეამოწმე ველები.")
        } finally {
            setLoading(false)
        }
    }

    return(
        <main className="form-page">
            <div className="form-heading">
                <p className="eyebrow">ახალი ჩანაწერი</p>
                <h1>პროდუქტის დამატება</h1>
                <p>შეავსე პროდუქტის ძირითადი ინფორმაცია.</p>
            </div>
            <form className="product-form" onSubmit={handleSubmit}>
                <label className="field-wide" htmlFor="product-name"><span>პროდუქტის სახელი</span><input id="product-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="მაგალითად: სამუშაო მაგიდა" required /></label>
                <label className="field-wide image-field" htmlFor="product-image"><span>სურათის ფაილი <small>არასავალდებულო</small></span><input ref={fileInput} id="product-image" type="file" accept="image/*" onChange={(e) => { setImage(e.target.files[0] || null); if (e.target.files[0]) setImageUrl("") }} /></label>
                <label className="field-wide" htmlFor="product-image-url"><span>ან სურათის ინტერნეტ-ლინკი</span><input id="product-image-url" type="url" value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); if (e.target.value) { setImage(null); fileInput.current.value = "" } }} placeholder="https://example.com/photo.jpg" /></label>
                <label htmlFor="product-price"><span>ფასი, ₾</span><input id="product-price" type="number" min="0.01" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" required /></label>
                <label htmlFor="product-stock"><span>რაოდენობა</span><input id="product-stock" type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="0" required /></label>
                <label className="field-wide" htmlFor="product-category"><span>კატეგორია</span><select id="product-category" value={category} onChange={(e)=>setCategory(e.target.value)} required><option value="">აირჩიე კატეგორია</option>{categories.map((item)=><option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
                <label className="field-wide" htmlFor="product-description"><span>აღწერა</span><textarea id="product-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="მოკლედ აღწერე პროდუქტი" required /></label>
                {error && <p className="form-error field-wide" role="alert">{error}</p>}
                <div className="form-actions field-wide">
                    <Link to="/products">გაუქმება</Link>
                    <button className="button-solid" type="submit" disabled={loading}>{loading ? "ინახება..." : "პროდუქტის დამატება →"}</button>
                </div>
            </form>
        </main>
    )
}

export default CreateProducts;
