# Panduan Membuat Template RPS Word

## Instruksi Lengkap

Buat dokumen Word baru dengan struktur berikut. Copy text di bawah ke Word, lalu format sesuai instruksi.

---

## HALAMAN 1: HEADER & DESKRIPSI

### Header (Tabel 2 kolom, border hitam)

| [Logo] | **PERGURUAN TINGGI**<br>**FAKULTAS**<br>**PROGRAM STUDI** |
|--------|-----------------------------------------------------------|

**Ganti dengan:**
- Logo: Insert gambar logo Unismuh
- PERGURUAN TINGGI → `{{PERGURUAN_TINGGI}}`
- FAKULTAS → `{{FAKULTAS}}`
- PROGRAM STUDI → `{{PRODI}}`

**Format:**
- Kolom 1 (Logo): Lebar 15%, center align
- Kolom 2: Background biru (#00ADEF), bold, center align, font 11pt

---

### Tabel Identitas Mata Kuliah

| NAMA MATA KULIAH | KODE MK | SEMESTER (SEM) | BOBOT (SKS) | SEMESTER | TGL PENYUSUNAN |
|------------------|---------|----------------|-------------|----------|----------------|
| {{NAMA_MK}}      | {{KODE_MK}} | {{SEMESTER}} | {{SKS}}   | {{SEMESTER}} | {{TGL_PENYUSUNAN}} |

**Format:**
- Header background biru (#00ADEF), bold
- Border hitam semua cell
- Font 10pt

---

### Informasi Dosen (Tabel 2 kolom)

| UPM FAKULTAS | {{UPM_FAKULTAS}} |
|--------------|------------------|
| NAMA PENYUSUN RPS | {{NAMA_PENYUSUN}} |
| KOORDINATOR RMK | {{KOORDINATOR_RMK}} |
| KAPRODI | {{KAPRODI}} |

---

### DESKRIPSI MATA KULIAH

**DESKRIPSI SINGKAT:**
{{DESKRIPSI_MK}}

**BAHAN KAJIAN:**
{{BAHAN_KAJIAN}}

**REFERENSI:**
{{REFERENSI}}

---

## HALAMAN 2: CPL & CPMK

### CAPAIAN PEMBELAJARAN LULUSAN (CPL)

Tabel CPL:

| NO | KODE CPL | CAPAIAN PEMBELAJARAN LULUSAN (CPL) |
|----|----------|-----------------------------------|
| 1  | {{CPL_1_KODE}} | {{CPL_1_DESKRIPSI}} |
| 2  | {{CPL_2_KODE}} | {{CPL_2_DESKRIPSI}} |
| ... | ... | ... |

**Catatan:** Untuk multiple CPL, gunakan loop di backend

---

### CAPAIAN PEMBELAJARAN MATA KULIAH (CPMK)

| NO | KODE CPMK | CAPAIAN PEMBELAJARAN | CPL |
|----|-----------|----------------------|-----|
| 1  | {{CPMK_1_KODE}} | {{CPMK_1_DESKRIPSI}} | {{CPMK_1_CPL}} |
| 2  | {{CPMK_2_KODE}} | {{CPMK_2_DESKRIPSI}} | {{CPMK_2_CPL}} |
| ... | ... | ... | ... |

---

### SUB-CPMK

| KODE SUB-CPMK | DESKRIPSI SUB-CPMK | CPMK |
|---------------|-------------------|------|
| {{SUB_CPMK_1_KODE}} | {{SUB_CPMK_1_DESKRIPSI}} | {{SUB_CPMK_1_CPMK}} |
| {{SUB_CPMK_2_KODE}} | {{SUB_CPMK_2_DESKRIPSI}} | {{SUB_CPMK_2_CPMK}} |
| ... | ... | ... |

---

### KORELASI CPL DENGAN CPMK

| CPMK | CPL-1 | CPL-2 | CPL-3 | CPL-4 | CPL-5 | CPL-6 | ... |
|------|-------|-------|-------|-------|-------|-------|-----|
| CPMK-1 | {{KORELASI_1_1}} | {{KORELASI_1_2}} | ... | ... | ... | ... | ... |
| CPMK-2 | {{KORELASI_2_1}} | {{KORELASI_2_2}} | ... | ... | ... | ... | ... |
| ... | ... | ... | ... | ... | ... | ... | ... |

**Format:**
- Header rotasi vertikal untuk CPL (Text Direction → Rotate 90°)
- Cell dengan korelasi: ✓ atau kosong
- Font 8pt untuk menghemat space

---

### KORELASI SUB-CPMK DENGAN CPMK

| CPMK | S-1 | S-2 | S-3 | S-4 | S-5 | S-6 | S-7 | S-8 | S-9 | S-10 | S-11 | S-12 | S-13 | S-14 |
|------|-----|-----|-----|-----|-----|-----|-----|-----|-----|------|------|------|------|------|
| CPMK-1 | ✓ | ✓ |  |  |  |  |  |  |  |  |  |  |  |  |
| CPMK-2 |  |  | ✓ | ✓ |  |  |  |  |  |  |  |  |  |  |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |

**Format:**
- Font 8pt
- Border tipis
- Center align

---

## HALAMAN 3-4: RENCANA PEMBELAJARAN

### Minggu 1-7 (Page 3)

| MINGGU | BENTUK & METODE PEMBELAJARAN | SUB-CPMK | INDIKATOR | KRITERIA & BENTUK PENILAIAN | BOBOT |
|--------|------------------------------|----------|-----------|----------------------------|-------|
| 1 | {{MINGGU_1_METODE}} | {{MINGGU_1_SUBCPMK}} | {{MINGGU_1_INDIKATOR}} | {{MINGGU_1_PENILAIAN}} | {{MINGGU_1_BOBOT}} |
| 2 | ... | ... | ... | ... | ... |
| ... | ... | ... | ... | ... | ... |
| 7 | {{MINGGU_7_METODE}} | {{MINGGU_7_SUBCPMK}} | {{MINGGU_7_INDIKATOR}} | {{MINGGU_7_PENILAIAN}} | {{MINGGU_7_BOBOT}} |

### Minggu 8-16 (Page 4)

| MINGGU | BENTUK & METODE PEMBELAJARAN | SUB-CPMK | INDIKATOR | KRITERIA & BENTUK PENILAIAN | BOBOT |
|--------|------------------------------|----------|-----------|----------------------------|-------|
| 8 | {{MINGGU_8_METODE}} | {{MINGGU_8_SUBCPMK}} | {{MINGGU_8_INDIKATOR}} | {{MINGGU_8_PENILAIAN}} | {{MINGGU_8_BOBOT}} |
| ... | ... | ... | ... | ... | ... |
| 16 | {{MINGGU_16_METODE}} | {{MINGGU_16_SUBCPMK}} | {{MINGGU_16_INDIKATOR}} | {{MINGGU_16_PENILAIAN}} | {{MINGGU_16_BOBOT}} |

**Format:**
- Font 9pt
- Column width: 
  - Minggu: 8%
  - Metode: 25%
  - Sub-CPMK: 12%
  - Indikator: 30%
  - Penilaian: 20%
  - Bobot: 5%

---

## HALAMAN 5: RENCANA TUGAS

| NO | BENTUK TUGAS | WAKTU | SUB-CPMK | BOBOT | KRITERIA PENILAIAN |
|----|--------------|-------|----------|-------|--------------------|
| 1 | {{TUGAS_1_BENTUK}} | {{TUGAS_1_WAKTU}} | {{TUGAS_1_SUBCPMK}} | {{TUGAS_1_BOBOT}} | {{TUGAS_1_KRITERIA}} |
| 2 | ... | ... | ... | ... | ... |
| ... | ... | ... | ... | ... | ... |

---

## HALAMAN 6: ANALISIS KETERCAPAIAN

| MINGGU | ASPEK YANG DINILAI | WAKTU | BOBOT (%) | METODE PENILAIAN |
|--------|-------------------|-------|-----------|------------------|
| 1-7 | Tugas, Kuis, Partisipasi | Mingguan | {{BOBOT_1_7}} | {{METODE_1_7}} |
| 8 | UTS | Minggu ke-8 | {{BOBOT_UTS}} | {{METODE_UTS}} |
| 9-15 | Tugas, Kuis, Partisipasi | Mingguan | {{BOBOT_9_15}} | {{METODE_9_15}} |
| 16 | UAS | Minggu ke-16 | {{BOBOT_UAS}} | {{METODE_UAS}} |

---

## Langkah-Langkah di Word:

1. **Buka Word baru**
2. **Set margins:** 
   - Top/Bottom: 15mm
   - Left/Right: 15mm
3. **Font default:** Times New Roman, 10pt
4. **Copy struktur di atas ke Word**
5. **Format tabel:**
   - Insert → Table
   - Borders: All borders, black, 0.5pt
   - Background biru untuk header: RGB(0, 173, 239)
6. **Insert placeholders:**
   - Ganti semua teks dengan placeholder yang sesuai ({{...}})
   - Pastikan placeholder ditulis PERSIS seperti di panduan
7. **Save as:** `template_rps.docx` di folder `backend/templates/`

## Daftar Placeholder Lengkap:

### Basic Info:
- `{{PERGURUAN_TINGGI}}`
- `{{FAKULTAS}}`
- `{{PRODI}}`
- `{{NAMA_MK}}`
- `{{KODE_MK}}`
- `{{SEMESTER}}`
- `{{SKS}}`
- `{{TGL_PENYUSUNAN}}`
- `{{UPM_FAKULTAS}}`
- `{{NAMA_PENYUSUN}}`
- `{{KOORDINATOR_RMK}}`
- `{{KAPRODI}}`
- `{{NAMA_DOSEN}}`

### Content:
- `{{DESKRIPSI_MK}}`
- `{{BAHAN_KAJIAN}}`
- `{{REFERENSI}}`

### Lists (akan di-loop di backend):
- `{{CPL_LIST}}` - Daftar CPL (format: "CPL-1, CPL-2, CPL-3")
- `{{CPMK_LIST}}` - Daftar CPMK dengan deskripsi
- `{{SUB_CPMK_LIST}}` - Daftar Sub-CPMK dengan deskripsi

**Note:** Untuk tabel dinamis (CPL, CPMK, Rencana Mingguan, Tugas), saat ini menggunakan placeholder sederhana. Nanti bisa di-enhance dengan manipulasi XML untuk insert rows dinamis.

---

## Setelah Template Dibuat:

1. Test dengan export Word di aplikasi
2. Buka file hasil export
3. Cek apakah semua placeholder ter-replace dengan data yang benar
4. Jika ada yang belum ter-replace, cek ejaan placeholder di template
5. Adjust formatting jika perlu (font size, column width, dll)
