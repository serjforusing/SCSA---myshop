import { Link } from "react-router-dom";

function Home() {
    return (
        <main className="home-page">
            <section className="hero">
                <div className="hero-copy">
                    <p className="eyebrow">MyShop ონლაინ მაღაზია</p>
                    <h1>საჭირო ნივთების პოვნა მარტივად</h1>
                    <p className="hero-text">დაათვალიერე პროდუქტები, შეადარე ფასები და სასურველი ნივთები პირდაპირ კალათიდან შეუკვეთე.</p>
                    <div className="hero-actions">
                        <Link className="button-solid" to="/products">პროდუქტების ნახვა</Link>
                        <Link className="button-text" to="/register">ანგარიშის შექმნა →</Link>
                    </div>
                </div>
                <div className="hero-poster">
                    <h2>ყველაფერი ერთ ადგილას</h2>
                    <p>მარტივი ძიება, დაცული პირადი კალათა და შეკვეთების ისტორია.</p>
                    <Link to="/products">კატალოგზე გადასვლა →</Link>
                </div>
            </section>

            <section className="home-process">
                <div className="section-heading">
                    <p className="eyebrow">როგორ მუშაობს</p>
                    <h2>შეკვეთა სამი ნაბიჯით</h2>
                </div>
                <div className="process-list">
                    <article><h3>მოძებნე</h3><p>გამოიყენე ძიება, კატეგორია და დალაგება.</p></article>
                    <article><h3>დაამატე კალათაში</h3><p>აირჩიე სასურველი პროდუქტები და რაოდენობა.</p></article>
                    <article><h3>გააფორმე</h3><p>შეავსე მიწოდების ინფორმაცია და დაადასტურე.</p></article>
                </div>
            </section>
        </main>
    );
}

export default Home;
