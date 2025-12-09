# Smart RPS - Sistem Dokumentasi Rencana Pembelajaran Semester

Aplikasi fullstack untuk manajemen dan generasi otomatis dokumen Rencana Pembelajaran Semester (RPS) menggunakan AI.

## 🚀 Fitur Utama

- **Autentikasi & Otorisasi**: Sistem login dengan role-based access (Admin & Dosen)
- **Manajemen Data Master**: 
  - Program Studi
  - Program (S1, S2, S3)
  - Dosen
  - Mata Kuliah
- **Generasi RPS Otomatis**: Generate dokumen RPS menggunakan AI (OpenAI)
- **Template Management**: Kelola template RPS dalam format DOCX/XML
- **Dashboard**: Dashboard terpisah untuk Admin dan Dosen
- **Export Dokumen**: Export RPS ke format DOCX

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI Framework
- **Vite** - Build tool & dev server
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP client

### Backend
- **Go (Golang)** - Backend language
- **Gin Framework** - Web framework
- **GORM** - ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **OpenAI API** - AI untuk generasi RPS

## 📋 Prerequisites

- Node.js (v16+)
- Go (v1.20+)
- PostgreSQL (v13+)
- OpenAI API Key

## 🔧 Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/Galang0304/smart-rps-fullstack.git
cd smart-rps-fullstack
```

### 2. Setup Backend

```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit .env file dengan konfigurasi Anda
# - Database credentials
# - JWT secret
# - OpenAI API key
# - SMTP settings (untuk email)

# Install Go dependencies
go mod download

# Run backend server
go run main.go
```

Backend akan berjalan di `http://localhost:8080`

### 3. Setup Frontend

```bash
# Kembali ke root directory
cd ..

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

## 📝 Environment Variables

### Backend (.env)

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=smart_rps
DB_SSLMODE=disable

# Application Configuration
APP_PORT=8080
APP_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=24h

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## 🗄️ Database Setup

```sql
-- Create database
CREATE DATABASE smart_rps;

-- Database akan di-migrate otomatis saat menjalankan aplikasi
```

## 🎯 Default Users

Setelah running pertama kali, Anda perlu membuat user admin melalui database atau endpoint registrasi.

## 📁 Project Structure

```
smart-rps-fullstack/
├── backend/              # Go backend
│   ├── config/          # Database & env config
│   ├── controllers/     # Request handlers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── templates/       # RPS templates
├── src/                 # React frontend
│   ├── components/      # Reusable components
│   ├── pages/          # Page components
│   │   ├── Admin/      # Admin pages
│   │   └── Dosen/      # Dosen pages
│   ├── services/       # API services
│   └── hooks/          # Custom hooks
└── docs/               # Documentation files
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register

### Admin Routes
- `GET /api/admin/prodi` - Get all prodi
- `POST /api/admin/prodi` - Create prodi
- `GET /api/admin/program` - Get all program
- `POST /api/admin/program` - Create program
- `GET /api/admin/dosen` - Get all dosen
- `POST /api/admin/dosen` - Create dosen

### Dosen Routes
- `GET /api/dosen/courses` - Get dosen's courses
- `POST /api/dosen/courses` - Create course
- `GET /api/dosen/rps` - Get dosen's RPS
- `POST /api/dosen/rps/generate` - Generate new RPS

## 🚦 Usage

1. **Login** sebagai Admin atau Dosen
2. **Admin**: Kelola data master (Prodi, Program, Dosen, Mata Kuliah)
3. **Dosen**: 
   - Kelola mata kuliah yang diampu
   - Generate RPS otomatis menggunakan AI
   - Download RPS dalam format DOCX

## 📸 Screenshots

_(Coming soon)_

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- [@Galang0304](https://github.com/Galang0304)

## 📧 Contact

Untuk pertanyaan atau dukungan, silakan buka issue di GitHub repository.

TERIMA KASIH

⭐ Jika proyek ini bermanfaat, jangan lupa berikan star di GitHub!
