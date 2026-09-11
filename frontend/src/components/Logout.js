import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api";


function Logout(){
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    async function handleLogout(){
        try {
            await api.post("/api/logout/", { refresh: localStorage.getItem("refresh") });
        } finally {
            logout();
            navigate("/login");
        }
    }
    return (
    <button className="logout-button" onClick={handleLogout}>გასვლა</button>
    );
}


export default Logout
