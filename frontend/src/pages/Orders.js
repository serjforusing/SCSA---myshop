import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [orderStatus, setOrderStatus] = useState("");
    const [ordering, setOrdering] = useState("-created_at");
    const [page, setPage] = useState(1);
    const [next, setNext] = useState(false);
    const [previous, setPrevious] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const params = new URLSearchParams({ page, ordering });
        if (orderStatus) params.set("status", orderStatus);
        setLoading(true);
        setError("");
        api.get(`/api/orders/?${params}`)
            .then((response) => {
                setOrders(response.data.results);
                setNext(Boolean(response.data.next));
                setPrevious(Boolean(response.data.previous));
            })
            .catch(() => setError("შეკვეთების ისტორია ვერ ჩაიტვირთა."))
            .finally(() => setLoading(false));
    }, [orderStatus, ordering, page]);

    function changeFilter(setter, value) {
        setter(value);
        setPage(1);
    }

    return (
        <main className="orders-page">
            <div className="page-heading">
                <div><p className="eyebrow">პირადი სივრცე</p><h1>ჩემი შეკვეთები</h1><p>ნახე შეკვეთების შემადგენლობა და მიმდინარე სტატუსი.</p></div>
                <Link className="back-link" to="/products">პროდუქტების ნახვა →</Link>
            </div>
            {searchParams.get("created") && <p className="notice success-message" role="status">შეკვეთა წარმატებით გაფორმდა.</p>}
            <div className="order-filters">
                <label><span>სტატუსი</span><select value={orderStatus} onChange={(event) => changeFilter(setOrderStatus, event.target.value)}><option value="">ყველა სტატუსი</option><option value="pending">მიღებულია</option><option value="processing">მუშავდება</option><option value="shipped">გაგზავნილია</option><option value="completed">დასრულებულია</option><option value="cancelled">გაუქმებულია</option></select></label>
                <label><span>დალაგება</span><select value={ordering} onChange={(event) => changeFilter(setOrdering, event.target.value)}><option value="-created_at">ჯერ ახალი</option><option value="created_at">ჯერ ძველი</option><option value="-total_price">ჯერ მაღალი ღირებულება</option><option value="total_price">ჯერ დაბალი ღირებულება</option></select></label>
            </div>
            {loading && <p className="state-message">იტვირთება...</p>}
            {error && <p className="state-message error-message" role="alert">{error}</p>}
            {!loading && !error && orders.length === 0 && <section className="empty-shop-state"><h2>შეკვეთები ჯერ არ გაქვს</h2><p>არჩეული პროდუქტები კალათაში დაამატე და გააფორმე შეკვეთა.</p><Link className="button-solid" to="/products">პროდუქტების ნახვა →</Link></section>}
            <section className="order-list">
                {orders.map((order) => (
                    <article className="order-card" key={order.id}>
                        <header><div><span>შეკვეთა</span><h2>#{String(order.id).padStart(4, "0")}</h2></div><span className={`order-status status-${order.status}`}>{order.status_display}</span></header>
                        <div className="order-items">
                            {order.items.map((item) => <div key={item.id}><span>{item.product_name} × {item.quantity}</span><strong>{item.subtotal} ₾</strong></div>)}
                        </div>
                        <footer><div><small>მიწოდება</small><span>{order.address}</span></div><div><small>თარიღი</small><time>{new Date(order.created_at).toLocaleString("ka-GE")}</time></div><strong>{order.total_price} ₾</strong></footer>
                    </article>
                ))}
            </section>
            {(previous || next) && <div className="pagination"><button disabled={!previous} onClick={() => setPage((value) => value - 1)}>← წინა</button><span>გვერდი {page}</span><button disabled={!next} onClick={() => setPage((value) => value + 1)}>შემდეგი →</button></div>}
        </main>
    );
}

export default Orders;
