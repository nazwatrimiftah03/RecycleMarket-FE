import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Plus, Trash2, LogOut, User, MapPin, Phone, Edit, X } from "lucide-react";
import LogoImage from "../assets/logo.png";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent } from "../components/ui/card";
import { useAuth } from "../contexts/AuthContext";
import { useProducts } from "../contexts/ProductContext";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { toast } from 'sonner';

export function DashboardAdmin() {
  const navigate = useNavigate();
  const { admin, logout, isAuthenticated, isSuperAdmin } = useAuth();
  const { products, loading, error, addProduct, deleteProduct, updateProduct, fetchMyProducts } = useProducts();

  const [showForm, setShowForm] = useState(false);
  
  // State untuk mode Edit
  const [editingProduct, setEditingProduct] = useState(null);

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

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login-admin");
    } else {
      if (isSuperAdmin) {
          navigate("/super-admin-dashboard");
          return;
      }
      fetchMyProducts();
    }
  }, [isAuthenticated, navigate, fetchMyProducts, isSuperAdmin]);

  if (!admin || isSuperAdmin) return null;

  const myProducts = products.filter(p => p.adminId.toString() === admin.id.toString()); 

  const handleChange = (e) => {
    const { id, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'number' ? (e.target.valueAsNumber || 0) : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("File harus berupa gambar!");
        e.target.value = ''; 
        setFormData(prev => ({ ...prev, imageFile: null }));
        setImagePreviewUrl("");
        return;
      }

      if (file.size > 5 * 1024 * 1024) { 
        toast.error("Ukuran file maksimal 5MB!");
        e.target.value = ''; 
        setFormData(prev => ({ ...prev, imageFile: null }));
        setImagePreviewUrl("");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        imageFile: file, 
      }));
      
      setImagePreviewUrl(URL.createObjectURL(file)); 
    } else {
      // Jika mode edit dan user cancel pilih file, jangan reset preview lama
      if (!editingProduct) {
          setFormData(prev => ({ ...prev, imageFile: null }));
          setImagePreviewUrl("");
      }
    }
  };

  // Fungsi: Masuk Mode Edit
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        imageFile: null // Reset input file baru
    });
    setImagePreviewUrl(product.image); // Tampilkan gambar lama
    setShowForm(true); // Buka form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fungsi: Batal Edit / Tutup Form
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({ name: "", description: "", price: "", imageFile: null, stock: 1 });
    setImagePreviewUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi: Wajib ada gambar jika Tambah Baru
    if (!editingProduct && !formData.imageFile) {
        toast.error("Harap unggah file gambar untuk produk.");
        return;
    }

    const productFormData = new FormData();
    productFormData.append('name', formData.name);
    productFormData.append('description', formData.description);
    productFormData.append('price', formData.price);
    productFormData.append('stock', formData.stock);
    
    if (formData.imageFile) {
        productFormData.append('image', formData.imageFile); 
    }
    
    let success = false;

    if (editingProduct) {
        // --- UPDATE ---
        success = await updateProduct(editingProduct.id, productFormData);
        // Toast success sudah ada di context
    } else {
        // --- CREATE ---
        success = await addProduct(productFormData);
        // Toast success sudah ada di context
    }

    if (success) {
        if (imagePreviewUrl && formData.imageFile) URL.revokeObjectURL(imagePreviewUrl); 
        handleCancelForm(); // Reset form dan keluar mode edit
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const startEditStock = (product) => {
    setEditingStockId(product.id);
    setNewStockValue(product.stock);
  };

  const saveStock = async (product) => {
    const stockValue = parseInt(newStockValue);
    if (stockValue < 0 || isNaN(stockValue)) {
        toast.error("Stok harus berupa angka positif.");
        return;
    }
    
    const success = await updateProduct(product.id, {
        stock: stockValue, 
    });

    if (success) {
        setEditingStockId(null); 
    }
  };

  const handleDeleteProduct = async (id) => {
    if(!window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;
    await deleteProduct(id);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header - Tetap Sesuai Asli */}
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
              <span className="text-green-600">ReCycle Market - Seller</span>
            </div>
            <Button onClick={handleLogout} variant="outline" className="gap-2">
              <LogOut className="size-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section - Tetap Sesuai Asli */}
        <div className="bg-green-500 rounded-lg p-6 mb-6">
          <h1 className="text-black mb-2">Dashboard Seller</h1>
          <div className="flex flex-wrap gap-4 text-white text-sm">
            <div className="flex items-center gap-2">
              <User className="size-4 text-black"/>
              <span className="text-black">{admin.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="size-4 text-black" />
              <span className="text-black">{admin.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-black" />
              <span className="text-black">{admin.location}</span>
            </div>
          </div>
        </div>

        {/* Add Product Button */}
        <div className="mb-6">
          {/* Jika sedang tidak tampil form, munculkan tombol tambah */}
          {!showForm && (
            <Button onClick={() => setShowForm(true)} className="bg-green-500 hover:bg-green-600 gap-2 text-black">
                <Plus className="size-4" />
                Tambah Barang Baru
            </Button>
          )}
        </div>

        {/* Form Tambah / Edit Barang */}
        {showForm && (
          <Card className="mb-6 bg-white border-2 border-gray-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                  <h2 className="text-gray-900 font-bold">
                      {editingProduct ? "Edit Barang" : "Form Tambah Barang"}
                  </h2>
                  {/* Tombol X Kecil untuk tutup form */}
                  <Button variant="ghost" size="sm" onClick={handleCancelForm}>
                      <X className="size-4" />
                  </Button>
              </div>

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
                
                <div className="space-y-2">
                  <Label htmlFor="stock">Stok Tersedia</Label>
                  <Input id="stock" type="number" min="0" placeholder="Contoh: 5" value={formData.stock} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageFile">Upload Foto Barang {editingProduct && "(Kosongkan jika tidak diganti)"}</Label>
                  <Input id="imageFile" type="file" accept="image/*" onChange={handleImageChange} className="cursor-pointer" required={!editingProduct && !imagePreviewUrl} /> 
                  <p className="text-gray-500 text-sm">Format: JPG, PNG, WEBP (Max 5MB)</p>

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

                <div className="flex gap-2">
                    <Button type="submit" className="flex-1 bg-green-500 hover:bg-green-600 text-black">
                        {editingProduct ? "Simpan Perubahan" : "Simpan Barang"}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCancelForm} className="flex-1 border-gray-400">
                        Batal
                    </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Products List - CARD ASLI (bg-green-100) */}
        <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
          <h2 className="text-gray-900 mb-4">Barang Saya ({myProducts.length})</h2>
          
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
                                    <Edit className="size-4" />Jual
                                </Button>
                            )}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-green-300">
                        <p className="text-sm text-gray-700"><strong>Penjual:</strong> {product.sellerName}</p>
                        <p className="text-sm text-gray-700"><strong>WhatsApp:</strong> {product.sellerPhone}</p>
                      </div>

                      {/* Tombol Aksi: Edit dan Hapus Berdampingan */}
                      <div className="flex gap-2 mt-3">
                          {/* Tombol Edit */}
                          <Button 
                            onClick={() => handleEditClick(product)} 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 bg-white border-green-600 text-green-700 hover:bg-green-50"
                          >
                            <Edit className="size-4 mr-1" />
                            Edit
                          </Button>

                          {/* Tombol Hapus */}
                          <Button 
                            onClick={() => handleDeleteProduct(product.id)} 
                            variant="destructive" 
                            size="sm" 
                            className="flex-1 gap-1"
                          >
                            <Trash2 className="size-4" />
                            Hapus
                          </Button>
                      </div>

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