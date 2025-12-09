#!/usr/bin/env python3
"""
Convert double curly brace placeholders to single curly brace for go-docx compatibility.
Example: {{KODE_MK}} -> {KODE_MK}
"""

import zipfile
import re
import os
import shutil
from pathlib import Path

def convert_placeholders_in_docx(input_path, output_path):
    """Convert all {{placeholder}} to {placeholder} in docx file."""
    
    # Create temp directory
    temp_dir = Path("temp_docx_convert")
    if temp_dir.exists():
        shutil.rmtree(temp_dir)
    temp_dir.mkdir()
    
    # Extract docx
    with zipfile.ZipFile(input_path, 'r') as zip_ref:
        zip_ref.extractall(temp_dir)
    
    # Files to process
    xml_files = [
        temp_dir / "word" / "document.xml",
        temp_dir / "word" / "header1.xml",
        temp_dir / "word" / "header2.xml",
        temp_dir / "word" / "header3.xml",
        temp_dir / "word" / "footer1.xml",
        temp_dir / "word" / "footer2.xml",
        temp_dir / "word" / "footer3.xml",
    ]
    
    total_conversions = 0
    
    for xml_file in xml_files:
        if not xml_file.exists():
            continue
            
        with open(xml_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Count double curly braces before conversion
        original_count = len(re.findall(r'\{\{[^}]+\}\}', content))
        
        # Convert {{placeholder}} to {placeholder}
        # Pattern: {{ followed by any chars (not }), followed by }}
        new_content = re.sub(r'\{\{([^}]+)\}\}', r'{\1}', content)
        
        # Count single curly braces after conversion
        new_count = len(re.findall(r'\{[^{}]+\}', new_content))
        
        if content != new_content:
            with open(xml_file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Converted {xml_file.name}: {original_count} placeholders")
            total_conversions += original_count
    
    # Repack docx
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(temp_dir):
            for file in files:
                file_path = Path(root) / file
                arcname = file_path.relative_to(temp_dir)
                zipf.write(file_path, arcname)
    
    # Cleanup
    shutil.rmtree(temp_dir)
    
    print(f"\nTotal conversions: {total_conversions}")
    print(f"Output saved to: {output_path}")
    
    # Verify
    with zipfile.ZipFile(output_path, 'r') as zf:
        doc_xml = zf.read('word/document.xml').decode('utf-8')
        placeholders = re.findall(r'\{[A-Z_0-9]+\}', doc_xml)
        print(f"Placeholders found in output: {len(placeholders)}")
        for p in sorted(set(placeholders))[:10]:
            print(f"  {p}")
        if len(placeholders) > 10:
            print(f"  ... and {len(placeholders) - 10} more")

if __name__ == "__main__":
    import sys
    
    input_file = "template_rps.docx"
    output_file = "template_rps_fixed.docx"
    
    if len(sys.argv) > 1:
        input_file = sys.argv[1]
    if len(sys.argv) > 2:
        output_file = sys.argv[2]
    
    if not os.path.exists(input_file):
        print(f"Error: {input_file} not found")
        sys.exit(1)
    
    convert_placeholders_in_docx(input_file, output_file)
    
    # Replace original with fixed version
    backup = input_file + ".bak"
    shutil.copy(input_file, backup)
    shutil.copy(output_file, input_file)
    os.remove(output_file)
    print(f"\nOriginal backed up to: {backup}")
    print(f"Template updated: {input_file}")
