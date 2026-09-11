import { createContext, useState } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem("access")
    );

    function login(access, refresh) {
        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);
        setIsAuthenticated(true);
    }

    function logout() {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setIsAuthenticated(false);
    }

    return (
       <AuthContext.Provider
        value={{ isAuthenticated, login, logout }}
    >
        {children}
    </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };
