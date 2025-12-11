import { useState, useEffect } from "react"; 
import { Search, User, MapPin, Phone } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useProducts } from "../contexts/ProductContext";

export function Home() {
  const { products, loading, error, fetchAvailableProducts } = useProducts(); 
  const [searchTerm, setSearchTerm] = useState(""); 

  useEffect(() => {
    fetchAvailableProducts(); 
  }, [fetchAvailableProducts]);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter(product => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    const matchesName = product.name.toLowerCase().includes(lowerCaseSearch);
    const matchesDescription = product.description.toLowerCase().includes(lowerCaseSearch);
    return matchesName || matchesDescription;
  });

  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    let cleaned = phone.replace(/[^0-9]/g, ''); 
    if (cleaned.startsWith('0')) {
        cleaned = cleaned.substring(1); 
    }
    return `62${cleaned}`; 
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-green-500 rounded-lg p-6 mb-6 flex items-center justify-center text-center">
        <div>
        <h1 className="judul-home">Selamat Datang di Recycle Market, Tempat jual beli barang bekas terbaik</h1>
        </div>
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

      {loading && (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-gray-300">
            <p className="text-gray-500">Memuat data produk...</p>
        </div>
      )}
      
      {error && !loading && (
        <div className="text-center py-12 bg-red-50 rounded-lg border-2 border-red-300">
            <p className="text-red-700 font-semibold">Error: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
        {filteredProducts.length === 0 ? ( 
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

                    <div className="bg-white border-2 border-green-800 rounded-lg p-3 space-y-2">
                      <p className="text-sm text-gray-700">Klik tombol di bawah untuk transaksi:</p>
                      
                      <div className="mt-2">
                        <Button 
                            asChild
                            className="w-full bg-green-500 hover:bg-green-600 text-black"
                        >
                          <a 
                              href={`https://wa.me/${formatPhoneNumber(product.sellerPhone)}`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="flex items-center justify-center gap-2"
                          >
                              <Phone className="size-4" /> 
                              Hubungi Penjual (WA: {product.sellerPhone})
                          </a>
                        </Button>
                      </div>
                      
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
        )}
        </>
      )}
    </div>
  );
}