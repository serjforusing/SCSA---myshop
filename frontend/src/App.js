import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './components/Header';
import Products from './pages/Products';
import CreateProducts from './pages/CreateProducts';
import ProtectedRoute from './components/ProtectedRoute';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./styles/App.css";
import { AuthProvider } from "./context/AuthContext";
import EditProduct from './pages/EditProducts';
import ProductDetails from './pages/ProductDetails';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';


function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <div className="app">
        <Header/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Register />}/>
          <Route path="/products" element={<Products />}/>
          <Route path="/products/:id" element={<ProductDetails />}/>
          <Route path="/create-product" element={<ProtectedRoute><CreateProducts /></ProtectedRoute>}/>
          <Route path="/edit-product/:id" element={<ProtectedRoute><EditProduct /></ProtectedRoute>}/>
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>}/>
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>}/>
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>}/>
          <Route path="*" element={<NotFound />}/>
        </Routes>
        <Footer/>
      </div>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
