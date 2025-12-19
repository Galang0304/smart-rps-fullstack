# 📄 DAFTAR LENGKAP PLACEHOLDER TEMPLATE WORD RPS

Template ini untuk export RPS ke format Word (.docx) dengan sistem replacement placeholder.

---

## 1️⃣ INFORMASI MATA KULIAH

```
{{KODE_MK}}           - Kode mata kuliah (contoh: AWI609I0042105)
{{NAMA_MK}}           - Nama mata kuliah lengkap
{{SKS}}               - Jumlah SKS (angka)
{{SEMESTER}}          - Semester (angka)
{{PROGRAM_STUDI}}     - Nama program studi
{{FAKULTAS}}          - Nama fakultas
{{JENJANG}}           - Jenjang pendidikan (S1/S2/S3)
{{TAHUN_AKADEMIK}}    - Tahun akademik (contoh: 2024/2025)
{{DOSEN_PENGAMPU}}    - Nama dosen pengampu
{{TANGGAL_BUAT}}      - Tanggal pembuatan RPS
```

---

## 2️⃣ DESKRIPSI MATA KULIAH

```
{{DESKRIPSI_MK}}      - Paragraf deskripsi lengkap mata kuliah
```

---

## 3️⃣ CAPAIAN PEMBELAJARAN MATA KULIAH (CPMK)
*Maksimal 5 CPMK, tapi bisa lebih atau kurang*

```
{{CPMK_1_CODE}}       - Kode CPMK 1 (contoh: CPMK-1)
{{CPMK_1_DESC}}       - Deskripsi lengkap CPMK 1
{{CPMK_1_CPL}}        - CPL yang terkait dengan CPMK 1

{{CPMK_2_CODE}}
{{CPMK_2_DESC}}
{{CPMK_2_CPL}}

{{CPMK_3_CODE}}
{{CPMK_3_DESC}}
{{CPMK_3_CPL}}

{{CPMK_4_CODE}}
{{CPMK_4_DESC}}
{{CPMK_4_CPL}}

{{CPMK_5_CODE}}
{{CPMK_5_DESC}}
{{CPMK_5_CPL}}
```

---

## 4️⃣ SUB-CPMK (Fixed 14 Items)
*1 Sub-CPMK untuk setiap minggu materi (14 minggu, exclude UTS & UAS)*

```
{{SUB_CPMK_1_CODE}}        - Kode Sub-CPMK 1 (contoh: Sub-CPMK-1)
{{SUB_CPMK_1_DESC}}        - Deskripsi lengkap Sub-CPMK 1
{{SUB_CPMK_1_RELATED}}     - CPMK terkait (contoh: CPMK-1)

{{SUB_CPMK_2_CODE}}
{{SUB_CPMK_2_DESC}}
{{SUB_CPMK_2_RELATED}}

{{SUB_CPMK_3_CODE}}
{{SUB_CPMK_3_DESC}}
{{SUB_CPMK_3_RELATED}}

{{SUB_CPMK_4_CODE}}
{{SUB_CPMK_4_DESC}}
{{SUB_CPMK_4_RELATED}}

{{SUB_CPMK_5_CODE}}
{{SUB_CPMK_5_DESC}}
{{SUB_CPMK_5_RELATED}}

{{SUB_CPMK_6_CODE}}
{{SUB_CPMK_6_DESC}}
{{SUB_CPMK_6_RELATED}}

{{SUB_CPMK_7_CODE}}
{{SUB_CPMK_7_DESC}}
{{SUB_CPMK_7_RELATED}}

{{SUB_CPMK_8_CODE}}
{{SUB_CPMK_8_DESC}}
{{SUB_CPMK_8_RELATED}}

{{SUB_CPMK_9_CODE}}
{{SUB_CPMK_9_DESC}}
{{SUB_CPMK_9_RELATED}}

{{SUB_CPMK_10_CODE}}
{{SUB_CPMK_10_DESC}}
{{SUB_CPMK_10_RELATED}}

{{SUB_CPMK_11_CODE}}
{{SUB_CPMK_11_DESC}}
{{SUB_CPMK_11_RELATED}}

{{SUB_CPMK_12_CODE}}
{{SUB_CPMK_12_DESC}}
{{SUB_CPMK_12_RELATED}}

{{SUB_CPMK_13_CODE}}
{{SUB_CPMK_13_DESC}}
{{SUB_CPMK_13_RELATED}}

{{SUB_CPMK_14_CODE}}
{{SUB_CPMK_14_DESC}}
{{SUB_CPMK_14_RELATED}}
```

---

## 5️⃣ BAHAN KAJIAN / MATERI
*Minimal 3-5 topik materi utama*

```
{{BAHAN_KAJIAN_1}}    - Bahan kajian/topik 1
{{BAHAN_KAJIAN_2}}    - Bahan kajian/topik 2
{{BAHAN_KAJIAN_3}}    - Bahan kajian/topik 3
{{BAHAN_KAJIAN_4}}    - Bahan kajian/topik 4
{{BAHAN_KAJIAN_5}}    - Bahan kajian/topik 5
```

---

## 6️⃣ RENCANA PEMBELAJARAN MINGGUAN (16 Minggu)

### **Minggu 1-7 (Materi Awal)**

```
{{MINGGU_1_SUBCPMK}}       - Sub-CPMK minggu 1
{{MINGGU_1_MATERI}}        - Materi pembelajaran minggu 1
{{MINGGU_1_METODE}}        - Metode pembelajaran (contoh: Ceramah, Diskusi, Praktikum)
{{MINGGU_1_PENILAIAN}}     - Bentuk penilaian (contoh: Tugas, Kuis, Presentasi)

{{MINGGU_2_SUBCPMK}}
{{MINGGU_2_MATERI}}
{{MINGGU_2_METODE}}
{{MINGGU_2_PENILAIAN}}

{{MINGGU_3_SUBCPMK}}
{{MINGGU_3_MATERI}}
{{MINGGU_3_METODE}}
{{MINGGU_3_PENILAIAN}}

{{MINGGU_4_SUBCPMK}}
{{MINGGU_4_MATERI}}
{{MINGGU_4_METODE}}
{{MINGGU_4_PENILAIAN}}

{{MINGGU_5_SUBCPMK}}
{{MINGGU_5_MATERI}}
{{MINGGU_5_METODE}}
{{MINGGU_5_PENILAIAN}}

{{MINGGU_6_SUBCPMK}}
{{MINGGU_6_MATERI}}
{{MINGGU_6_METODE}}
{{MINGGU_6_PENILAIAN}}

{{MINGGU_7_SUBCPMK}}
{{MINGGU_7_MATERI}}
{{MINGGU_7_METODE}}
{{MINGGU_7_PENILAIAN}}
```

### **Minggu 8 (UTS)**

```
{{MINGGU_8_SUBCPMK}}       - Fixed: "UTS"
{{MINGGU_8_MATERI}}        - Fixed: "Ujian Tengah Semester"
{{MINGGU_8_METODE}}        - Fixed: "Ujian Tertulis/Online"
{{MINGGU_8_PENILAIAN}}     - Fixed: "Ujian"
```

### **Minggu 9-15 (Materi Lanjutan)**

```
{{MINGGU_9_SUBCPMK}}
{{MINGGU_9_MATERI}}
{{MINGGU_9_METODE}}
{{MINGGU_9_PENILAIAN}}

{{MINGGU_10_SUBCPMK}}
{{MINGGU_10_MATERI}}
{{MINGGU_10_METODE}}
{{MINGGU_10_PENILAIAN}}

{{MINGGU_11_SUBCPMK}}
{{MINGGU_11_MATERI}}
{{MINGGU_11_METODE}}
{{MINGGU_11_PENILAIAN}}

{{MINGGU_12_SUBCPMK}}
{{MINGGU_12_MATERI}}
{{MINGGU_12_METODE}}
{{MINGGU_12_PENILAIAN}}

{{MINGGU_13_SUBCPMK}}
{{MINGGU_13_MATERI}}
{{MINGGU_13_METODE}}
{{MINGGU_13_PENILAIAN}}

{{MINGGU_14_SUBCPMK}}
{{MINGGU_14_MATERI}}
{{MINGGU_14_METODE}}
{{MINGGU_14_PENILAIAN}}

{{MINGGU_15_SUBCPMK}}
{{MINGGU_15_MATERI}}
{{MINGGU_15_METODE}}
{{MINGGU_15_PENILAIAN}}
```

### **Minggu 16 (UAS)**

```
{{MINGGU_16_SUBCPMK}}      - Fixed: "UAS"
{{MINGGU_16_MATERI}}       - Fixed: "Ujian Akhir Semester"
{{MINGGU_16_METODE}}       - Fixed: "Ujian Tertulis/Online"
{{MINGGU_16_PENILAIAN}}    - Fixed: "Ujian"
```

---

## 7️⃣ RENCANA TUGAS (14 Tugas)
*1 tugas per minggu materi (exclude UTS & UAS)*

### **Tugas 1**
```
{{TUGAS_1_SUBCPMK}}            - Sub-CPMK terkait
{{TUGAS_1_INDIKATOR}}          - Indikator penilaian tugas
{{TUGAS_1_JUDUL}}              - Judul/nama tugas
{{TUGAS_1_BATAS_WAKTU}}        - Batas waktu pengumpulan
{{TUGAS_1_PETUNJUK}}           - Petunjuk pengerjaan lengkap
{{TUGAS_1_LUARAN}}             - Luaran yang diharapkan
{{TUGAS_1_KRITERIA}}           - Kriteria penilaian
{{TUGAS_1_TEKNIK}}             - Teknik penilaian
{{TUGAS_1_BOBOT}}              - Bobot persen (%)
```

### **Tugas 2**
```
{{TUGAS_2_SUBCPMK}}
{{TUGAS_2_INDIKATOR}}
{{TUGAS_2_JUDUL}}
{{TUGAS_2_BATAS_WAKTU}}
{{TUGAS_2_PETUNJUK}}
{{TUGAS_2_LUARAN}}
{{TUGAS_2_KRITERIA}}
{{TUGAS_2_TEKNIK}}
{{TUGAS_2_BOBOT}}
```

### **Tugas 3**
```
{{TUGAS_3_SUBCPMK}}
{{TUGAS_3_INDIKATOR}}
{{TUGAS_3_JUDUL}}
{{TUGAS_3_BATAS_WAKTU}}
{{TUGAS_3_PETUNJUK}}
{{TUGAS_3_LUARAN}}
{{TUGAS_3_KRITERIA}}
{{TUGAS_3_TEKNIK}}
{{TUGAS_3_BOBOT}}
```

### **Tugas 4**
```
{{TUGAS_4_SUBCPMK}}
{{TUGAS_4_INDIKATOR}}
{{TUGAS_4_JUDUL}}
{{TUGAS_4_BATAS_WAKTU}}
{{TUGAS_4_PETUNJUK}}
{{TUGAS_4_LUARAN}}
{{TUGAS_4_KRITERIA}}
{{TUGAS_4_TEKNIK}}
{{TUGAS_4_BOBOT}}
```

### **Tugas 5**
```
{{TUGAS_5_SUBCPMK}}
{{TUGAS_5_INDIKATOR}}
{{TUGAS_5_JUDUL}}
{{TUGAS_5_BATAS_WAKTU}}
{{TUGAS_5_PETUNJUK}}
{{TUGAS_5_LUARAN}}
{{TUGAS_5_KRITERIA}}
{{TUGAS_5_TEKNIK}}
{{TUGAS_5_BOBOT}}
```

### **Tugas 6**
```
{{TUGAS_6_SUBCPMK}}
{{TUGAS_6_INDIKATOR}}
{{TUGAS_6_JUDUL}}
{{TUGAS_6_BATAS_WAKTU}}
{{TUGAS_6_PETUNJUK}}
{{TUGAS_6_LUARAN}}
{{TUGAS_6_KRITERIA}}
{{TUGAS_6_TEKNIK}}
{{TUGAS_6_BOBOT}}
```

### **Tugas 7**
```
{{TUGAS_7_SUBCPMK}}
{{TUGAS_7_INDIKATOR}}
{{TUGAS_7_JUDUL}}
{{TUGAS_7_BATAS_WAKTU}}
{{TUGAS_7_PETUNJUK}}
{{TUGAS_7_LUARAN}}
{{TUGAS_7_KRITERIA}}
{{TUGAS_7_TEKNIK}}
{{TUGAS_7_BOBOT}}
```

### **Tugas 8**
```
{{TUGAS_8_SUBCPMK}}
{{TUGAS_8_INDIKATOR}}
{{TUGAS_8_JUDUL}}
{{TUGAS_8_BATAS_WAKTU}}
{{TUGAS_8_PETUNJUK}}
{{TUGAS_8_LUARAN}}
{{TUGAS_8_KRITERIA}}
{{TUGAS_8_TEKNIK}}
{{TUGAS_8_BOBOT}}
```

### **Tugas 9**
```
{{TUGAS_9_SUBCPMK}}
{{TUGAS_9_INDIKATOR}}
{{TUGAS_9_JUDUL}}
{{TUGAS_9_BATAS_WAKTU}}
{{TUGAS_9_PETUNJUK}}
{{TUGAS_9_LUARAN}}
{{TUGAS_9_KRITERIA}}
{{TUGAS_9_TEKNIK}}
{{TUGAS_9_BOBOT}}
```

### **Tugas 10**
```
{{TUGAS_10_SUBCPMK}}
{{TUGAS_10_INDIKATOR}}
{{TUGAS_10_JUDUL}}
{{TUGAS_10_BATAS_WAKTU}}
{{TUGAS_10_PETUNJUK}}
{{TUGAS_10_LUARAN}}
{{TUGAS_10_KRITERIA}}
{{TUGAS_10_TEKNIK}}
{{TUGAS_10_BOBOT}}
```

### **Tugas 11**
```
{{TUGAS_11_SUBCPMK}}
{{TUGAS_11_INDIKATOR}}
{{TUGAS_11_JUDUL}}
{{TUGAS_11_BATAS_WAKTU}}
{{TUGAS_11_PETUNJUK}}
{{TUGAS_11_LUARAN}}
{{TUGAS_11_KRITERIA}}
{{TUGAS_11_TEKNIK}}
{{TUGAS_11_BOBOT}}
```

### **Tugas 12**
```
{{TUGAS_12_SUBCPMK}}
{{TUGAS_12_INDIKATOR}}
{{TUGAS_12_JUDUL}}
{{TUGAS_12_BATAS_WAKTU}}
{{TUGAS_12_PETUNJUK}}
{{TUGAS_12_LUARAN}}
{{TUGAS_12_KRITERIA}}
{{TUGAS_12_TEKNIK}}
{{TUGAS_12_BOBOT}}
```

### **Tugas 13**
```
{{TUGAS_13_SUBCPMK}}
{{TUGAS_13_INDIKATOR}}
{{TUGAS_13_JUDUL}}
{{TUGAS_13_BATAS_WAKTU}}
{{TUGAS_13_PETUNJUK}}
{{TUGAS_13_LUARAN}}
{{TUGAS_13_KRITERIA}}
{{TUGAS_13_TEKNIK}}
{{TUGAS_13_BOBOT}}
```

### **Tugas 14**
```
{{TUGAS_14_SUBCPMK}}
{{TUGAS_14_INDIKATOR}}
{{TUGAS_14_JUDUL}}
{{TUGAS_14_BATAS_WAKTU}}
{{TUGAS_14_PETUNJUK}}
{{TUGAS_14_LUARAN}}
{{TUGAS_14_KRITERIA}}
{{TUGAS_14_TEKNIK}}
{{TUGAS_14_BOBOT}}
```

---

## 8️⃣ REFERENSI
*Minimal 5 referensi (buku/jurnal)*

```
{{REFERENSI_1}}       - Referensi buku/jurnal 1 (format APA/IEEE)
{{REFERENSI_2}}       - Referensi buku/jurnal 2
{{REFERENSI_3}}       - Referensi buku/jurnal 3
{{REFERENSI_4}}       - Referensi buku/jurnal 4
{{REFERENSI_5}}       - Referensi buku/jurnal 5
```

---

## 📊 CONTOH PENGGUNAAN DI WORD TEMPLATE

### **Contoh Tabel CPMK:**

| No | Kode | Deskripsi CPMK | CPL Terkait |
|----|------|----------------|-------------|
| 1  | {{CPMK_1_CODE}} | {{CPMK_1_DESC}} | {{CPMK_1_CPL}} |
| 2  | {{CPMK_2_CODE}} | {{CPMK_2_DESC}} | {{CPMK_2_CPL}} |
| 3  | {{CPMK_3_CODE}} | {{CPMK_3_DESC}} | {{CPMK_3_CPL}} |

### **Contoh Tabel Rencana Mingguan:**

| Minggu | Sub-CPMK | Materi | Metode | Penilaian |
|--------|----------|--------|--------|-----------|
| 1 | {{MINGGU_1_SUBCPMK}} | {{MINGGU_1_MATERI}} | {{MINGGU_1_METODE}} | {{MINGGU_1_PENILAIAN}} |
| 2 | {{MINGGU_2_SUBCPMK}} | {{MINGGU_2_MATERI}} | {{MINGGU_2_METODE}} | {{MINGGU_2_PENILAIAN}} |
| ... | ... | ... | ... | ... |
| 8 | {{MINGGU_8_SUBCPMK}} | {{MINGGU_8_MATERI}} | {{MINGGU_8_METODE}} | {{MINGGU_8_PENILAIAN}} |

### **Contoh Tabel Rencana Tugas:**

| No | Judul Tugas | Sub-CPMK | Batas Waktu | Bobot |
|----|-------------|----------|-------------|-------|
| 1 | {{TUGAS_1_JUDUL}} | {{TUGAS_1_SUBCPMK}} | {{TUGAS_1_BATAS_WAKTU}} | {{TUGAS_1_BOBOT}} |
| 2 | {{TUGAS_2_JUDUL}} | {{TUGAS_2_SUBCPMK}} | {{TUGAS_2_BATAS_WAKTU}} | {{TUGAS_2_BOBOT}} |

---

## 🔧 CATATAN PENTING

1. **Format Placeholder:** Selalu gunakan `{{UPPERCASE_DENGAN_UNDERSCORE}}`
2. **Nomor Urut:** Gunakan angka untuk data array (CPMK_1, TUGAS_1, dll)
3. **Tidak Ada Spasi:** Dalam kurung kurawal tidak ada spasi
4. **Case Sensitive:** Placeholder harus persis sama (huruf besar semua)
5. **Data Dinamis:** Jumlah CPMK bisa bervariasi, tapi Sub-CPMK fixed 14
6. **Data Optional:** Jika data kosong, placeholder akan diganti dengan string kosong

---

## 📝 TOTAL PLACEHOLDER

- **Info MK:** 10 placeholder
- **Deskripsi:** 1 placeholder
- **CPMK:** 15 placeholder (5 CPMK × 3 field)
- **Sub-CPMK:** 42 placeholder (14 Sub-CPMK × 3 field)
- **Bahan Kajian:** 5 placeholder
- **Rencana Mingguan:** 64 placeholder (16 minggu × 4 field)
- **Rencana Tugas:** 126 placeholder (14 tugas × 9 field)
- **Referensi:** 5 placeholder

**TOTAL: ~268 placeholder**

---

Simpan file ini sebagai referensi saat mengedit template Word!
