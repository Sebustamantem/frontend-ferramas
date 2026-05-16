import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { Pencil, Trash2, X, Shield, User } from "lucide-react"
import api from "../../api/axios"

const AdminUsers = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingUser, setEditingUser] = useState(null)
    const [form, setForm] = useState({ name: "", lastname: "", email: "", phone: "" })
    const [error, setError] = useState("")
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!user || user.role !== "admin") { navigate("/"); return }
        fetchUsers()
    }, [user])

    const fetchUsers = async () => {
        try {
            const res = await api.get("/users")
            setUsers(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (u) => {
        setEditingUser(u)
        setForm({ name: u.name, lastname: u.lastname || "", email: u.email, phone: u.phone || "" })
        setShowModal(true)
        setError("")
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError("")
        try {
            await api.put(`/users/${editingUser.id}`, form)
            setShowModal(false)
            fetchUsers()
        } catch (err) {
            setError(err.response?.data?.message || "Error al actualizar usuario")
        } finally {
            setSaving(false)
        }
    }

    const handleRoleChange = async (id, role) => {
        if (!confirm(`¿Cambiar rol a "${role}"?`)) return
        try {
            await api.put(`/users/${id}/role`, { role })
            fetchUsers()
        } catch (err) {
            console.error(err)
        }
    }

    const handleDelete = async (id) => {
        if (id === user.id) return alert("No puedes eliminarte a ti mismo")
        if (!confirm("¿Eliminar este usuario?")) return
        try {
            await api.delete(`/users/${id}`)
            fetchUsers()
        } catch (err) {
            console.error(err)
        }
    }

    const roleColors = {
        admin: "bg-orange-100 text-orange-600",
        cliente: "bg-blue-100 text-blue-600"
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
                        <p className="text-gray-500 text-sm mt-1">{users.length} usuarios registrados</p>
                    </div>
                    <button onClick={() => navigate("/admin/products")}
                        className="text-sm text-orange-500 hover:underline font-medium">
                        ← Volver a productos
                    </button>
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-2xl shadow overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4 text-left">Usuario</th>
                                    <th className="px-6 py-4 text-left">RUT</th>
                                    <th className="px-6 py-4 text-left">Teléfono</th>
                                    <th className="px-6 py-4 text-left">Rol</th>
                                    <th className="px-6 py-4 text-left">Registro</th>
                                    <th className="px-6 py-4 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">
                                                    {u.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">{u.name} {u.lastname}</p>
                                                    <p className="text-gray-400 text-xs">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{u.rut || "—"}</td>
                                        <td className="px-6 py-4 text-gray-600">{u.phone || "—"}</td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={u.role}
                                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                disabled={u.id === user.id}
                                                className={`text-xs font-semibold px-3 py-1 rounded-full border-0 cursor-pointer ${roleColors[u.role]}`}
                                            >
                                                <option value="cliente">cliente</option>
                                                <option value="admin">admin</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-xs">
                                            {new Date(u.created_at).toLocaleDateString("es-CL")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => handleEdit(u)}
                                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition">
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(u.id)}
                                                    disabled={u.id === user.id}
                                                    className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition disabled:opacity-30">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal editar */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
                        <button onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Editar Usuario</h2>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-sm py-2 px-4 rounded-xl mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSave} className="flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-gray-500 font-medium">Nombre</label>
                                    <input type="text" value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        required className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-gray-500 font-medium">Apellidos</label>
                                    <input type="text" value={form.lastname}
                                        onChange={(e) => setForm({ ...form, lastname: e.target.value })}
                                        className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-500 font-medium">Email</label>
                                <input type="email" value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    required className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50" />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-500 font-medium">Teléfono</label>
                                <input type="text" value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50" />
                            </div>

                            <button type="submit" disabled={saving}
                                className="bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-60 mt-1">
                                {saving ? "Guardando..." : "Guardar Cambios"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminUsers