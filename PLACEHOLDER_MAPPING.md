# MAPPING PLACEHOLDER TEMPLATE RPS

Dokumen ini menjelaskan **semua placeholder** yang ada di template RPS Word dan di mana placeholder tersebut dipasang di backend controller.

## 📍 Lokasi File Backend
**File Controller:** `backend/controllers/generated_rps_controller.go`  
**Fungsi Utama:** `Export()`  
**Template Word:** `backend/templates/template_rps.docx`

---

## ✅ PLACEHOLDER YANG SUDAH ADA DI BACKEND

### 1. INFORMASI MATA KULIAH (Baris 123-128)
| Placeholder | Source | Kode Backend |
|------------|--------|--------------|
| `{KODE_MK}` | Database Course | `replaceMap["{KODE_MK}"] = rps.Course.Code` |
| `{NAMA_MK}` | Database Course | `replaceMap["{NAMA_MK}"] = rps.Course.Title` |
| `{SKS}` | Database Course | `replaceMap["{SKS}"] = getIntValue(rps.Course.Credits)` |
| `{SKS_TEORI}` | Database Course | `replaceMap["{SKS_TEORI}"] = getIntValue(rps.Course.Credits)` |
| `{SKS_PRAKTIK}` | Fixed | `replaceMap["{SKS_PRAKTIK}"] = "0"` |
| `{SEMESTER}` | Database Course | `replaceMap["{SEMESTER}"] = getIntValue(rps.Course.Semester)` |
| `{TGL_PENYUSUNAN}` | Auto-generated | `replaceMap["{TGL_PENYUSUNAN}"] = time.Now().Format("02/01/2006")` |

### 2. INFORMASI DOSEN & FAKULTAS (Baris 130-154)
| Placeholder | Source | Kode Backend |
|------------|--------|--------------|
| `{DOSEN}` | Database Dosen | `replaceMap["{DOSEN}"] = namaDosen` (dari join dosen_courses) |
| `{NAMA_DOSEN}` | Database Dosen | `replaceMap["{NAMA_DOSEN}"] = namaDosen` |
| `{FAKULTAS}` | Database Prodi | `replaceMap["{FAKULTAS}"] = fakultasDosen` (dari Dosen.Prodi.Fakultas) |
| `{PERGURUAN_TINGGI}` | Fixed | `replaceMap["{PERGURUAN_TINGGI}"] = "UNIVERSITAS MUHAMMADIYAH MAKASSAR"` |
| `{PROGRAM_STUDI}` | Database | `replaceMap["{PROGRAM_STUDI}"] = namaProdi` |
| `{KETUA_PRODI}` | Database Prodi | `replaceMap["{KETUA_PRODI}"] = ketuaProdi` |

### 3. CAPAIAN PEMBELAJARAN (Baris 165-189)
| Placeholder | Source | Kode Backend |
|------------|--------|--------------|
| `{CPL_LIST}` | AI Generated | `replaceMap["{CPL_LIST}"] = cplList` (dari result["cpmk"]) |
| `{CPMK_LIST}` | AI Generated | `replaceMap["{CPMK_LIST}"] = cplList` (sama dengan CPL_LIST) |
| `{SUB_CPMK_LIST}` | AI Generated | `replaceMap["{SUB_CPMK_LIST}"] = subCpmkList` (dari result["subCPMK"]) |

### 4. DESKRIPSI & REFERENSI (Baris 191-244)
| Placeholder | Source | Kode Backend |
|------------|--------|--------------|
| `{TOPIK_LIST}` | AI Generated | `replaceMap["{TOPIK_LIST}"] = topikList` (dari result["topik"]) |
| `{REFERENSI_LIST}` | AI Generated | `replaceMap["{REFERENSI_LIST}"] = referensiList` (dari result["referensi"]) |
| `{RUMPUN_MK}` | Database | `replaceMap["{RUMPUN_MK}"] = getString(result, "rumpun_mk")` |
| `{DESKRIPSI_MK}` | AI Generated | `replaceMap["{DESKRIPSI_MK}"] = getString(result, "deskripsi")` |
| `{MK_PRASYARAT}` | AI Generated | `replaceMap["{MK_PRASYARAT}"] = getString(result, "mk_prasyarat")` |

### 5. RENCANA PEMBELAJARAN MINGGUAN (Baris 315-505)
**16 Minggu - Setiap minggu punya 11 placeholder:**

| Placeholder Pattern | Contoh | Source | Kode Backend |
|--------------------|--------|--------|--------------|
| `{MINGGU_1}` s/d `{MINGGU_16}` | `{MINGGU_1}` | AI Generated | `replaceMap[fmt.Sprintf("{MINGGU_%d}", weekNum)] = mingguKe` |
| `{SUB_CPMK_1}` s/d `{SUB_CPMK_16}` | `{SUB_CPMK_1}` | AI Generated | `replaceMap[fmt.Sprintf("{SUB_CPMK_%d}", weekNum)] = subCpmkText` |
| `{INDIKATOR_1}` s/d `{INDIKATOR_16}` | `{INDIKATOR_1}` | AI Generated | `replaceMap[fmt.Sprintf("{INDIKATOR_%d}", weekNum)] = indikator` |
| `{TOPIK_1}` s/d `{TOPIK_16}` | `{TOPIK_1}` | AI Generated | `replaceMap[fmt.Sprintf("{TOPIK_%d}", weekNum)] = topikFull` |
| `{METODE_1}` s/d `{METODE_16}` | `{METODE_1}` | AI Generated | `replaceMap[fmt.Sprintf("{METODE_%d}", weekNum)] = aktivitas` |
| `{AKTIVITAS_1}` s/d `{AKTIVITAS_16}` | `{AKTIVITAS_1}` | AI Generated | `replaceMap[fmt.Sprintf("{AKTIVITAS_%d}", weekNum)] = aktivitas` |
| `{WAKTU_1}` s/d `{WAKTU_16}` | `{WAKTU_1}` | AI Generated | `replaceMap[fmt.Sprintf("{WAKTU_%d}", weekNum)] = waktu` |
| `{PENGALAMAN_1}` s/d `{PENGALAMAN_16}` | `{PENGALAMAN_1}` | AI Generated | `replaceMap[fmt.Sprintf("{PENGALAMAN_%d}", weekNum)] = pengalamanBelajar` |
| `{KRITERIA_1}` s/d `{KRITERIA_16}` | `{KRITERIA_1}` | AI Generated | `replaceMap[fmt.Sprintf("{KRITERIA_%d}", weekNum)] = penilaian` |
| `{PENILAIAN_1}` s/d `{PENILAIAN_16}` | `{PENILAIAN_1}` | AI Generated | `replaceMap[fmt.Sprintf("{PENILAIAN_%d}", weekNum)] = penilaian` |
| `{BOBOT_1}` s/d `{BOBOT_16}` | `{BOBOT_1}` | AI Generated | `replaceMap[fmt.Sprintf("{BOBOT_%d}", weekNum)] = bobot` |

### 6. RENCANA TUGAS (Baris 247-303)
**20 Tugas - Setiap tugas punya 9 placeholder:**

| Placeholder Pattern | Contoh | Source | Kode Backend |
|--------------------|--------|--------|--------------|
| `{SUB_CPMK_TUGAS_1}` s/d `{SUB_CPMK_TUGAS_20}` | `{SUB_CPMK_TUGAS_1}` | AI Generated | `replaceMap[fmt.Sprintf("{SUB_CPMK_TUGAS_%d}", i+1)] = getString(tugas, "sub_cpmk")` |
| `{INDIKATOR_TUGAS_1}` s/d `{INDIKATOR_TUGAS_20}` | `{INDIKATOR_TUGAS_1}` | AI Generated | `replaceMap[fmt.Sprintf("{INDIKATOR_TUGAS_%d}", i+1)] = getString(tugas, "indikator")` |
| `{JUDUL_TUGAS_1}` s/d `{JUDUL_TUGAS_20}` | `{JUDUL_TUGAS_1}` | AI Generated | `replaceMap[fmt.Sprintf("{JUDUL_TUGAS_%d}", i+1)] = getString(tugas, "judul_tugas")` |
| `{BATAS_TUGAS_1}` s/d `{BATAS_TUGAS_20}` | `{BATAS_TUGAS_1}` | AI Generated | `replaceMap[fmt.Sprintf("{BATAS_TUGAS_%d}", i+1)] = getString(tugas, "batas_waktu")` |
| `{PETUNJUK_TUGAS_1}` s/d `{PETUNJUK_TUGAS_20}` | `{PETUNJUK_TUGAS_1}` | AI Generated | `replaceMap[fmt.Sprintf("{PETUNJUK_TUGAS_%d}", i+1)] = getString(tugas, "petunjuk_pengerjaan")` |
| `{LUARAN_TUGAS_1}` s/d `{LUARAN_TUGAS_20}` | `{LUARAN_TUGAS_1}` | AI Generated | `replaceMap[fmt.Sprintf("{LUARAN_TUGAS_%d}", i+1)] = getString(tugas, "luaran_tugas")` |
| `{KRITERIA_TUGAS_1}` s/d `{KRITERIA_TUGAS_20}` | `{KRITERIA_TUGAS_1}` | AI Generated | `replaceMap[fmt.Sprintf("{KRITERIA_TUGAS_%d}", i+1)] = getString(tugas, "kriteria")` |
| `{TEKNIK_PENILAIAN_TUGAS_1}` s/d `{TEKNIK_PENILAIAN_TUGAS_20}` | `{TEKNIK_PENILAIAN_TUGAS_1}` | AI Generated | `replaceMap[fmt.Sprintf("{TEKNIK_PENILAIAN_TUGAS_%d}", i+1)] = getString(tugas, "teknik_penilaian")` |
| `{BOBOT_TUGAS_1}` s/d `{BOBOT_TUGAS_20}` | `{BOBOT_TUGAS_1}` | AI Generated | `replaceMap[fmt.Sprintf("{BOBOT_TUGAS_%d}", i+1)] = getString(tugas, "bobot")` |
| `{DAFTAR_RUJUKAN_1}` s/d `{DAFTAR_RUJUKAN_20}` | `{DAFTAR_RUJUKAN_1}` | AI Generated | `replaceMap[fmt.Sprintf("{DAFTAR_RUJUKAN_%d}", i+1)] = getString(tugas, "daftar_rujukan")` |

---

## ❌ PLACEHOLDER YANG BELUM ADA (Perlu Ditambahkan)

Placeholder dari template Anda yang **belum ada** di backend:

### 1. IDENTITAS INSTITUSI
Placeholder ini muncul di bagian header setiap halaman:
- `PERGURUAN TINGGI` - ✅ Sudah ada
- `FAKULTAS` - ✅ Sudah ada  
- `PROGRAM STUDI` - ✅ Sudah ada

### 2. TANDA TANGAN & VALIDASI
Placeholder untuk bagian akhir dokumen:
- **UPM FAKULTAS** - Belum ada
- **NAMA PENYUSUN RPS** - Belum ada (bisa gunakan `{DOSEN}`)
- **KOORDINATOR RMK** - Belum ada
- **KA PRODI** - Sudah ada sebagai `{KETUA_PRODI}`

### 3. CAPAIAN PEMBELAJARAN DETIL
Placeholder untuk tabel korelasi CPL-CPMK-SubCPMK:
- **CPL1 (S)** - Belum ada (perlu field baru untuk CPL Sikap)
- Tabel korelasi Sub-CPMK dengan CPMK - Belum ada

### 4. ANALISIS KETERCAPAIAN CPL
Placeholder untuk tabel analisis:
- **CPL** - Belum ada
- **CPMK** - Sudah ada sebagai list
- **Sub-CPMK** - Sudah ada sebagai list
- **TOPIK MATERI** - Sudah ada per minggu
- **JENIS ASSESSMEN** - Belum ada
- **BOBOT (%)** - Sudah ada per minggu

### 5. SKALA PENILAIAN
Tabel skala penilaian sudah fixed di template, tidak perlu placeholder.

### 6. PENELAAH & PENYUSUN
Placeholder untuk validasi dokumen:
- **Penelaah** - Belum ada
- **Penjamin Mutu Program Studi** - Belum ada
- **Koordinator Mata Kuliah** - Belum ada
- **Penyusun RPS** - Belum ada (gunakan `{DOSEN}`)
- **Ketua Program Studi** - ✅ Sudah ada sebagai `{KETUA_PRODI}`

---

## 🔧 CARA MENAMBAHKAN PLACEHOLDER BARU

### Langkah 1: Tambahkan di Template Word
1. Buka `backend/templates/template_rps.docx`
2. Ketik placeholder dengan format `{NAMA_PLACEHOLDER}`
3. Simpan template

### Langkah 2: Tambahkan di Backend Controller
Edit file `backend/controllers/generated_rps_controller.go`, fungsi `Export()`:

```go
// Contoh: Menambahkan placeholder {UPM_FAKULTAS}
replaceMap["{UPM_FAKULTAS}"] = "Nama UPM Fakultas"

// Contoh: Menambahkan dari database
replaceMap["{KOORDINATOR_RMK}"] = rps.Course.Coordinator // jika ada field

// Contoh: Menambahkan dari AI result
replaceMap["{JENIS_ASSESSMEN}"] = getString(result, "jenis_assessmen")
```

### Langkah 3: Update AI Prompt (Jika Perlu)
Jika placeholder membutuhkan data dari AI, update prompt di:
`backend/controllers/ai_controller.go` - fungsi `GenerateRPS()`

---

## 📊 STRUKTUR DATA AI RESULT

Data yang di-generate AI disimpan di `generated_rps.result` (JSON) dengan struktur:

```json
{
  "deskripsi": "Deskripsi mata kuliah",
  "rumpun_mk": "Rumpun MK",
  "mk_prasyarat": "Mata kuliah prasyarat",
  "cpmk": [
    {
      "cpmk_number": 1,
      "description": "Deskripsi CPMK"
    }
  ],
  "subCPMK": [
    {
      "sub_cpmk_number": 1,
      "description": "Deskripsi Sub-CPMK"
    }
  ],
  "topik": [
    {
      "week": "1",
      "topic": "Judul Topik",
      "description": "Deskripsi topik",
      "sub_cpmk": "Sub-CPMK terkait",
      "indikator": "Indikator pencapaian",
      "aktivitas": "Aktivitas pembelajaran",
      "waktu": "Waktu pembelajaran",
      "penilaian": "Kriteria penilaian",
      "bobot": "Bobot penilaian"
    }
  ],
  "tugas": [
    {
      "sub_cpmk": "Sub-CPMK terkait",
      "indikator": "Indikator tugas",
      "judul_tugas": "Judul tugas",
      "batas_waktu": "Batas waktu",
      "petunjuk_pengerjaan": "Petunjuk",
      "luaran_tugas": "Luaran yang diharapkan",
      "kriteria": "Kriteria penilaian",
      "teknik_penilaian": "Teknik penilaian",
      "bobot": "Bobot tugas",
      "daftar_rujukan": "Referensi"
    }
  ],
  "referensi": [
    {
      "title": "Judul buku",
      "author": "Penulis",
      "year": "Tahun"
    }
  ]
}
```

---

## 💡 TIPS PENGGUNAAN

1. **Placeholder Case-Sensitive**: Gunakan UPPERCASE untuk semua placeholder
2. **Kurung Kurawal Wajib**: Format harus `{NAMA}`, bukan `NAMA` atau `{{NAMA}}`
3. **Spasi Tidak Boleh**: `{NAMA MK}` ❌ → `{NAMA_MK}` ✅
4. **Clear Unused**: Placeholder yang tidak terpakai akan dikosongkan otomatis
5. **Testing**: Setelah menambah placeholder, test dengan export RPS

---

## 📝 CONTOH PENAMBAHAN PLACEHOLDER BARU

Misalnya ingin menambahkan **Koordinator RMK**:

### 1. Update Model (jika perlu field baru di database)
```go
// backend/models/course.go
type Course struct {
    // ... field lain
    KoordinatorRMK string `json:"koordinator_rmk"`
}
```

### 2. Update Controller
```go
// backend/controllers/generated_rps_controller.go
// Di dalam fungsi Export(), setelah basic info (sekitar baris 150)
koordinatorRMK := ""
if rps.Course.KoordinatorRMK != "" {
    koordinatorRMK = rps.Course.KoordinatorRMK
} else {
    koordinatorRMK = namaDosen // default ke dosen pengampu
}
replaceMap["{KOORDINATOR_RMK}"] = koordinatorRMK
```

### 3. Update Template Word
1. Buka `backend/templates/template_rps.docx`
2. Di bagian "Penelaah", ketik: `{KOORDINATOR_RMK}`
3. Simpan

### 4. Test
```bash
# Restart backend
# Generate RPS baru atau regenerate
# Export ke Word
# Cek apakah placeholder terisi
```

---

## 🚀 QUICK REFERENCE

**Total Placeholder yang Sudah Ada:** 300+ placeholder
- Informasi Dasar: 7
- Dosen & Fakultas: 6
- Capaian Pembelajaran: 3
- Deskripsi & Referensi: 5
- Rencana Pembelajaran (16 minggu × 11): 176
- Rencana Tugas (20 tugas × 10): 200

**Placeholder yang Perlu Ditambahkan:** ~10
- UPM Fakultas
- Penyusun RPS
- Koordinator RMK
- Penelaah
- Penjamin Mutu
- CPL Sikap
- Jenis Assessmen
- Dan lainnya sesuai kebutuhan

---

## 📞 Support

Jika ada pertanyaan tentang placeholder:
1. Cek dokumentasi ini
2. Lihat kode di `generated_rps_controller.go`
3. Test dengan export dan lihat log backend
4. Tambahkan placeholder baru sesuai panduan di atas
