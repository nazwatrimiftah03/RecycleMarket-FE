import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { LogOut, Trash2 } from "lucide-react";
import LogoImage from "../assets/logo.png";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useAuth } from "../contexts/AuthContext";
import { useProducts } from "../contexts/ProductContext";

export function SuperAdminDashboard() {
  const navigate = useNavigate();
  const { admin, logout, isAuthenticated, isSuperAdmin, fetchAllAdmins, deleteAdminAccount } = useAuth();
  const { products, loading, fetchAllProducts, deleteProduct } = useProducts();

  const [allSellers, setAllSellers] = useState([]);
  const [loadingSellers, setLoadingSellers] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login-admin");
    } else if (!isSuperAdmin) {
      navigate("/dashboard-admin");
    }
  }, [isAuthenticated, isSuperAdmin, navigate]);

  useEffect(() => {
    if (isSuperAdmin) fetchAllProducts();
  }, [isSuperAdmin, fetchAllProducts]);
  
  const loadAllAdmins = useCallback(async () => {
    if (isSuperAdmin) {
      setLoadingSellers(true);
      const data = await fetchAllAdmins();
      setAllSellers(data.filter(a => !a.isSuperAdmin));
      setLoadingSellers(false);
    }
  }, [isSuperAdmin, fetchAllAdmins]);
  
  useEffect(() => {
    loadAllAdmins();
  }, [loadAllAdmins]);

  if (!admin || !isSuperAdmin) return null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Yakin ingin menghapus produk "${name}"?`)) return;
    const success = await deleteProduct(id, true); 
    if(success) fetchAllProducts(); 
  };
  
  const handleDeleteAdmin = async (id, name) => {
    if (!window.confirm(`Yakin ingin menghapus akun "${name}"?`)) return;
    const success = await deleteAdminAccount(id);
    if(success) {
        loadAllAdmins();
        fetchAllProducts();
    }
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    let cleaned = phone.replace(/[^0-9]/g, ''); 
    if (cleaned.startsWith('0')) cleaned = cleaned.substring(1); 
    return `+62${cleaned}`; 
  };

  return (
    <div className="min-h-screen bg-gray-100">
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
                    <span className="text-green-600">ReCycle Market - Dashboard Admin</span>
                  </div>
                  <Button onClick={handleLogout} variant="outline" className="gap-2">
                    <LogOut className="size-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-green-500 rounded-lg p-6 mb-6 text-white">
          <div>
          <h1 className="judul-team">Selamat Datang, {admin.name}</h1>
          </div>
          <p className="text-sm opacity-90 text-black">Panel kontrol Super Admin.</p>
        </div>
        
        <div className="space-y-8">
            {/* Tabel Data Seller */}
            <Card className="bg-white border-2 border-gray-300 overflow-hidden">
                <CardHeader className="p-6 border-b border-gray-200">
                    <CardTitle className="text-xl font-bold">Daftar Seller ({allSellers.length})</CardTitle>
                    <p className="text-gray-500 text-sm">Semua daftar Seller yang ada pada ReCycle Market.</p>
                </CardHeader>
                <CardContent className="p-0">
                    {loadingSellers ? (
                        <div className="text-center py-8 text-gray-500">Memuat data seller...</div>
                    ) : (
                        // Wrapper Scroll Horizontal
                        <div className="responsive-table-wrapper">
                            <Table className="w-full border-collapse border border-gray-200 min-w-[800px]">
                                <TableHeader className="bg-gray-100">
                                    <TableRow>
                                        <TableHead className="whitespace-nowrap border border-gray-300 px-4 py-3 font-bold text-gray-700">Nama</TableHead>
                                        <TableHead className="whitespace-nowrap border border-gray-300 px-4 py-3 font-bold text-gray-700">Email</TableHead>
                                        <TableHead className="whitespace-nowrap border border-gray-300 px-4 py-3 font-bold text-gray-700">Lokasi</TableHead>
                                        <TableHead className="whitespace-nowrap border border-gray-300 px-4 py-3 font-bold text-gray-700">No. HP</TableHead>
                                        <TableHead className="whitespace-nowrap border border-gray-300 px-4 py-3 font-bold text-center w-20">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {allSellers.map((seller) => (
                                        <TableRow key={seller.id} className="hover:bg-gray-50">
                                            <TableCell className="whitespace-nowrap border border-gray-300 px-4 py-3 font-medium">{seller.name}</TableCell>
                                            <TableCell className="whitespace-nowrap border border-gray-300 px-4 py-3">{seller.email}</TableCell>
                                            <TableCell className="whitespace-nowrap border border-gray-300 px-4 py-3">{seller.location}</TableCell>
                                            <TableCell className="whitespace-nowrap border border-gray-300 px-4 py-3">
                                                <a href={`https://wa.me/${formatPhoneNumber(seller.phone)}`} target="_blank" rel="noreferrer" className="text-green-600 hover:underline font-medium">
                                                    {seller.phone}
                                                </a>
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap border border-gray-300 px-4 py-3 text-center">
                                                <Button variant="destructive" size="sm" onClick={() => handleDeleteAdmin(seller.id, seller.name)}>
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Daftar Produk (Card Grid) */}
            <Card className="bg-white border-2 border-gray-300">
                <CardHeader className="p-6 border-b border-gray-200">
                    <CardTitle className="text-xl font-bold">Semua Produk ({products.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    {(loading && products.length === 0) ? (
                        <div className="text-center py-8 text-gray-500">Memuat...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> 
                            {products.map((product) => (
                                <Card key={product.id} className="bg-green-100 border-2 border-green-300 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="mb-3">
                                            <h3 className="text-green-900 text-lg font-bold truncate">{product.name}</h3>
                                        </div>
                                        <div className="bg-white rounded-lg mb-3 h-48 flex items-center justify-center overflow-hidden border border-green-200">
                                            <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="space-y-1 mb-3 text-sm">
                                            <p className="text-gray-700 line-clamp-2 min-h-[2.5em]">{product.description}</p>
                                            <p className="text-green-800 text-xl font-bold">{product.price}</p>
                                        </div>
                                        <div className="py-2 mb-3 border-y border-green-300 text-sm flex justify-between items-center bg-white/50 px-2 rounded">
                                            <span className="text-gray-700">Stok: <strong>{product.stock}</strong></span>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${product.status === "Terjual" ? "bg-red-100 text-red-700" : "bg-green-200 text-green-800"}`}>
                                                {product.status}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-600 space-y-1 mb-4">
                                            <div className="flex items-center gap-1">User: <span className="font-semibold">{product.sellerName}</span></div>
                                            <div className="flex items-center gap-1">Lokasi: {product.location}</div>
                                        </div>
                                        <Button onClick={() => handleDeleteProduct(product.id, product.name)} variant="destructive" size="sm" className="w-full gap-2">
                                            <Trash2 className="size-4" /> Hapus Produk
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}