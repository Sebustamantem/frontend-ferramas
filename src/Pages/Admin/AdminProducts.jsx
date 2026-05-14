import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { Plus, Pencil, Trash2, X, Upload } from "lucide-react"
import api from "../../api/axios"

const categories = [
    "Herramientas", "Construcción", "Electricidad",
    "Plomería", "Pintura", "Jardín", "Fijaciones", "Otros"
]

const emptyForm = { name: "", description: "", price: "", stock: "", category: "" }

const AdminProducts = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [editingId, setEditingId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (!user || user.role !== "admin") {
            navigate("/")
            return
        }
        fetchProducts()
    }, [user])

    const fetchProducts = async () => {
        try {
            const res = await api.get("/products")
            setProducts(res.data)
        } catch (err) {
            console.error(err)
        }
    }

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            const formData = new FormData()
            formData.append("name", form.name)
            formData.append("description", form.description)
            formData.append("price", form.price)
            formData.append("stock", form.stock)
            formData.append("category", form.category)
            if (imageFile) formData.append("image", imageFile)

            if (editingId) {
                await api.put(`/products/${editingId}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                })
            } else {
                await api.post("/products", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                })
            }
            handleCloseModal()
            fetchProducts()
        } catch (err) {
            setError(err.response?.data?.message || "Error al guardar producto")
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (product) => {
        setForm({
            name: product.name,
            description: product.description || "",
            price: product.price,
            stock: product.stock,
            category: product.category || ""
        })
        setImagePreview(product.image_url || null)
        setImageFile(null)
        setEditingId(product.id)
        setShowModal(true)
    }

    const handleDelete = async (id) => {
        if (!confirm("¿Estás seguro de eliminar este producto?")) return
        try {
            await api.delete(`/products/${id}`)
            fetchProducts()
        } catch (err) {
            console.error(err)
        }
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setForm(emptyForm)
        setImageFile(null)
        setImagePreview(null)
        setEditingId(null)
        setError("")
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Panel Admin</h1>
                        <p className="text-gray-500 text-sm mt-1">Gestión de productos — {products.length} productos</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-orange-500 text-white px-5 py-3 rounded-xl font-semibold hover:bg-orange-600 transition shadow-md"
                    >
                        <Plus size={20} />
                        Agregar Producto
                    </button>
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-2xl shadow overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4 text-left">Producto</th>
                                <th className="px-6 py-4 text-left">Categoría</th>
                                <th className="px-6 py-4 text-left">Precio</th>
                                <th className="px-6 py-4 text-left">Stock</th>
                                <th className="px-6 py-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                        No hay productos aún. ¡Agrega el primero!
                                    </td>
                                </tr>
                            ) : (
                                products.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {p.image_url ? (
                                                    <img src={p.image_url} alt={p.name}
                                                        className="w-12 h-12 object-cover rounded-lg border border-gray-200" />
                                                ) : (
                                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                                                        Sin img
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-semibold text-gray-800">{p.name}</p>
                                                    <p className="text-gray-400 text-xs line-clamp-1">{p.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-orange-100 text-orange-600 text-xs px-3 py-1 rounded-full font-medium">
                                                {p.category || "Sin categoría"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">
                                            ${Number(p.price).toLocaleString("es-CL")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${p.stock > 10 ? "bg-green-100 text-green-600" :
                                                    p.stock > 0 ? "bg-yellow-100 text-yellow-600" :
                                                        "bg-red-100 text-red-600"
                                                }`}>
                                                {p.stock} unidades
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => handleEdit(p)}
                                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition">
                                                    <Pencil size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(p.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative max-h-[90vh] overflow-y-auto">
                        <button onClick={handleCloseModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                        <h2 className="text-xl font-bold text-gray-800 mb-6">
                            {editingId ? "Editar Producto" : "Nuevo Producto"}
                        </h2>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-sm py-2 px-4 rounded-xl mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input type="text" name="name" placeholder="Nombre del producto"
                                value={form.name} onChange={handleChange} required
                                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50" />

                            <textarea name="description" placeholder="Descripción"
                                value={form.description} onChange={handleChange} rows={3}
                                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 resize-none" />

                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" name="price" placeholder="Precio ($)"
                                    value={form.price} onChange={handleChange} required min="0"
                                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50" />
                                <input type="number" name="stock" placeholder="Stock"
                                    value={form.stock} onChange={handleChange} required min="0"
                                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50" />
                            </div>

                            <select name="category" value={form.category} onChange={handleChange} required
                                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50">
                                <option value="">Selecciona categoría</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>

                            {/* Subida de imagen */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">Imagen del producto</label>
                                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition">
                                    <Upload size={24} className="text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-500">Haz clic para subir una imagen</span>
                                    <span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP</span>
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                </label>

                                {imagePreview && (
                                    <img src={imagePreview} alt="preview"
                                        className="w-full h-48 object-contain rounded-xl border border-gray-200 bg-gray-50" />
                                )}
                            </div>

                            <button type="submit" disabled={loading}
                                className="bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-60 mt-1">
                                {loading ? "Guardando..." : editingId ? "Actualizar Producto" : "Agregar Producto"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminProducts