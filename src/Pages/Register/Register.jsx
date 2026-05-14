import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { register as registerService } from "../../api/authService"
import { useAuth } from "../../context/AuthContext"
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react"

const Register = () => {
    const [form, setForm] = useState({ name: "", email: "", password: "" })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const validatePassword = (password) => {
        if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres"
        if (!/[A-Z]/.test(password)) return "Debe tener al menos una mayúscula"
        if (!/[0-9]/.test(password)) return "Debe tener al menos un número"
        if (!/[!@#$%^&*]/.test(password)) return "Debe tener al menos un carácter especial (!@#$%^&*)"
        return null
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        const passwordError = validatePassword(form.password)
        if (passwordError) {
            setError(passwordError)
            setLoading(false)
            return
        }

        try {
            const res = await registerService(form)
            login(res.data.user, res.data.token)
            navigate("/")
        } catch (err) {
            setError(err.response?.data?.message || "Error al registrarse")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-orange-600 px-4">
            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <img src="/images/Logo.png" alt="Ferremas" className="h-20 object-contain drop-shadow-lg" />
                </div>

                {/* Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">Crear Cuenta</h2>
                    <p className="text-center text-gray-400 text-sm mb-6">Regístrate para comenzar a comprar</p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm text-center py-2 px-4 rounded-xl mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        {/* Nombre */}
                        <div className="relative">
                            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="name"
                                placeholder="Nombre completo"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50"
                            />
                        </div>

                        {/* Email */}
                        <div className="relative">
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Correo electrónico"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50"
                            />
                        </div>

                        {/* Contraseña */}
                        <div className="flex flex-col gap-1">
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Contraseña"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-200 rounded-xl pl-11 pr-11 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 px-1">
                                Mínimo 8 caracteres, una mayúscula, un número y un carácter especial (!@#$%^&*)
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-60 mt-1"
                        >
                            {loading ? "Registrando..." : "Registrarse"}
                        </button>
                    </form>

                    <p className="text-center text-sm mt-5 text-gray-500">
                        ¿Ya tienes cuenta?{" "}
                        <Link to="/login" className="font-semibold text-orange-500 hover:underline">
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register