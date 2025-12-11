import { Card, CardContent } from "../components/ui/card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const tips = [
  {
    id: 1,
    title: "Kurangi Penggunaan Plastik Sekali Pakai",
    description: "Kurangi penggunaan plastik yang hanya sekali pakai dan sekolah atau tempat bekerja adalah praktik yang baik.",
    image: "https://images.unsplash.com/photo-1677753670021-123aba554171?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXVzYWJsZSUyMHNob3BwaW5nJTIwYmFnfGVufDF8fHx8MTc2NDAzMjU3N3ww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 2,
    title: "Kelola Sampah Plastik dengan Benar",
    description: "Memilih produk dengan kemasan yang dapat didaur ulang atau kemasan minimal dapat mengurangi limbah plastik.",
    image: "https://images.unsplash.com/photo-1653406384710-08688ec6b979?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFzdGljJTIwYm90dGxlcyUyMHJlY3ljbGluZ3xlbnwxfHx8fDE3NjQwNTU1OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 3,
    title: "Daur Ulang Kemasan",
    description: "Pastikan untuk memisahkan sampah organik dan anorganik dengan benar untuk memudahkan proses daur ulang.",
    image: "https://www.greeners.co/wp-content/uploads/2023/06/P3-26-06-2023.jpg"
  },
  {
    id: 4,
    title: "Gunakan kembali barang bekas yang masih layak pakai",
    description: "Membawa tas belanja sendiri saat berbelanja dapat mengurangi penggunaan kantong plastik sekali pakai.",
    image: "https://images.unsplash.com/photo-1617080090911-91409e3496ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxoYW5kcyUyMGhlYXJ0JTIwdm9sdW50ZWVyfGVufDF8fHx8MTc2NDEyNTQwNXww&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

export function EcoTips() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-green-500 rounded-lg p-8 mb-8 flex flex-col md:flex-row items-center justify-start gap-6">
        
        <h1 className="judul-eco">
          Eco-Tips
        </h1>
        
        <div className="text-white text-right flex-1">
          <h2 className="subjudul-eco">
            Mulai Hidup Ramah Lingkungan dari Sekarang
          </h2>
        </div>
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tips.map((tip) => (
          <Card 
            key={tip.id} 
            className="bg-green-100 border-2 border-green-300 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-0">
              
              {/* Image Container (h-40 agar lebih proporsional) */}
              <div className="bg-gray-100 h-40 flex items-center justify-center overflow-hidden">
                <ImageWithFallback
                  src={tip.image}
                  alt={tip.title}
                  // Ganti object-cover untuk memastikan gambar mengisi kotak
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Content */}
              <div className="p-4 space-y-2">
                <h3 className="text-green-600 text-base font-semibold text-center">
                  {tip.title}
                </h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">
                  {tip.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}