// src/pages/DashboardAdmin.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Plus, Trash2, LogOut, User, MapPin, Phone, Edit } from "lucide-react";
import LogoImage from "../assets/logo.png";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent } from "../components/ui/card";
import { useAuth } from "../contexts/AuthContext";
import { useProducts } from "../contexts/ProductContext";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function DashboardAdmin() {
  const navigate = useNavigate();
  const { admin, logout, isAuthenticated } = useAuth();
  const { products, loading, error, addProduct, deleteProduct, updateProduct, fetchMyProducts } = useProducts();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageFile: null, 
    stock: 1, 
  });
  const [imagePreviewUrl, setImagePreviewUrl] = useState(""); 
  
  const [editingStockId, setEditingStockId] = useState(null);
  const [newStockValue, setNewStockValue] = useState(0);

  // Efek untuk otentikasi dan memuat produk admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login-admin");
    } else {
      fetchMyProducts();
    }
  }, [isAuthenticated, navigate, fetchMyProducts]);

  if (!admin) return null;

  // Gunakan filter dari data products lokal (yang sudah di-fetch oleh fetchMyProducts)
  const myProducts = products.filter(p => p.adminId.toString() === admin.id.toString()); 

  const handleChange = (e) => {
    const { id, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Gunakan valueAsNumber untuk input type="number"
      [id]: type === 'number' ? (e.target.valueAsNumber || 0) : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // validate file type
      if (!file.type.startsWith("image/")) {
        alert("File harus berupa gambar!");
        e.target.value = ''; // Clear file input
        setFormData(prev => ({ ...prev, imageFile: null }));
        setImagePreviewUrl("");
        return;
      }

      // validate size (Diubah ke 5MB agar konsisten dengan asumsi backend)
      if (file.size > 5 * 1024 * 1024) { 
        alert("Ukuran file maksimal 5MB!");
        e.target.value = ''; // Clear file input
        setFormData(prev => ({ ...prev, imageFile: null }));
        setImagePreviewUrl("");
        return;
      }

      // 1. Simpan file mentah ke formData
      setFormData((prev) => ({
        ...prev,
        imageFile: file, // SIMPAN FILE MENTAH
      }));
      
      // 2. Buat URL preview
      setImagePreviewUrl(URL.createObjectURL(file)); // Gunakan URL.createObjectURL untuk preview
    } else {
      setFormData(prev => ({ ...prev, imageFile: null }));
      setImagePreviewUrl("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Pastikan ada file gambar
    if (!formData.imageFile) {
        alert("Harap unggah file gambar untuk produk.");
        return;
    }

    // Buat objek FormData untuk mengirim data dan file
    const productFormData = new FormData();
    productFormData.append('name', formData.name);
    productFormData.append('description', formData.description);
    productFormData.append('price', formData.price);
    productFormData.append('stock', formData.stock);
    // Tambahkan file gambar dengan key 'image', sesuai yang diharapkan Multer di BE
    productFormData.append('image', formData.imageFile); 
    
    // Panggil addProduct dari context (yang kini memanggil API)
    const success = await addProduct(productFormData);

    if (success) {
        alert("Berhasil menambahkan barang!"); 
        if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl); 
        
        setFormData({ name: "", description: "", price: "", imageFile: null, stock: 1 });
        setImagePreviewUrl("");
        setShowForm(false);
    } else {
        alert("Gagal menambahkan produk. Cek konsol untuk detail error.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Fungsi untuk memulai edit stok
  const startEditStock = (product) => {
    setEditingStockId(product.id);
    setNewStockValue(product.stock);
  };

  // Fungsi untuk menyimpan perubahan stok
  const saveStock = async (product) => {
    const stockValue = parseInt(newStockValue);
    if (stockValue < 0 || isNaN(stockValue)) {
        alert("Stok harus berupa angka positif.");
        return;
    }
    
    // Panggil updateProduct dengan hanya data yang diubah
    const success = await updateProduct(product.id, {
        stock: stockValue, 
    });

    if (success) {
        setEditingStockId(null); 
        alert("Berhasil mengubah stok!");
    } else {
        alert("Gagal menyimpan stok.");
    }
  };

  // Modifikasi fungsi deleteProduct
  const handleDeleteProduct = async (id) => {
    // Note: Konfirmasi hapus sudah ada di ProductContext.jsx
    const success = await deleteProduct(id);
    if(success) {
      alert("Produk berhasil dihapus!");
    } else {
      alert("Gagal menghapus produk.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-green-100 border-b-2 border-gray-300">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center border-2 border-green-700">
                <img 
                    src={LogoImage}
                    alt="ReCycle Market Logo" 
                    className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center border-2 border-green-700 size-8 text-white object-cover"
                />
              </div>
              <span className="text-green-600">ReCycle Market - Admin</span>
            </div>
            <Button onClick={handleLogout} variant="outline" className="gap-2">
              <LogOut className="size-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-green-600 rounded-lg p-6 mb-6">
          <h1 className="text-white mb-2">Dashboard Admin</h1>
          <div className="flex flex-wrap gap-4 text-white text-sm">
            <div className="flex items-center gap-2">
              <User className="size-4" />
              <span>{admin.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="size-4" />
              <span>{admin.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="size-4" />
              <span>{admin.location}</span>
            </div>
          </div>
        </div>

        {/* Add Product Button */}
        <div className="mb-6">
          <Button onClick={() => setShowForm(!showForm)} className="bg-green-500 hover:bg-green-600 gap-2">
            <Plus className="size-4" />
            {showForm ? "Tutup Form" : "Tambah Barang Baru"}
          </Button>
        </div>

        {/* Add Product Form */}
        {showForm && (
          <Card className="mb-6 bg-white border-2 border-gray-300">
            <CardContent className="p-6">
              <h2 className="text-gray-900 mb-4">Form Tambah Barang</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Barang</Label>
                  <Input id="name" type="text" placeholder="Contoh: Tas Ransel" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea id="description" placeholder="Deskripsi barang..." value={formData.description} onChange={handleChange} rows={4} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Harga</Label>
                  <Input id="price" type="text" placeholder="Contoh: Rp.100.000" value={formData.price} onChange={handleChange} required />
                </div>
                
                {/* Field Stock */}
                <div className="space-y-2">
                  <Label htmlFor="stock">Stok Tersedia</Label>
                  <Input id="stock" type="number" min="0" placeholder="Contoh: 5" value={formData.stock} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageFile">Upload Foto Barang</Label>
                  <Input id="imageFile" type="file" accept="image/*" onChange={handleImageChange} className="cursor-pointer" required={!imagePreviewUrl} /> 
                  <p className="text-gray-500 text-sm">Format: JPG, PNG, WEBP (Max 5MB)</p>

                  {/* Image Preview */}
                  {imagePreviewUrl && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-700 mb-2">Preview:</p>
                      <div className="bg-gray-100 rounded-lg mb-3 overflow-hidden h-48 flex items-center justify-center">
                        <ImageWithFallback 
                            src={imagePreviewUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover" 
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
                  <p className="text-sm text-gray-700"><strong>Info Penjual (otomatis dari akun Anda):</strong></p>
                  <p className="text-sm text-gray-600">Nama: {admin.name}</p>
                  <p className="text-sm text-gray-600">No HP: {admin.phone}</p>
                  <p className="text-sm text-gray-600">Lokasi: {admin.location}</p>
                </div>

                <Button type="submit" className="w-full bg-green-500 hover:bg-green-600">Simpan Barang</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Products List */}
        <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
          <h2 className="text-gray-900 mb-4">Barang Saya ({myProducts.length})</h2>
          
          {/* Tampilkan status loading dan error */}
          {loading && <div className="text-center py-8 text-gray-500">Memuat data produk Anda...</div>}
          {error && !loading && <div className="text-center py-8 text-red-700">{error}</div>}

          {!loading && myProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Belum ada barang yang ditambahkan</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProducts.map((product) => (
                <Card key={product.id} className="bg-green-100 border-2 border-green-300 overflow-hidden">
                  <CardContent className="p-4">
                    {/* Product Image */}
                    <div className="bg-gray-200 rounded-lg mb-3 overflow-hidden h-40 flex items-center justify-center">
                      <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Product Info */}
                    <div className="space-y-2">
                      <h3 className="text-green-900 font-bold">{product.name}</h3>
                      <p className="text-gray-900">Deskripsi: {product.description}</p>
                      <p className="text-gray-900">Harga: {product.price}</p>
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <MapPin className="size-4" />
                        <span>{product.location}</span>
                      </div>
                      
                      {/* Tampilkan Edit Stok dan Status */}
                      <div className="flex items-center justify-between border-y border-green-300 py-2">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700">Stok: </span>
                            {editingStockId === product.id ? (
                                <Input 
                                    type="number" 
                                    min="0"
                                    value={newStockValue} 
                                    onChange={(e) => setNewStockValue(e.target.value)} 
                                    className="h-8 w-16 px-2 py-1 text-center"
                                />
                            ) : (
                                <strong className={`text-base ${product.stock > 0 ? "text-green-700" : "text-red-700"}`}>
                                    {product.stock}
                                </strong>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${product.status === "Terjual" ? "text-red-700" : "text-green-700"}`}>
                                Status: {product.status}
                            </span>
                            {editingStockId === product.id ? (
                                <Button size="sm" onClick={() => saveStock(product)} className="h-8">Simpan</Button>
                            ) : (
                                <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => startEditStock(product)}
                                    className="h-8 p-1 border-gray-400 text-gray-700 hover:bg-gray-500"
                                >
                                    <Edit className="size-4" />
                                </Button>
                            )}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-green-300">
                        <p className="text-sm text-gray-700"><strong>Penjual:</strong> {product.sellerName}</p>
                        <p className="text-sm text-gray-700"><strong>WhatsApp:</strong> {product.sellerPhone}</p>
                      </div>

                      {/* Menggunakan fungsi handleDeleteProduct yang baru */}
                      <Button onClick={() => handleDeleteProduct(product.id)} variant="destructive" size="sm" className="w-full gap-2 mt-3">
                        <Trash2 className="size-4" />
                        Hapus Barang
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}