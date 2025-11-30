// src/pages/Home.jsx

import { useState, useEffect } from "react"; 
import { Search, User, MapPin } from "lucide-react";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useProducts } from "../contexts/ProductContext";

export function Home() {
  // Gunakan products, loading, error, fetchAvailableProducts dari context
  const { products, loading, error, fetchAvailableProducts } = useProducts(); 
  const [searchTerm, setSearchTerm] = useState(""); 

  // Panggil fetchAvailableProducts saat komponen dimount
  useEffect(() => {
    fetchAvailableProducts();
  }, [fetchAvailableProducts]);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

    // Filter produk dari state lokal (data sudah dari backend endpoint /available)
    const filteredProducts = products.filter(product => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    const matchesName = product.name.toLowerCase().includes(lowerCaseSearch);
    const matchesDescription = product.description.toLowerCase().includes(lowerCaseSearch);
    return matchesName || matchesDescription;
  });

  // Fungsi utilitas untuk membersihkan nomor telepon (misal: menghilangkan spasi dan tanda hubung)
  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    // Menghilangkan semua karakter non-angka
    return phone.replace(/[^0-9]/g, '');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-green-600 rounded-lg p-6 mb-6">
        <h1 className="text-black text-3xl font-semibold mb-3">Tentang ReCycle Market</h1>
        <p className="text-black text-sm leading-relaxed">
          Recycle Market adalah sebuah Website yang menyediakan layanan dalam memberikan informasi tentang
          produk barang bekas yang dijual, dimana setiap produk dilengkapi dengan informasi detail,
          termasuk nama, deskripsi, foto, lokasi, dan harga yang lebih transparan, harga jualannya sehingga dapat
          membantu mengurangi kesulitan dalam mencari barang bekas berkualitas oleh pengguna, Website ini juga
          memiliki fitur untuk penjual untuk ingin memposting barang jualannya sehingga dapat dilihat oleh
          pembeli untuk mencari barang yang ingin mereka beli.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Pencarian: Cari barang"
            className="pl-10 bg-white border-gray-300"
            value={searchTerm} 
            onChange={handleSearchChange} 
          />
        </div>
      </div>

      {/* Handling Loading and Error States */}
      {loading && (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-gray-300">
            <p className="text-gray-500">Memuat data produk...</p>
        </div>
      )}
      
      {error && !loading && (
        <div className="text-center py-12 bg-red-50 rounded-lg border-2 border-red-300">
            <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Products Grid */}
      {/* Tampilkan jika tidak loading, tidak error, dan tidak ada hasil atau pencarian kosong */}
      {!loading && !error && filteredProducts.length === 0 ? ( 
        <div className="text-center py-12 bg-white rounded-lg border-2 border-gray-300">
          <p className="text-gray-500">
            {searchTerm 
              ? `Tidak ada barang yang ditemukan dengan kata kunci "${searchTerm}".`
              : `Belum ada barang yang dijual atau semua stok sudah habis.`
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="bg-green-100 border-2 border-green-300 overflow-hidden">
              <CardContent className="p-4">
                {/* Product Header */}
                <div className="mb-3">
                  <h3 className="text-green-800 text-xl font-semibold mb-1">{product.name}</h3>
                </div>

                {/* Product Image */}
                <div className="bg-gray-200 rounded-lg mb-3 overflow-hidden h-40 flex items-center justify-center">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="space-y-1 mb-3 text-sm">
                  <p className="text-gray-900">Deskripsi Produk: {product.description}</p>
                  <p className="text-gray-900 text-lg font-bold">Harga: {product.price}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <User className="size-4" />
                    <span>{product.sellerName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-700">
                    <MapPin className="size-4" />
                    <span>Lokasi: {product.location}</span>
                  </div>
                  
                </div>
                
                {/* Info Stok */}
                <div className="py-2 mb-3 border-y border-green-300">
                    <p className="text-sm text-green-700 font-semibold">
                        Stok Tersedia: {product.stock}
                    </p>
                </div>

                {/* Product Description Box */}
                <div className="bg-white border-2 border-green-800 rounded-lg p-3 space-y-2">
                  <p className="text-sm text-gray-700">Klik Nomor saya untuk transaksi:</p>
                  <p className="text-sm text-gray-700">
                    Whatsapp: 
                    {/* Tambahkan tag <a> dengan link wa.me */}
                    <a 
                        href={`https://wa.me/${formatPhoneNumber(product.sellerPhone)}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:underline ml-1 font-semibold"
                    >
                        {product.sellerPhone}
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}