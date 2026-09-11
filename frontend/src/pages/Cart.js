import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function Cart() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [changing, setChanging] = useState(null);
    const [error, setError] = useState("");

    const loadCart = useCallback(() => {
        setLoading(true);
        setError("");
        api.get("/api/cart/")
            .then((response) => setCart(response.data))
            .catch(() => setError("კალათა ვერ ჩაიტვირთა."))
            .finally(() => setLoading(false));
    }, []);

    useEffect(loadCart, [loadCart]);

    async function changeQuantity(item, quantity) {
        if (quantity < 1 || quantity > item.available_stock) return;
        setChanging(item.id);
        setError("");
        try {
            await api.patch(`/api/cart/items/${item.id}/`, { quantity });
            loadCart();
        } catch {
            setError("რაოდენობის შეცვლა ვერ შესრულდა.");
            setChanging(null);
        }
    }

    async function removeItem(id) {
        setChanging(id);
        setError("");
        try {
            await api.delete(`/api/cart/items/${id}/`);
            loadCart();
        } catch {
            setError("პროდუქტის ამოღება ვერ შესრულდა.");
            setChanging(null);
        }
    }

    if (loading && !cart) return <main className="simple-page"><p className="notice">კალათა იტვირთება...</p></main>;

    return (
        <main className="cart-page">
            <div className="page-heading">
                <div><p className="eyebrow">შენი არჩევანი</p><h1>კალათა</h1><p>შეცვალე რაოდენობა ან გადადი შეკვეთის გაფორმებაზე.</p></div>
                <Link className="back-link" to="/products">← პროდუქტების დამატება</Link>
            </div>

            {error && <p className="notice error-message" role="alert">{error}</p>}
            {!loading && cart?.items.length === 0 && (
                <section className="empty-shop-state">
                    <span>0</span><h2>კალათა ცარიელია</h2><p>კატალოგში იპოვე სასურველი პროდუქტი.</p>
                    <Link className="button-solid" to="/products">პროდუქტების ნახვა →</Link>
                </section>
            )}

            {cart?.items.length > 0 && (
                <div className="cart-layout">
                    <section className="cart-items" aria-label="კალათის პროდუქტები">
                        {cart.items.map((item) => (
                            <article className="cart-row" key={item.id}>
                                <div className="cart-product-number" aria-hidden="true">{item.product_name.charAt(0)}</div>
                                <div className="cart-product-copy">
                                    <h2><Link to={`/products/${item.product}`}>{item.product_name}</Link></h2>
                                    <p>{item.product_price} ₾ · მარაგში {item.available_stock}</p>
                                </div>
                                <div className="quantity-control" aria-label={`${item.product_name} — რაოდენობა`}>
                                    <button disabled={changing === item.id || item.quantity === 1} onClick={() => changeQuantity(item, item.quantity - 1)}>−</button>
                                    <strong>{item.quantity}</strong>
                                    <button disabled={changing === item.id || item.quantity === item.available_stock} onClick={() => changeQuantity(item, item.quantity + 1)}>＋</button>
                                </div>
                                <strong className="cart-subtotal">{item.subtotal} ₾</strong>
                                <button className="remove-button" disabled={changing === item.id} onClick={() => removeItem(item.id)}>ამოღება</button>
                            </article>
                        ))}
                    </section>
                    <aside className="cart-summary">
                        <p className="eyebrow">შეჯამება</p>
                        <div><span>პროდუქტების რაოდენობა</span><strong>{cart.total_quantity}</strong></div>
                        <div className="summary-total"><span>ჯამი</span><strong>{cart.total_price} ₾</strong></div>
                        <Link className="button-solid" to="/checkout">შეკვეთის გაფორმება →</Link>
                    </aside>
                </div>
            )}
        </main>
    );
}

export default Cart;
