export const BASE_URL = 'https://recycle-market-be.vercel.app/api'; 

export const getToken = () => {
  const adminData = localStorage.getItem("currentAdmin");
  if (adminData) {
    try {
      const admin = JSON.parse(adminData);
      return admin.token;
    } catch (e) {
      console.error("Error parsing admin data:", e);
      return null;
    }
  }
  return null;
};

/**
 * Fungsi fetch wrapper untuk request ke API backend.
 * @param {string} endpoint - Misalnya: '/auth/login' atau '/products/mine'
 * @param {object} options - Konfigurasi fetch (method, headers, body, dll.)
 * @returns {Promise<object>} Response data JSON
 */
export async function apiFetch(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  const token = getToken();
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Jika body adalah FormData (untuk upload file), hapus Content-Type agar browser yang mengurus
  if (options.body instanceof FormData) {
    delete defaultHeaders['Content-Type'];
    if (options.headers && options.headers['Content-Type']) {
        delete options.headers['Content-Type'];
    }
  }
  
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Tangani 204 No Content (biasanya untuk DELETE berhasil tanpa body)
    if (response.status === 204) {
        return { success: true, message: 'No Content' };
    }

    const data = await response.json();
    
    if (!response.ok) {
        // Buat objek Error dengan status dan pesan dari backend
        const error = new Error(data.message || 'Network response was not ok');
        error.data = data;
        error.status = response.status;
        throw error;
    }

    return data;
  } catch (error) {
    console.error(`API Fetch Error [${endpoint}]:`, error);
    throw error;
  }

}
