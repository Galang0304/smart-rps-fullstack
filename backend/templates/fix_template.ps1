$file = "c:\Users\syahr\Documents\smart-rps-fullstack\backend\templates\template_extract\word\document.xml"
$content = [IO.File]::ReadAllText($file)

# Fix all broken placeholders by removing XML tags between {{ and }}
# Pattern: {{ ... </w:t></w:r><w:r>...<w:t> ... }}

# Specific fixes based on what we found
$fixes = @{
    '{{.BobotSKS</w:t></w:r></w:p><w:p w14:paraId="39B0E03A" w14:textId="77777777" w:rsidR="00517399" w:rsidRDefault="00000000"><w:pPr><w:pStyle w:val="TableParagraph"/><w:spacing w:before="70"/><w:ind w:left="19"/><w:jc w:val="center"/><w:rPr><w:sz w:val="20"/></w:rPr></w:pPr><w:r><w:rPr><w:spacing w:val="-5"/><w:sz w:val="20"/></w:rPr><w:t>}}' = '{{.BobotSKS}}'
    '{{.Bo</w:t></w:r></w:p><w:p w14:paraId="6E9B7E97" w14:textId="77777777" w:rsidR="00517399" w:rsidRDefault="00000000"><w:pPr><w:pStyle w:val="TableParagraph"/><w:spacing w:before="70"/><w:ind w:left="172"/><w:rPr><w:sz w:val="20"/></w:rPr></w:pPr><w:r><w:rPr><w:spacing w:val="-2"/><w:sz w:val="20"/></w:rPr><w:t>bot}}' = '{{.Bobot}}'
    '{{.Wa</w:t></w:r></w:p><w:p w14:paraId="1962CBD5" w14:textId="77777777" w:rsidR="00517399" w:rsidRDefault="00000000"><w:pPr><w:pStyle w:val="TableParagraph"/><w:spacing w:before="56"/><w:ind w:left="152"/><w:rPr><w:sz w:val="16"/></w:rPr></w:pPr><w:r><w:rPr><w:spacing w:val="-2"/><w:sz w:val="16"/></w:rPr><w:t>ktu}}' = '{{.Waktu}}'
    '{{.Wa</w:t></w:r></w:p><w:p w14:paraId="3F9548F6" w14:textId="77777777" w:rsidR="00517399" w:rsidRDefault="00000000"><w:pPr><w:pStyle w:val="TableParagraph"/><w:spacing w:before="56"/><w:ind w:left="152"/><w:rPr><w:sz w:val="16"/></w:rPr></w:pPr><w:r><w:rPr><w:spacing w:val="-2"/><w:sz w:val="16"/></w:rPr><w:t>ktu}}' = '{{.Waktu}}'
    '{{range</w:t></w:r><w:r><w:rPr><w:spacing w:val="-1"/></w:rPr><w:t xml:space="preserve"> </w:t></w:r><w:r><w:t>.RencanaMingguan}}' = '{{range .RencanaMingguan}}'
    '{{range</w:t></w:r><w:r><w:rPr><w:spacing w:val="-1"/></w:rPr><w:t xml:space="preserve"> </w:t></w:r><w:r><w:t>.RencanaTugas}}' = '{{range .RencanaTugas}}'
    '{{range</w:t></w:r><w:r><w:rPr><w:spacing w:val="-1"/></w:rPr><w:t xml:space="preserve"> </w:t></w:r><w:r><w:t>.AnalisisKetercapaian}}' = '{{range .AnalisisKetercapaian}}'
    '{{range</w:t></w:r><w:r><w:rPr><w:spacing w:val="-1"/></w:rPr><w:t xml:space="preserve"> </w:t></w:r><w:r><w:t>.CPLList}}' = '{{range .CPLList}}'
    '{{range</w:t></w:r><w:r><w:rPr><w:spacing w:val="-1"/></w:rPr><w:t xml:space="preserve"> </w:t></w:r><w:r><w:t>.CPMKList}}' = '{{range .CPMKList}}'
    '{{range</w:t></w:r><w:r><w:rPr><w:spacing w:val="-1"/></w:rPr><w:t xml:space="preserve"> </w:t></w:r><w:r><w:t>.SubCPMKList}}' = '{{range .SubCPMKList}}'
    '{{if</w:t></w:r><w:r><w:rPr><w:b/><w:spacing w:val="-1"/><w:sz w:val="20"/></w:rPr><w:t xml:space="preserve"> </w:t></w:r><w:r><w:rPr><w:b/><w:spacing w:val="-2"/><w:sz w:val="20"/></w:rPr><w:t>.CPL}}' = '{{if .CPL}}'
    '{{if</w:t></w:r><w:r><w:rPr><w:spacing w:val="-1"/><w:sz w:val="20"/></w:rPr><w:t xml:space="preserve"> </w:t></w:r><w:r><w:rPr><w:spacing w:val="-2"/><w:sz w:val="20"/></w:rPr><w:t>.}}' = '{{if .}}'
    '{{add</w:t></w:r><w:r><w:rPr><w:spacing w:val="-1"/><w:sz w:val="20"/></w:rPr><w:t xml:space="preserve"> </w:t></w:r><w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t>$index</w:t></w:r><w:r><w:rPr><w:spacing w:val="-1"/><w:sz w:val="20"/></w:rPr><w:t xml:space="preserve"> </w:t></w:r><w:r><w:rPr><w:spacing w:val="-5"/><w:sz w:val="20"/></w:rPr><w:t>1}}' = '{{add $index 1}}'
}

foreach($key in $fixes.Keys) {
    $content = $content.Replace($key, $fixes[$key])
}

[IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
Write-Host "Fixed template"
