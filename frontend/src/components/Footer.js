import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-inner">
                <Link to="/">MyShop</Link>
                <p>პროდუქტების მარტივი სივრცე — მოძებნე, დაამატე და მართე.</p>
                <span>© 2026 MyShop</span>
            </div>
        </footer>
    );
}

export default Footer;
