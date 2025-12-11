import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Mail, Lock } from "lucide-react";
import LogoImage from "../assets/logo.png";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { useAuth } from "../contexts/AuthContext";

export function LoginAdmin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = await login(formData.email, formData.password);
    if (success) {
      // navigasi ditangani di sini, success alert sudah di AuthContext
      const adminData = JSON.parse(localStorage.getItem("currentAdmin"));
      if (adminData && adminData.isSuperAdmin) {
        navigate("/super-admin-dashboard"); // Navigasi ke Super Admin Dashboard jika Super Admin
      } else {
        navigate("/dashboard-admin"); // Navigasi ke Seller Dashboard jika Admin biasa
      }
    } else {
      // Error ditangani di AuthContext
    }

    setLoading(false);
  };

  return (
   <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md bg-white border-2 border-gray-300">
        <CardContent className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center border-2 border-green-700 mb-3">
              <img 
                src={LogoImage}
                alt="ReCycle Market Logo" 
                className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center border-2 border-green-700 size-12 text-white object-cover" />
            </div>
            <h1 className="text-green-600 text-center">Login Seller/Admin</h1>
            <p className="text-gray-600 text-center mt-2">Masuk sebagai seller atau admin ReCycle Market</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input id="email" type="email" placeholder="Email" className="pl-10" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input id="password" type="password" placeholder="Password" className="pl-10" value={formData.password} onChange={handleChange} required />
              </div>
            </div>

            <Button type="submit" className="w-full bg-green-500 hover:bg-green-600" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">Belum punya akun? <Link to="/register-admin" className="text-green-600 hover:underline">Daftar di sini</Link></p>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-green-600 hover:underline text-sm">Kembali ke Home</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}