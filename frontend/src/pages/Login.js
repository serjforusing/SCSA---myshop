import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api";
import "../styles/Auth.css";

function Login(){
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [error,setError] = useState("")
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()
    const { login } = useContext(AuthContext)

    async function handleSubmit(e){
        e.preventDefault()
        setError("")
        setLoading(true)
        try {
            const response = await api.post("/api/login/", { username, password })
            login(response.data.access, response.data.refresh)
            navigate("/products")
        } catch (error) {
            setError("მომხმარებელი ან პაროლი არასწორია.")
        } finally {
            setLoading(false)
        }
    }

    return(
        <main className="auth-page">
            <section className="auth-panel">
                <Link className="auth-logo" to="/">MyShop</Link>
                <h1>ანგარიშზე შესვლა</h1>
                <p className="auth-description">შეიყვანე მომხმარებლის სახელი და პაროლი.</p>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">მომხმარებლის სახელი</label>
                    <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="შეიყვანე მომხმარებელი" autoComplete="username" required />

                    <label htmlFor="password">პაროლი</label>
                    <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="შეიყვანე პაროლი" autoComplete="current-password" required />

                    {error && <p className="form-error" role="alert">{error}</p>}
                    <button className="button-solid" type="submit" disabled={loading}>{loading ? "მიმდინარეობს შესვლა..." : "შესვლა"}</button>
                </form>
                <p className="auth-switch">ჯერ არ გაქვს ანგარიში? <Link to="/register">დარეგისტრირდი</Link></p>
            </section>
        </main>
    );
}

export default Login;
