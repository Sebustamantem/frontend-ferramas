import { useNavigate } from "react-router-dom"
import { Clock } from "lucide-react"

const Pending = () => {
    const navigate = useNavigate()
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
                <div className="flex justify-center mb-6">
                    <Clock size={64} className="text-yellow-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Pago pendiente</h1>
                <p className="text-gray-400 text-sm mb-6">Tu pago está siendo procesado. Te notificaremos cuando se confirme.</p>
                <button onClick={() => navigate("/")}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition">
                    Volver al inicio
                </button>
            </div>
        </div>
    )
}

export default Pending