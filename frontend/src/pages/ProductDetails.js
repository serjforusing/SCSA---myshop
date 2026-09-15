import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import ImageModal from "../components/ImageModal";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState("");
    const [cartMessage, setCartMessage] = useState("");
    const [cartError, setCartError] = useState("");
    const [adding, setAdding] = useState(false);
    const [preview, setPreview] = useState(false);
    const { isAuthenticated } = useContext(AuthContext);

    useEffect(() => {
        api.get(`/api/product/${id}/`)
            .then((response) => setProduct(response.data))
            .catch(() => setError("პროდუქტი ვერ მოიძებნა."));
    }, [id]);

    async function handleDelete() {
        if (!window.confirm("ნამდვილად გინდა პროდუქტის წაშლა?")) return;
        try {
            await api.delete(`/api/product/${id}/`);
            navigate("/products");
        } catch (error) {
            setError("პროდუქტის წაშლა ვერ შესრულდა.");
        }
    }

    async function addToCart() {
        setAdding(true);
        setCartMessage("");
        setCartError("");
        try {
            await api.post("/api/cart/items/", { product: product.id, quantity: 1 });
            setCartMessage("პროდუქტი კალათაში დაემატა.");
        } catch (requestError) {
            setCartError(requestError.response?.data?.quantity || "კალათაში დამატება ვერ შესრულდა.");
        } finally {
            setAdding(false);
        }
    }

    if (error) return <main className="simple-page"><p className="notice error-message" role="alert">{error}</p><Link to="/products">← პროდუქტებზე დაბრუნება</Link></main>;
    if (!product) return <main className="simple-page"><p className="notice">იტვირთება...</p></main>;
    const productImage = product.image_url || product.image;

    return (
        <main className="detail-page">
            <Link className="back-link" to="/products">← პროდუქტებზე დაბრუნება</Link>
            <article className="product-detail">
                {productImage ? <button className="image-open-button detail-image-button" type="button" onClick={() => setPreview(true)} aria-label={`${product.name} — სურათის სრულად ნახვა`}><img className="detail-image" src={productImage} alt={product.name} /></button> : <div className="detail-number" aria-hidden="true">{product.name.charAt(0)}</div>}
                <div className="detail-content">
                    <p className="eyebrow">{product.category_name}</p>
                    <h1>{product.name}</h1>
                    <p className="detail-description">{product.description}</p>
                    <dl>
                        <div><dt>ფასი</dt><dd>{product.price} ₾</dd></div>
                        <div><dt>მარაგშია</dt><dd>{product.stock} ცალი</dd></div>
                        <div><dt>ავტორი</dt><dd>{product.owner}</dd></div>
                    </dl>
                    {cartMessage && <p className="notice success-message" role="status">{cartMessage} <Link to="/cart">კალათის ნახვა →</Link></p>}
                    {cartError && <p className="notice error-message" role="alert">{cartError}</p>}
                    <div className="detail-actions">
                        {isAuthenticated ? <button className="button-solid" disabled={adding || product.stock === 0} onClick={addToCart}>{product.stock === 0 ? "მარაგი ამოიწურა" : adding ? "ემატება..." : "კალათაში დამატება →"}</button> : <Link className="button-solid" to="/login">შესვლა შესაძენად →</Link>}
                    </div>
                    {product.is_owner && (
                        <div className="detail-actions">
                            <Link className="button-solid" to={`/edit-product/${product.id}`}>რედაქტირება</Link>
                            <button className="button-danger" onClick={handleDelete}>წაშლა</button>
                        </div>
                    )}
                </div>
            </article>
            <ImageModal src={preview ? productImage : null} alt={product.name} onClose={() => setPreview(false)} />
        </main>
    );
}

export default ProductDetails;
