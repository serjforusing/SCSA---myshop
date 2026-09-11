import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Auth.css";

function Register() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e){
        e.preventDefault()
        setError("")
        setLoading(true)
        try{
            await api.post("/api/register/", { username, email, password })
            navigate("/login")
        } catch(error){
            const errors = error.response?.data
            setError(errors ? Object.values(errors).flat().join(" ") : "რეგისტრაცია ვერ შესრულდა.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="auth-page auth-page-register">
            <section className="auth-panel">
                <Link className="auth-logo" to="/">MyShop</Link>
                <h1>ანგარიშის შექმნა</h1>
                <p className="auth-description">შეავსე მონაცემები და დაიწყე MyShop-ის გამოყენება.</p>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="register-username">მომხმარებლის სახელი</label>
                    <input id="register-username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="აირჩიე მომხმარებელი" autoComplete="username" required />

                    <label htmlFor="register-email">ელფოსტა</label>
                    <input id="register-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" autoComplete="email" required />

                    <label htmlFor="register-password">პაროლი</label>
                    <input id="register-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="მინიმუმ 8 სიმბოლო" autoComplete="new-password" minLength="8" required />

                    {error && <p className="form-error" role="alert">{error}</p>}
                    <button className="button-solid" type="submit" disabled={loading}>{loading ? "იქმნება ანგარიში..." : "რეგისტრაცია"}</button>
                </form>
                <p className="auth-switch">უკვე გაქვს ანგარიში? <Link to="/login">შედი</Link></p>
            </section>
        </main>
    );
}

export default Register;
