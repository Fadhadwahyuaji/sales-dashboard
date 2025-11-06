# Sales Dashboard

Aplikasi web dashboard untuk manajemen penjualan yang dibangun menggunakan React dan Vite. Aplikasi ini membantu mengelola data customer, transaksi, dan melihat ringkasan penjualan.

## 📋 Fitur Utama

### Autentikasi

- Login dengan nomor telepon dan password
- Registrasi akun baru
- Update password dengan validasi keamanan
- Session management menggunakan Zustand dengan persistent storage

### Dashboard Summary

- Ringkasan total penjualan
- Statistik customer
- Grafik penjualan bulanan
- Filter data berdasarkan tanggal

### Manajemen Customer

- Daftar customer dengan pagination
- Tambah customer baru
- Edit data customer
- Lihat detail customer
- Pencarian dan filter customer

### Manajemen Transaksi

- Daftar transaksi dengan pagination
- Detail transaksi
- Filter transaksi berdasarkan tanggal
- Informasi status pembayaran

### Profil User

- Lihat informasi profil
- Update password
- Data user tersimpan secara real-time

## 🛠️ Tech Stack

- **React 19** - Library UI
- **Vite** - Build tool dan development server
- **React Router DOM** - Routing
- **Zustand** - State management
- **Axios** - HTTP client untuk komunikasi dengan API
- **React Hook Form** - Form handling
- **Zod** - Validasi schema
- **Tailwind CSS** - Styling
- **Lucide React** - Icon library
- **Recharts** - Chart visualization
- **React Hot Toast** - Notifikasi
- **date-fns** - Date manipulation

## 📦 Instalasi

1. Clone repository ini

```bash
git clone <repository-url>
cd sales-dashboard
```

2. Install dependencies

```bash
npm install
```

3. Jalankan development server

```bash
npm run dev
```

4. Buka browser dan akses `http://localhost:5173`

## 🚀 Available Scripts

```bash
# Menjalankan development server
npm run dev

# Build untuk production
npm run build

# Preview production build
npm run preview

# Linting kode
npm run lint
```

## 📁 Struktur Folder

```
src/
├── api/                  # API services dan konfigurasi axios
│   ├── auth.js          # API autentikasi
│   ├── customer.js      # API customer
│   ├── transaction.js   # API transaksi
│   ├── summary.js       # API summary/dashboard
│   └── axiosInstance.js # Konfigurasi axios
├── components/          # Reusable components
│   ├── common/         # Komponen umum (Button, Input, dll)
│   └── layout/         # Layout components (Navbar, Sidebar)
├── pages/              # Halaman aplikasi
│   ├── auth/          # Login & Register
│   ├── customer/      # Customer pages
│   ├── transaction/   # Transaction pages
│   ├── profile/       # User profile
│   └── summary/       # Dashboard summary
├── routes/            # Route configuration
├── store/             # Zustand store
├── utils/             # Utility functions & schemas
└── main.jsx           # Entry point
```

## 🔑 Fitur Keamanan

- Token-based authentication
- Protected routes untuk halaman yang memerlukan autentikasi
- Auto redirect berdasarkan status login
- Password validation dengan regex
- Logout otomatis jika token expired

## 🎨 UI/UX Features

- **Responsive Design** - Berfungsi optimal di desktop, tablet, dan mobile
- **Modern UI** - Menggunakan Tailwind CSS dengan gradient dan shadow
- **Smooth Transitions** - Animasi yang smooth untuk pengalaman user yang lebih baik
- **Loading States** - Indikator loading pada setiap aksi
- **Error Handling** - Pesan error yang informatif
- **Toast Notifications** - Notifikasi real-time untuk feedback user

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: ≥ 1024px

## ⚙️ Konfigurasi

### API Base URL

Update base URL di `src/api/axiosInstance.js`:

```javascript
const api = axios.create({
  baseURL: "YOUR_API_URL",
  headers: {
    "Content-Type": "application/json",
  },
});
```

### Environment Variables

Buat file `.env` di root project (opsional):

```env
VITE_API_URL=your_api_url
```

## 🔄 State Management

Menggunakan Zustand dengan persistence untuk:

- User authentication state
- Token management
- User profile data

Store akan otomatis tersinkronisasi dengan localStorage untuk maintain session saat page refresh.

## 📝 Form Validation

Semua form menggunakan:

- **React Hook Form** untuk form handling
- **Zod** untuk schema validation
- Real-time validation feedback
- Custom error messages dalam Bahasa Indonesia

## 🚧 Development Notes

- Pastikan backend API sudah running sebelum menjalankan aplikasi
- API endpoint harus sesuai dengan yang didefinisikan di folder `src/api/`
- Token disimpan di localStorage, untuk production sebaiknya gunakan httpOnly cookie

## 📄 License

This project is for internal use only.

## 👥 Author

Fadhad Wahyu Aji - Sales Dashboard

---

**Catatan:** Aplikasi ini masih dalam tahap development dan beberapa fitur mungkin belum sepenuhnya optimal.
