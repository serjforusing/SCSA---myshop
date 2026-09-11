import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function Checkout() {
    const [cart, setCart] = useState(null);
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/api/cart/")
            .then((response) => setCart(response.data))
            .catch(() => setError("კალათა ვერ ჩაიტვირთა."))
            .finally(() => setLoading(false));
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        setSubmitting(true);
        setError("");
        try {
            const response = await api.post("/api/orders/", { full_name: fullName, phone, address });
            navigate(`/orders?created=${response.data.id}`);
        } catch (requestError) {
            setError(requestError.response?.data?.detail || "შეკვეთის გაფორმება ვერ შესრულდა. შეამოწმე მონაცემები.");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) return <main className="simple-page"><p className="notice">შეკვეთის მონაცემები იტვირთება...</p></main>;
    if (!cart?.items.length) return <main className="simple-page"><section className="empty-shop-state"><h1>კალათა ცარიელია</h1><Link className="button-solid" to="/products">პროდუქტების ნახვა →</Link></section></main>;

    return (
        <main className="checkout-page">
            <div className="form-heading">
                <p className="eyebrow">ბოლო ნაბიჯი</p><h1>შეკვეთის გაფორმება</h1>
                <p>მიუთითე მიმღების საკონტაქტო და მიწოდების ინფორმაცია.</p>
                <div className="checkout-total"><span>{cart.total_quantity} პროდუქტი</span><strong>{cart.total_price} ₾</strong></div>
            </div>
            <form className="product-form checkout-form" onSubmit={handleSubmit}>
                <label className="field-wide" htmlFor="full-name"><span>სახელი და გვარი</span><input id="full-name" value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" required minLength="2" /></label>
                <label className="field-wide" htmlFor="phone"><span>ტელეფონის ნომერი</span><input id="phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" placeholder="მაგალითად: 555 12 34 56" required minLength="6" /></label>
                <label className="field-wide" htmlFor="address"><span>სრული მისამართი</span><textarea id="address" value={address} onChange={(event) => setAddress(event.target.value)} autoComplete="street-address" placeholder="ქუჩა, ნომერი, სადარბაზო და ბინა" required minLength="5" /></label>
                {error && <p className="form-error field-wide" role="alert">{error}</p>}
                <div className="form-actions field-wide">
                    <Link to="/cart">← კალათაზე დაბრუნება</Link>
                    <button className="button-solid" type="submit" disabled={submitting}>{submitting ? "ფორმდება..." : "შეკვეთის დადასტურება →"}</button>
                </div>
            </form>
        </main>
    );
}

export default Checkout;
