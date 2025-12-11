import { createContext, useContext, useState, useEffect, useCallback } from "react"; 
import { toast } from 'sonner'; // BARU: Impor toast
import { apiFetch } from '../utils/api'; 

const ProductContext = createContext(undefined);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 

  // --- Fungsi Fetching (Read) ---
  
  // Fungsi untuk mengambil semua produk yang tersedia (Publik: Home Page)
  const fetchAvailableProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/products/available');
      setProducts(data);
    } catch (err) {
      console.error('Error fetching available products:', err);
      setError('Gagal memuat produk yang tersedia.');
      setProducts([]); 
    } finally {
      setLoading(false);
    }
  }, []);

  // Fungsi untuk mengambil produk milik admin (Private: Dashboard Seller)
  const fetchMyProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Endpoint ini dilindungi, apiFetch akan menambahkan Authorization header
      const data = await apiFetch('/products/mine'); 
      setProducts(data);
    } catch (err) {
      console.error('Error fetching admin products:', err);
      // Status 401 akan ditangani oleh apiFetch
      setError('Gagal memuat produk Anda. Mungkin sesi telah berakhir.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // BARU: Fungsi untuk mengambil SEMUA produk (Super Admin)
  const fetchAllProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
        const data = await apiFetch('/products/all');
        setProducts(data);
    } catch (err) {
        console.error('Error fetching all products:', err);
        setError('Gagal memuat semua produk. Mungkin sesi telah berakhir.');
        setProducts([]);
    } finally {
        setLoading(false);
    }
  }, []);


  // Muat produk yang tersedia saat aplikasi dimulai
  useEffect(() => {
    fetchAvailableProducts(); 
  }, [fetchAvailableProducts]);
  
  // --- Operasi CRUD (Admin Only) ---
  
  // Menggantikan fungsi addProduct lama (menerima FormData)
  const addProduct = async (productFormData) => {
    try {
      // Kirim FormData (mengandung file) ke API
      const newProduct = await apiFetch('/products', {
        method: 'POST',
        body: productFormData, 
      });

      // Update state FE
      setProducts((prevProducts) => [newProduct, ...prevProducts]);
      toast.success("Berhasil menambahkan barang!"); 
      return true;
    } catch (error) {
      console.error("Error adding product:", error.data?.message || error.message);
      toast.error(error.data?.message || "Gagal menambahkan produk."); 
      return false;
    }
  };

  // Menggantikan fungsi updateProduct lama
  const updateProduct = async (productId, updateData) => {
    try {
      // updateData bisa berupa FormData (jika ada file baru) atau JSON
      const isFormData = updateData instanceof FormData;
      
      const updatedProduct = await apiFetch(`/products/${productId}`, {
        method: 'PUT',
        // Jika bukan FormData (misalnya hanya update stock), kirim sebagai JSON
        body: isFormData ? updateData : JSON.stringify(updateData),
      });

      // Update state FE
      setProducts((prevProducts) => 
        prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
      toast.success("Berhasil mengubah data produk."); 
      return true;
    } catch (error) {
      console.error("Error updating product:", error.data?.message || error.message);
      toast.error(error.data?.message || "Gagal mengubah data produk."); 
      return false;
    }
  };

  // Menggantikan fungsi deleteProduct lama
  const deleteProduct = async (id, isSuperAdmin = false) => {
    // Menghilangkan window.confirm dari sini, konfirmasi ditangani di komponen FE
    
    try {
      await apiFetch(`/products/${id}`, {
        method: 'DELETE',
      });
      
      // Update state FE
      setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id));
      toast.success("Produk berhasil dihapus."); 
      return true;
    } catch (error) {
      console.error("Error deleting product:", error.data?.message || error.message);
      toast.error(error.data?.message || "Gagal menghapus produk."); 
      return false;
    }
  };

  // Gunakan filter pada state products lokal
  const getProductsByAdmin = (adminId) => products.filter((p) => p.adminId === adminId);


  return (
    <ProductContext.Provider 
        value={{ 
            products, 
            loading, 
            error,
            addProduct, 
            deleteProduct, 
            updateProduct, 
            getProductsByAdmin,
            fetchAvailableProducts, 
            fetchMyProducts,   
            fetchAllProducts, // BARU
        }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}