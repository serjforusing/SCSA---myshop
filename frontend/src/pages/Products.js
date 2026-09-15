import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

function Products(){
    const { isAuthenticated } = useContext(AuthContext)
    const [products,setProducts] = useState([])
    const [categories,setCategories] = useState([])
    const [search,setSearch] = useState("")
    const [category,setCategory] = useState("")
    const [ordering,setOrdering] = useState("-created_at")
    const [page,setPage] = useState(1)
    const [next,setNext] = useState(false)
    const [previous,setPrevious] = useState(false)
    const [loading,setLoading] = useState(true)
    const [error,setError] = useState("")
    const [reload,setReload] = useState(0)
    const [addingId,setAddingId] = useState(null)
    const [cartMessage,setCartMessage] = useState("")

    useEffect(() => {
        api.get("/api/category/")
            .then((response) => setCategories(response.data))
            .catch(() => setError("კატეგორიები ვერ ჩაიტვირთა."))
    }, []);

    useEffect(() => {
        const params = new URLSearchParams({ page, ordering })
        if (search) params.set("search", search)
        if (category) params.set("category", category)

        setLoading(true)
        setError("")
        api.get(`/api/product/?${params}`)
            .then((response) => {
                setProducts(response.data.results)
                setNext(Boolean(response.data.next))
                setPrevious(Boolean(response.data.previous))
            })
            .catch(() => setError("პროდუქტები ვერ ჩაიტვირთა."))
            .finally(() => setLoading(false))
    }, [search, category, ordering, page, reload]);

    async function handleDelete(id) {
        if (!window.confirm("ნამდვილად გინდა პროდუქტის წაშლა?")) return
        try {
            await api.delete(`/api/product/${id}/`)
            setReload((value) => value + 1)
        } catch (error) {
            setError(error.response?.status === 403 ? "ამ პროდუქტის წაშლის უფლება არ გაქვს." : "პროდუქტის წაშლა ვერ შესრულდა.")
        }
    }

    function changeFilter(setter, value) {
        setter(value)
        setPage(1)
    }

    async function addToCart(product) {
        setAddingId(product.id)
        setCartMessage("")
        try {
            await api.post("/api/cart/items/", { product: product.id, quantity: 1 })
            setCartMessage(`„${product.name}“ კალათაში დაემატა.`)
        } catch (requestError) {
            setError(requestError.response?.data?.quantity || "კალათაში დამატება ვერ შესრულდა.")
        } finally {
            setAddingId(null)
        }
    }

    return (
        <main className="products-page">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">კატალოგი</p>
                    <h1>პროდუქტები</h1>
                    <p>მოძებნე სასურველი ნივთი ან მართე შენი პროდუქტები.</p>
                </div>
                {isAuthenticated && <Link className="button-solid" to="/create-product">პროდუქტის დამატება <span>＋</span></Link>}
            </div>

            <div className="filters">
                <label>
                    <span>ძიება</span>
                    <input type="search" value={search} onChange={(e) => changeFilter(setSearch, e.target.value)} placeholder="რას ეძებ?" />
                </label>
                <label>
                    <span>კატეგორია</span>
                    <select value={category} onChange={(e) => changeFilter(setCategory, e.target.value)}>
                        <option value="">ყველა კატეგორია</option>
                        {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                    </select>
                </label>
                <label>
                    <span>დალაგება</span>
                    <select value={ordering} onChange={(e) => changeFilter(setOrdering, e.target.value)}>
                        <option value="-created_at">ჯერ ახალი</option>
                        <option value="created_at">ჯერ ძველი</option>
                        <option value="price">იაფიდან ძვირისკენ</option>
                        <option value="-price">ძვირიდან იაფისკენ</option>
                        <option value="name">სახელის მიხედვით</option>
                    </select>
                </label>
            </div>

            {cartMessage && <p className="notice success-message" role="status">{cartMessage} <Link to="/cart">კალათის ნახვა →</Link></p>}

            {loading && <p className="state-message">იტვირთება...</p>}
            {error && <p className="state-message error-message">{error}</p>}
            {!loading && !error && products.length === 0 && <p className="state-message">პროდუქტი ვერ მოიძებნა.</p>}

            <div className="product-grid">
                {products.map((product) => (
                    <article className="product-card" key={product.id}>
                        {product.image && <Link to={`/products/${product.id}`}><img className="product-image" src={product.image} alt={product.name} loading="lazy" /></Link>}
                        <div className="product-card-top">
                            <span className="category-label">{product.category_name}</span>
                        </div>
                        <h2><Link to={`/products/${product.id}`}>{product.name}</Link></h2>
                        <p>{product.description}</p>
                        <div className="product-details">
                            <strong>{product.price} ₾</strong>
                            <span>{product.stock} ცალი</span>
                        </div>
                        <div className="product-card-footer">
                            <small>ავტორი — {product.owner}</small>
                            <div className="product-actions">
                                <Link className="details-link" to={`/products/${product.id}`}>დეტალურად</Link>
                                {isAuthenticated && <button className="add-cart-button" disabled={addingId === product.id || product.stock === 0} onClick={() => addToCart(product)}>{product.stock === 0 ? "მარაგი ამოიწურა" : addingId === product.id ? "ემატება..." : "კალათაში"}</button>}
                                {!isAuthenticated && <Link to="/login">შესვლა შესაძენად</Link>}
                                {product.is_owner && <>
                                    <Link to={`/edit-product/${product.id}`}>რედაქტირება</Link>
                                    <button className="delete-product-button" onClick={() => handleDelete(product.id)}>წაშლა</button>
                                </>}
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {(previous || next) && (
                <div className="pagination">
                    <button disabled={!previous} onClick={() => setPage((value) => value - 1)}>← წინა</button>
                    <span>გვერდი {page}</span>
                    <button disabled={!next} onClick={() => setPage((value) => value + 1)}>შემდეგი →</button>
                </div>
            )}
        </main>
    );
}

export default Products
