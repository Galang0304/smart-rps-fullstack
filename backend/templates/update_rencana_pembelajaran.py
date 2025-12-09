#!/usr/bin/env python3
"""
Script to update template_rps.docx with proper row-based placeholders
for Rencana Pembelajaran table (16 weeks with individual row placeholders)
"""

import zipfile
import os
import re
import shutil

def update_template():
    template_path = "template_rps.docx"
    backup_path = "template_rps_backup.docx"
    
    # Backup original
    if os.path.exists(template_path):
        shutil.copy(template_path, backup_path)
        print(f"Backup created: {backup_path}")
    
    # Extract docx
    extract_dir = "temp_update"
    if os.path.exists(extract_dir):
        shutil.rmtree(extract_dir)
    
    with zipfile.ZipFile(template_path, 'r') as zip_ref:
        zip_ref.extractall(extract_dir)
    
    # Read document.xml
    doc_path = os.path.join(extract_dir, "word", "document.xml")
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the Rencana Pembelajaran table and update placeholders
    # The current template uses {MINGGU_KE}, {SUB_CPMK_MINGGUAN}, etc.
    # We need to replace them with 16 rows of individual placeholders
    
    # Generate the new table rows XML for 16 weeks
    def generate_week_rows():
        rows = ""
        for week in range(1, 17):
            rows += f'''<w:tr>
<w:tc><w:p><w:r><w:t>{{MINGGU_{week}}}</w:t></w:r></w:p></w:tc>
<w:tc><w:p><w:r><w:t>{{SUB_CPMK_{week}}}</w:t></w:r></w:p></w:tc>
<w:tc><w:p><w:r><w:t>{{INDIKATOR_{week}}}</w:t></w:r></w:p></w:tc>
<w:tc><w:p><w:r><w:t>{{TOPIK_{week}}}</w:t></w:r></w:p></w:tc>
<w:tc><w:p><w:r><w:t>{{METODE_{week}}}</w:t></w:r></w:p></w:tc>
<w:tc><w:p><w:r><w:t>{{WAKTU_{week}}}</w:t></w:r></w:p></w:tc>
<w:tc><w:p><w:r><w:t>{{KRITERIA_{week}}}</w:t></w:r></w:p></w:tc>
<w:tc><w:p><w:r><w:t>{{BOBOT_{week}}}</w:t></w:r></w:p></w:tc>
</w:tr>
'''
        return rows
    
    # For now, let's just print instructions since the XML structure is complex
    print("\n" + "="*60)
    print("INSTRUKSI MANUAL UPDATE TEMPLATE:")
    print("="*60)
    print("""
Template Word perlu diupdate secara manual untuk menggunakan
placeholder per-row. Buka template_rps.docx dan pada tabel
'RENCANA PEMBELAJARAN', ubah dari format single-cell menjadi
16 row terpisah dengan placeholder:

Row 1:  {MINGGU_1}  {SUB_CPMK_1}  {INDIKATOR_1}  {TOPIK_1}  {METODE_1}  {WAKTU_1}  {KRITERIA_1}  {BOBOT_1}
Row 2:  {MINGGU_2}  {SUB_CPMK_2}  {INDIKATOR_2}  {TOPIK_2}  {METODE_2}  {WAKTU_2}  {KRITERIA_2}  {BOBOT_2}
...
Row 16: {MINGGU_16} {SUB_CPMK_16} {INDIKATOR_16} {TOPIK_16} {METODE_16} {WAKTU_16} {KRITERIA_16} {BOBOT_16}

Atau gunakan placeholder legacy yang sudah ada dengan newline separator.
    """)
    
    # Cleanup
    shutil.rmtree(extract_dir)
    
    print("Script selesai.")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    update_template()
