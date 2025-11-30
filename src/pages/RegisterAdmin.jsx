// src/pages/RegisterAdmin.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { User, Mail, Phone, MapPin, Lock } from "lucide-react";
import LogoImage from "../assets/logo.png";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { useAuth } from "../contexts/AuthContext";

export function RegisterAdmin() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validasi
    if (formData.password !== formData.confirmPassword) {
      setError("Password tidak cocok!");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter!");
      return;
    }

    setLoading(true);

    const success = await register(
      formData.name,
      formData.email,
      formData.phone,
      formData.location,
      formData.password
    );

    if (success) {
      // Tampilkan notifikasi berhasil mendaftar
      alert("Berhasil mendaftar! Silakan login."); 
      navigate("/login-admin");
    } else {
      setError("Email sudah terdaftar!");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md bg-white border-2 border-gray-300">
        <CardContent className="p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center border-2 border-green-700 mb-3">
              <img 
                src={LogoImage}
                alt="ReCycle Market Logo" 
                className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center border-2 border-green-700 size-12 text-white object-cover" />
            </div>
            <h1 className="text-green-600 text-center">Register Admin</h1>
            <p className="text-gray-600 text-center mt-2">Daftar sebagai admin ReCycle Market</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">{error}</div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input id="name" type="text" placeholder="Nama" className="pl-10" value={formData.name} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input id="email" type="email" placeholder="Email" className="pl-10" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Nomor HP</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input id="phone" type="tel" placeholder="Nomor HP" className="pl-10" value={formData.phone} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Lokasi</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input id="location" type="text" placeholder="Lokasi" className="pl-10" value={formData.location} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input id="password" type="password" placeholder="Password" className="pl-10" value={formData.password} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input id="confirmPassword" type="password" placeholder="Konfirmasi Password" className="pl-10" value={formData.confirmPassword} onChange={handleChange} required />
              </div>
            </div>

            <Button type="submit" className="w-full bg-green-500 hover:bg-green-600" disabled={loading}>
              {loading ? "Loading..." : "Daftar"}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">Sudah punya akun? <Link to="/login-admin" className="text-green-600 hover:underline">Login di sini</Link></p>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link to="/" className="text-green-600 hover:underline text-sm">Kembali ke Home</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}