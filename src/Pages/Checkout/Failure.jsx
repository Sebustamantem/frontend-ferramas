import { useNavigate } from "react-router-dom"
import { XCircle } from "lucide-react"

const Failure = () => {
    const navigate = useNavigate()
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
                <div className="flex justify-center mb-6">
                    <XCircle size={64} className="text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Pago fallido</h1>
                <p className="text-gray-400 text-sm mb-6">Hubo un problema con tu pago. Por favor intenta nuevamente.</p>
                <div className="flex flex-col gap-3">
                    <button onClick={() => navigate("/checkout")}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition">
                        Intentar nuevamente
                    </button>
                    <button onClick={() => navigate("/")}
                        className="w-full border border-gray-200 text-gray-600 hover:bg-gray-50 py-3 rounded-xl font-semibold transition">
                        Volver al inicio
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Failure