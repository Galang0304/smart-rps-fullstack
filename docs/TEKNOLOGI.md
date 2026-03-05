# Teknologi yang Digunakan - Smart RPS

## 🎨 Frontend

| Teknologi | Versi | Keterangan |
|-----------|-------|------------|
| **React** | 19.2.0 | Library JavaScript untuk membangun user interface |
| **React DOM** | 19.2.0 | Package untuk rendering React ke DOM |
| **React Router DOM** | 7.10.1 | Library untuk routing/navigasi halaman |
| **Vite** | 7.2.4 | Build tool & development server yang cepat |
| **TailwindCSS** | 3.4.17 | Utility-first CSS framework untuk styling |
| **Axios** | 1.13.2 | HTTP client untuk komunikasi dengan API |
| **Lucide React** | 0.555.0 | Library ikon untuk React |
| **XLSX** | 0.18.5 | Library untuk membaca/menulis file Excel |
| **PostCSS** | 8.4.35 | Tool untuk transformasi CSS |
| **Autoprefixer** | 10.4.19 | Plugin PostCSS untuk vendor prefix CSS |
| **ESLint** | 9.39.1 | Linter untuk menjaga kualitas kode JavaScript |

---

## ⚙️ Backend

| Teknologi | Versi | Keterangan |
|-----------|-------|------------|
| **Go (Golang)** | 1.24.0 | Bahasa pemrograman untuk backend |
| **Gin** | 1.9.1 | Web framework untuk Go (REST API) |
| **GORM** | 1.30.0 | ORM (Object-Relational Mapping) untuk Go |
| **PostgreSQL Driver** | 1.5.2 | Driver database PostgreSQL untuk GORM |
| **JWT (JSON Web Token)** | - | Untuk autentikasi dan otorisasi pengguna |
| **GoDotEnv** | 1.4.0 | Library untuk membaca file environment (.env) |
| **Google UUID** | 1.6.0 | Library untuk generate UUID unik |
| **Excelize** | 2.10.0 | Library untuk membaca/menulis file Excel |
| **go-docx** | 0.5.0 | Library untuk generate dokumen Word (.docx) |
| **Bcrypt (crypto)** | 0.43.0 | Library untuk enkripsi password |

---

## 🗄️ Database

| Teknologi | Versi | Keterangan |
|-----------|-------|------------|
| **PostgreSQL** | 16 | Relational Database Management System (RDBMS) |

---

## 🌐 Web Server

| Teknologi | Keterangan |
|-----------|------------|
| **Nginx** | Reverse proxy & static file server untuk frontend |

---

## 🔐 Keamanan & Autentikasi

| Teknologi | Keterangan |
|-----------|------------|
| **JWT (JSON Web Token)** | Token-based authentication |
| **Bcrypt** | Password hashing |
| **CORS** | Cross-Origin Resource Sharing |
| **Cloudflare SSL** | HTTPS/SSL certificate |

---

## 📧 Layanan Email

| Teknologi | Keterangan |
|-----------|------------|
| **SMTP Gmail** | Untuk pengiriman email (reset password, notifikasi) |

---

## 🤖 AI/Machine Learning

| Teknologi | Keterangan |
|-----------|------------|
| **OpenAI API (GPT)** | Untuk generate konten RPS secara otomatis |

---

## 📁 Struktur Arsitektur

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT                             │
│              (Browser / React App)                      │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTPS
                      ▼
┌─────────────────────────────────────────────────────────┐
│                   CLOUDFLARE                            │
│              (DNS + SSL + CDN)                          │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                     NGINX                               │
│         (Reverse Proxy + Static Server)                 │
│                                                         │
│   /              → React Build (Frontend)               │
│   /api/v1/*      → Go Backend (Port 8080)               │
└─────────────────────┬───────────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│    FRONTEND     │     │     BACKEND     │
│                 │     │                 │
│  • React 19     │     │  • Go 1.24      │
│  • Vite 7       │     │  • Gin 1.9      │
│  • TailwindCSS  │     │  • GORM 1.30    │
│  • Axios        │     │  • JWT Auth     │
└─────────────────┘     └────────┬────────┘
                                 │
                                 ▼
                      ┌─────────────────┐
                      │   PostgreSQL    │
                      │   Database 16   │
                      └─────────────────┘
```

---

## 📋 Ringkasan Teknologi

| Layer | Teknologi |
|-------|-----------|
| **Frontend** | React, Vite, TailwindCSS, Axios, React Router |
| **Backend** | Go, Gin Framework, GORM |
| **Database** | PostgreSQL 16 |
| **Authentication** | JWT, Bcrypt |
| **Web Server** | Nginx |
| **SSL/CDN** | Cloudflare |
| **AI Integration** | OpenAI API |
| **File Processing** | Excelize (Excel), go-docx (Word) |
| **Email** | SMTP Gmail |
