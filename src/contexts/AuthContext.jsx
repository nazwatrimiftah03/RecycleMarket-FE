import { createContext, useContext, useState, useEffect } from "react";
import { toast } from 'sonner'; // BARU: Impor toast
import { apiFetch } from '../utils/api';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  // Tambahkan isSuperAdmin ke state admin
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const savedAdmin = localStorage.getItem("currentAdmin");
    if (savedAdmin) {
      try {
        const parsedAdmin = JSON.parse(savedAdmin);
        // Pastikan isSuperAdmin ada, default false
        setAdmin({ ...parsedAdmin, isSuperAdmin: parsedAdmin.isSuperAdmin || false });
      } catch(e) {
        localStorage.removeItem("currentAdmin");
        toast.error("Sesi login kadaluarsa atau rusak. Silakan login kembali.");
      }
    }
  }, []);

  const register = async (name, email, phone, location, password) => {
    try {
      // Panggil API Register
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, phone, location, password }),
      });

      const adminData = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        location: data.location,
        isSuperAdmin: data.isSuperAdmin, // BARU
        token: data.token, 
      };
      
      toast.success("Pendaftaran berhasil! Silakan login."); // Ganti alert
      return true; 
    } catch (error) {
      console.error("Register error:", error.data?.message || error.message);
      toast.error(error.data?.message || "Terjadi kesalahan saat mendaftar."); // Ganti alert
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      // Panggil API Login
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      const adminData = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        location: data.location,
        isSuperAdmin: data.isSuperAdmin, // BARU
        token: data.token, 
      };
      
      setAdmin(adminData);
      localStorage.setItem("currentAdmin", JSON.stringify(adminData));
      toast.success("Berhasil login!"); // Ganti alert
      return true;
      
    } catch (error) {
      console.error("Login error:", error.data?.message || error.message);
      toast.error(error.data?.message || "Email atau password salah."); // Ganti alert
      return false;
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("currentAdmin");
    toast.info("Anda telah logout.");
  };

  // BARU: Hanya untuk Super Admin
  const fetchAllAdmins = async () => {
    if (!admin?.isSuperAdmin) return [];
    try {
      // Endpoint baru untuk Super Admin
      const data = await apiFetch('/auth/admins'); 
      return data;
    } catch (error) {
      console.error("Error fetching all admins:", error.data?.message || error.message);
      toast.error(error.data?.message || "Gagal memuat daftar admin/seller.");
      return [];
    }
  };

  // BARU: Hanya untuk Super Admin
  const deleteAdminAccount = async (id) => {
    if (!admin?.isSuperAdmin) {
      toast.error("Akses Ditolak.");
      return false;
    }
    
    // Konfirmasi penghapusan diserahkan ke komponen SuperAdminDashboard
    try {
      // Panggil API Delete
      await apiFetch(`/auth/admins/${id}`, {
        method: 'DELETE',
      });
      toast.success(`Akun seller dengan ID: ${id} berhasil dihapus.`);
      return true;
    } catch (error) {
      console.error("Error deleting admin:", error.data?.message || error.message);
      toast.error(error.data?.message || "Gagal menghapus akun seller.");
      return false;
    }
  };


  return (
    <AuthContext.Provider 
      value={{ 
        admin, 
        login, 
        register, 
        logout, 
        isAuthenticated: !!admin,
        isSuperAdmin: admin?.isSuperAdmin || false, // tambahkan isSuperAdmin
        fetchAllAdmins, // tambahkan fungsi baru
        deleteAdminAccount, // tambahkan fungsi baru
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}