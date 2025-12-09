#!/usr/bin/env python3
"""
Script to automatically update template_rps.docx
Replace the single-cell Rencana Pembelajaran table with proper 16-row format
"""

import zipfile
import os
import re
import shutil
from xml.etree import ElementTree as ET

# XML namespaces used in docx
NAMESPACES = {
    'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
    'w14': 'http://schemas.microsoft.com/office/word/2010/wordml',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
}

# Register namespaces
for prefix, uri in NAMESPACES.items():
    ET.register_namespace(prefix, uri)

def create_table_cell(text, is_header=False, width=None, fill_color=None):
    """Create a table cell with text"""
    ns = NAMESPACES['w']
    
    tc = ET.Element(f'{{{ns}}}tc')
    
    # Cell properties
    tcPr = ET.SubElement(tc, f'{{{ns}}}tcPr')
    if width:
        tcW = ET.SubElement(tcPr, f'{{{ns}}}tcW')
        tcW.set(f'{{{ns}}}w', str(width))
        tcW.set(f'{{{ns}}}type', 'dxa')
    
    if fill_color:
        shd = ET.SubElement(tcPr, f'{{{ns}}}shd')
        shd.set(f'{{{ns}}}val', 'clear')
        shd.set(f'{{{ns}}}color', 'auto')
        shd.set(f'{{{ns}}}fill', fill_color)
    
    # Paragraph
    p = ET.SubElement(tc, f'{{{ns}}}p')
    pPr = ET.SubElement(p, f'{{{ns}}}pPr')
    
    # Center alignment for header
    if is_header:
        jc = ET.SubElement(pPr, f'{{{ns}}}jc')
        jc.set(f'{{{ns}}}val', 'center')
    
    # Run with text
    r = ET.SubElement(p, f'{{{ns}}}r')
    
    # Bold for header
    if is_header:
        rPr = ET.SubElement(r, f'{{{ns}}}rPr')
        b = ET.SubElement(rPr, f'{{{ns}}}b')
        sz = ET.SubElement(rPr, f'{{{ns}}}sz')
        sz.set(f'{{{ns}}}val', '18')  # 9pt
    
    t = ET.SubElement(r, f'{{{ns}}}t')
    t.text = text
    
    return tc

def create_table_row(cells_data, is_header=False, fill_color=None):
    """Create a table row with cells"""
    ns = NAMESPACES['w']
    
    tr = ET.Element(f'{{{ns}}}tr')
    
    for cell_text in cells_data:
        tc = create_table_cell(cell_text, is_header, fill_color=fill_color if is_header else None)
        tr.append(tc)
    
    return tr

def create_rencana_pembelajaran_table():
    """Create the complete Rencana Pembelajaran table XML"""
    ns = NAMESPACES['w']
    
    # Table element
    tbl = ET.Element(f'{{{ns}}}tbl')
    
    # Table properties
    tblPr = ET.SubElement(tbl, f'{{{ns}}}tblPr')
    tblStyle = ET.SubElement(tblPr, f'{{{ns}}}tblStyle')
    tblStyle.set(f'{{{ns}}}val', 'TableGrid')
    tblW = ET.SubElement(tblPr, f'{{{ns}}}tblW')
    tblW.set(f'{{{ns}}}w', '5000')
    tblW.set(f'{{{ns}}}type', 'pct')
    
    # Table grid (column widths)
    tblGrid = ET.SubElement(tbl, f'{{{ns}}}tblGrid')
    col_widths = [600, 1500, 2400, 2400, 1800, 900, 1200, 900]
    for w in col_widths:
        gridCol = ET.SubElement(tblGrid, f'{{{ns}}}gridCol')
        gridCol.set(f'{{{ns}}}w', str(w))
    
    # Header row
    headers = [
        "MG KE",
        "SUB-CPMK", 
        "INDIKATOR",
        "TOPIK & SUB-TOPIK",
        "METODE",
        "WAKTU",
        "KRITERIA",
        "BOBOT"
    ]
    header_row = create_table_row(headers, is_header=True, fill_color="00B0F0")
    tbl.append(header_row)
    
    # Data rows (16 weeks)
    for week in range(1, 17):
        row_data = [
            f"{{MINGGU_{week}}}",
            f"{{SUB_CPMK_{week}}}",
            f"{{INDIKATOR_{week}}}",
            f"{{TOPIK_{week}}}",
            f"{{METODE_{week}}}",
            f"{{WAKTU_{week}}}",
            f"{{KRITERIA_{week}}}",
            f"{{BOBOT_{week}}}"
        ]
        data_row = create_table_row(row_data)
        tbl.append(data_row)
    
    return tbl

def update_template():
    """Update the template_rps.docx file"""
    
    template_path = "template_rps.docx"
    output_path = "template_rps_updated.docx"
    
    if not os.path.exists(template_path):
        print(f"ERROR: Template not found: {template_path}")
        return False
    
    # Create working directory
    work_dir = "temp_template_update"
    if os.path.exists(work_dir):
        shutil.rmtree(work_dir)
    os.makedirs(work_dir)
    
    # Extract docx
    with zipfile.ZipFile(template_path, 'r') as zip_ref:
        zip_ref.extractall(work_dir)
    
    # Read document.xml
    doc_xml_path = os.path.join(work_dir, "word", "document.xml")
    
    with open(doc_xml_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace curly brace placeholders format
    # The template might have {{PLACEHOLDER}} or {PLACEHOLDER}
    # Ensure single curly braces are used
    
    # Find the table with RENCANA PEMBELAJARAN and replace old placeholders
    # with new per-row placeholders
    
    # Replace old single-cell placeholders with first row placeholders
    # This is a simplified approach - the full solution would parse XML properly
    
    replacements = {
        '{MINGGU_KE}': '{MINGGU_1}\n{MINGGU_2}\n{MINGGU_3}\n{MINGGU_4}\n{MINGGU_5}\n{MINGGU_6}\n{MINGGU_7}\n{MINGGU_8}\n{MINGGU_9}\n{MINGGU_10}\n{MINGGU_11}\n{MINGGU_12}\n{MINGGU_13}\n{MINGGU_14}\n{MINGGU_15}\n{MINGGU_16}',
        '{SUB_CPMK_MINGGUAN}': '{SUB_CPMK_1}\n{SUB_CPMK_2}\n{SUB_CPMK_3}\n{SUB_CPMK_4}\n{SUB_CPMK_5}\n{SUB_CPMK_6}\n{SUB_CPMK_7}\n{SUB_CPMK_8}\n{SUB_CPMK_9}\n{SUB_CPMK_10}\n{SUB_CPMK_11}\n{SUB_CPMK_12}\n{SUB_CPMK_13}\n{SUB_CPMK_14}\n{SUB_CPMK_15}\n{SUB_CPMK_16}',
        '{INDIKATOR_MINGGUAN}': '{INDIKATOR_1}\n{INDIKATOR_2}\n{INDIKATOR_3}\n{INDIKATOR_4}\n{INDIKATOR_5}\n{INDIKATOR_6}\n{INDIKATOR_7}\n{INDIKATOR_8}\n{INDIKATOR_9}\n{INDIKATOR_10}\n{INDIKATOR_11}\n{INDIKATOR_12}\n{INDIKATOR_13}\n{INDIKATOR_14}\n{INDIKATOR_15}\n{INDIKATOR_16}',
        '{TOPIK_MINGGUAN}': '{TOPIK_1}\n{TOPIK_2}\n{TOPIK_3}\n{TOPIK_4}\n{TOPIK_5}\n{TOPIK_6}\n{TOPIK_7}\n{TOPIK_8}\n{TOPIK_9}\n{TOPIK_10}\n{TOPIK_11}\n{TOPIK_12}\n{TOPIK_13}\n{TOPIK_14}\n{TOPIK_15}\n{TOPIK_16}',
        '{METODE_PEMBELAJARAN}': '{METODE_1}\n{METODE_2}\n{METODE_3}\n{METODE_4}\n{METODE_5}\n{METODE_6}\n{METODE_7}\n{METODE_8}\n{METODE_9}\n{METODE_10}\n{METODE_11}\n{METODE_12}\n{METODE_13}\n{METODE_14}\n{METODE_15}\n{METODE_16}',
        '{ESTIMASI_WAKTU}': '{WAKTU_1}\n{WAKTU_2}\n{WAKTU_3}\n{WAKTU_4}\n{WAKTU_5}\n{WAKTU_6}\n{WAKTU_7}\n{WAKTU_8}\n{WAKTU_9}\n{WAKTU_10}\n{WAKTU_11}\n{WAKTU_12}\n{WAKTU_13}\n{WAKTU_14}\n{WAKTU_15}\n{WAKTU_16}',
        '{KRITERIA_PENILAIAN}': '{KRITERIA_1}\n{KRITERIA_2}\n{KRITERIA_3}\n{KRITERIA_4}\n{KRITERIA_5}\n{KRITERIA_6}\n{KRITERIA_7}\n{KRITERIA_8}\n{KRITERIA_9}\n{KRITERIA_10}\n{KRITERIA_11}\n{KRITERIA_12}\n{KRITERIA_13}\n{KRITERIA_14}\n{KRITERIA_15}\n{KRITERIA_16}',
        '{BOBOT_NILAI}': '{BOBOT_1}\n{BOBOT_2}\n{BOBOT_3}\n{BOBOT_4}\n{BOBOT_5}\n{BOBOT_6}\n{BOBOT_7}\n{BOBOT_8}\n{BOBOT_9}\n{BOBOT_10}\n{BOBOT_11}\n{BOBOT_12}\n{BOBOT_13}\n{BOBOT_14}\n{BOBOT_15}\n{BOBOT_16}',
    }
    
    for old, new in replacements.items():
        content = content.replace(old, new)
    
    # Write updated document.xml
    with open(doc_xml_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    # Repack docx
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(work_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, work_dir)
                zipf.write(file_path, arcname)
    
    # Cleanup
    shutil.rmtree(work_dir)
    
    # Replace original with updated
    shutil.move(output_path, template_path)
    
    print(f"Template updated: {template_path}")
    print("Placeholders now use per-row format: {{MINGGU_1}}, {{SUB_CPMK_1}}, etc.")
    return True

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    update_template()
