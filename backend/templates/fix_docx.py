import re
import zipfile
import shutil
import os

def fix_placeholders(xml_content):
    """Fix split placeholders in Word XML"""
    
    # Pattern to find split placeholders like {{...split XML...}}
    # We need to merge them back together
    
    # List of all placeholders we expect
    placeholders = [
        'NAMA_MK', 'KODE_MK', 'RUMPUN_MK', 'SKS_TEORI', 'SKS_PRAKTIK', 
        'SEMESTER', 'TGL_PENYUSUNAN', 'NAMA_PENYUSUN', 'KOORDINATOR_MK', 
        'KETUA_PRODI', 'CPL_LIST', 'CPMK_LIST', 'SUB_CPMK_LIST', 
        'DESKRIPSI_MK', 'TOPIK_LIST', 'REFERENSI_LIST', 'MK_PRASYARAT',
        'MINGGU_KE', 'SUB_CPMK_MINGGUAN', 'INDIKATOR_MINGGUAN', 
        'TOPIK_MINGGUAN', 'METODE_PEMBELAJARAN', 'ESTIMASI_WAKTU',
        'KRITERIA_PENILAIAN', 'BOBOT_NILAI', 'SKS',
        'BOBOT_TUGAS_1', 'BOBOT_TUGAS_2', 'BOBOT_TUGAS_3',
        'SUB_CPMK_TUGAS_1', 'SUB_CPMK_TUGAS_2', 'SUB_CPMK_TUGAS_3',
        'INDIKATOR_TUGAS_1', 'INDIKATOR_TUGAS_2', 'INDIKATOR_TUGAS_3',
        'JUDUL_TUGAS_1', 'JUDUL_TUGAS_2', 'JUDUL_TUGAS_3',
        'BATAS_TUGAS_1', 'BATAS_TUGAS_2', 'BATAS_TUGAS_3',
        'PETUNJUK_TUGAS_1', 'PETUNJUK_TUGAS_2', 'PETUNJUK_TUGAS_3',
        'LUARAN_TUGAS_1', 'LUARAN_TUGAS_2', 'LUARAN_TUGAS_3',
        'KRITERIA_TUGAS_1', 'KRITERIA_TUGAS_2', 'KRITERIA_TUGAS_3',
        'TEKNIK_PENILAIAN_TUGAS_1', 'TEKNIK_PENILAIAN_TUGAS_2', 'TEKNIK_PENILAIAN_TUGAS_3',
    ]
    
    fixed_content = xml_content
    
    # For each placeholder, find any split version and replace with clean version
    for ph in placeholders:
        # Build regex pattern that matches the placeholder split across XML tags
        # Match {{ followed by optional XML, then each character of placeholder (possibly split), then }}
        
        # Simple approach: find {{...}} patterns that contain the placeholder text somewhere inside
        # and have XML tags mixed in
        
        # Pattern: finds {{ ... PLACEHOLDER_NAME ... }} with XML tags in between
        chars = list(ph)
        
        # Build a pattern that allows XML tags between any characters
        pattern_parts = [r'\{\{']
        for i, c in enumerate(chars):
            if c == '_':
                pattern_parts.append(r'(?:</w:t></w:r>.*?<w:r>.*?<w:t>)?_')
            else:
                pattern_parts.append(f'(?:</w:t></w:r>.*?<w:r>.*?<w:t>)?{c}')
        pattern_parts.append(r'(?:</w:t></w:r>.*?<w:r>.*?<w:t>)?\}\}')
        
        # This is too complex, let's use a simpler approach
        
    # Simpler approach: find all {{ ... }} patterns and check if they're split
    # Pattern to find potential split placeholders
    pattern = r'\{\{(?:[^}]|</w:t>|<w:t>|<w:r>|</w:r>|<w:rPr>|</w:rPr>|<w:lang[^/]*/?>)*?\}\}'
    
    def clean_placeholder(match):
        text = match.group(0)
        # Extract just the text content, removing XML tags
        cleaned = re.sub(r'<[^>]+>', '', text)
        # Remove extra whitespace
        cleaned = re.sub(r'\s+', '', cleaned)
        return cleaned
    
    # Find all matches and replace
    fixed_content = re.sub(pattern, clean_placeholder, fixed_content)
    
    return fixed_content

def main():
    template_dir = os.path.dirname(os.path.abspath(__file__))
    docx_path = os.path.join(template_dir, 'template_rps.docx')
    temp_dir = os.path.join(template_dir, 'temp_docx')
    output_path = os.path.join(template_dir, 'template_rps_fixed.docx')
    
    print(f"Processing: {docx_path}")
    
    # Extract docx
    with zipfile.ZipFile(docx_path, 'r') as zip_ref:
        zip_ref.extractall(temp_dir)
    
    # Read document.xml
    doc_path = os.path.join(temp_dir, 'word', 'document.xml')
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Count before
    before_count = len(re.findall(r'\{\{[A-Z_0-9]+\}\}', content))
    print(f"Clean placeholders before: {before_count}")
    
    # Fix placeholders
    fixed_content = fix_placeholders(content)
    
    # Count after
    after_count = len(re.findall(r'\{\{[A-Z_0-9]+\}\}', fixed_content))
    print(f"Clean placeholders after: {after_count}")
    
    # Find all placeholders
    all_placeholders = re.findall(r'\{\{[A-Z_0-9]+\}\}', fixed_content)
    print(f"\nPlaceholders found:")
    for ph in sorted(set(all_placeholders)):
        print(f"  {ph}")
    
    # Save fixed document.xml
    with open(doc_path, 'w', encoding='utf-8') as f:
        f.write(fixed_content)
    
    # Repack docx
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(temp_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arc_name = os.path.relpath(file_path, temp_dir)
                zipf.write(file_path, arc_name)
    
    print(f"\nFixed template saved to: {output_path}")
    
    # Also overwrite original
    shutil.copy(output_path, docx_path)
    print(f"Original template updated: {docx_path}")

if __name__ == '__main__':
    main()
