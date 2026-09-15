import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api";

function EditProduct() {
    const { id } = useParams()
    const [name,setName] = useState("")
    const [price,setPrice] = useState("")
    const [description,setDescription] = useState("")
    const [category,setCategory] = useState("")
    const [stock,setStock] = useState("")
    const [image,setImage] = useState(null)
    const [categories,setCategories] = useState([])
    const [error,setError] = useState("")
    const [loading,setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        async function getProduct() {
            const response = await api.get(`/api/product/${id}/`)
            setName(response.data.name)
            setPrice(response.data.price)
            setDescription(response.data.description)
            setCategory(response.data.category)
            setStock(response.data.stock)
        }

        async function getCategories() {
            const response = await api.get("/api/category/")
            setCategories(response.data)
        }

        Promise.all([getProduct(), getCategories()])
            .catch(() => setError("პროდუქტის ჩატვირთვა ვერ შესრულდა."))
            .finally(() => setLoading(false))
    }, [id])

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")
        setLoading(true)
        try {
            const data = new FormData()
            Object.entries({ name, price, description, category, stock }).forEach(([key, value]) => data.append(key, value))
            if (image) data.append("image", image)
            await api.put(`/api/product/${id}/`, data)
            navigate(`/products/${id}`)
        } catch (error) {
            setError(error.response?.status === 403 ? "ამ პროდუქტის შეცვლის უფლება არ გაქვს." : "პროდუქტის შენახვა ვერ შესრულდა.")
        } finally {
            setLoading(false)
        }
    }

    if (loading && !name) return <main className="simple-page"><p className="notice">იტვირთება...</p></main>

    return (
        <main className="form-page">
            <div className="form-heading">
                <p className="eyebrow">ჩანაწერი #{String(id).padStart(3, "0")}</p>
                <h1>პროდუქტის რედაქტირება</h1>
                <p>განაახლე პროდუქტის ინფორმაცია.</p>
            </div>
            <form className="product-form" onSubmit={handleSubmit}>
                <label className="field-wide" htmlFor="product-name"><span>პროდუქტის სახელი</span><input id="product-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required /></label>
                <label htmlFor="product-price"><span>ფასი, ₾</span><input id="product-price" type="number" min="0.01" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required /></label>
                <label htmlFor="product-stock"><span>რაოდენობა</span><input id="product-stock" type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} required /></label>
                <label className="field-wide" htmlFor="product-category"><span>კატეგორია</span><select id="product-category" value={category} onChange={(e) => setCategory(e.target.value)} required><option value="">აირჩიე კატეგორია</option>{categories.map((item)=><option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
                <label className="field-wide" htmlFor="product-image"><span>ახალი სურათი (მაქს. 5 MB)</span><input id="product-image" type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0] || null)} /></label>
                <label className="field-wide" htmlFor="product-description"><span>აღწერა</span><textarea id="product-description" value={description} onChange={(e) => setDescription(e.target.value)} required /></label>
                {error && <p className="form-error field-wide" role="alert">{error}</p>}
                <div className="form-actions field-wide">
                    <Link to={`/products/${id}`}>გაუქმება</Link>
                    <button className="button-solid" type="submit" disabled={loading}>{loading ? "ინახება..." : "ცვლილებების შენახვა →"}</button>
                </div>
            </form>
        </main>
    )
}

export default EditProduct;
