import { Link } from "react-router-dom";

function NotFound() {
    return (
        <main className="not-found">
            <span>404</span>
            <h1>ასეთი გვერდი არ არსებობს</h1>
            <Link className="button-solid" to="/">მთავარ გვერდზე დაბრუნება</Link>
        </main>
    );
}

export default NotFound;
