import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./AuthContext"
import api from "../api/axios"

const CartContext = createContext()

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([])
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()

    useEffect(() => {
        if (user) fetchCart()
        else setCart([])
    }, [user])

    const fetchCart = async () => {
        try {
            const res = await api.get("/cart")
            setCart(res.data)
        } catch (err) {
            console.error(err)
        }
    }

    const addToCart = async (product_id) => {
        if (!user) return false
        try {
            setLoading(true)
            await api.post("/cart", { product_id, quantity: 1 })
            await fetchCart()
            return true
        } catch (err) {
            console.error(err)
            return false
        } finally {
            setLoading(false)
        }
    }

    const removeFromCart = async (productId) => {
        try {
            await api.delete(`/cart/${productId}`)
            await fetchCart()
        } catch (err) {
            console.error(err)
        }
    }

    const clearCart = () => setCart([])

    const total = cart.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0)
    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0)

    return (
        <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, clearCart, total, itemCount, fetchCart }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)