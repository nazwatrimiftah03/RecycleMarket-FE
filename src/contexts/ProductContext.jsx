import { createContext, useContext, useState, useEffect, useCallback } from "react"; // <-- BARU: Tambah useCallback
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

  // Fungsi untuk mengambil produk milik admin (Private: Dashboard Admin)
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
      return true;
    } catch (error) {
      console.error("Error adding product:", error.data?.message || error.message);
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
      return true;
    } catch (error) {
      console.error("Error updating product:", error.data?.message || error.message);
      return false;
    }
  };

  // Menggantikan fungsi deleteProduct lama
  const deleteProduct = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
        return false;
    }
    
    try {
      await apiFetch(`/products/${id}`, {
        method: 'DELETE',
      });
      
      // Update state FE
      setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id));
      return true;
    } catch (error) {
      console.error("Error deleting product:", error.data?.message || error.message);
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