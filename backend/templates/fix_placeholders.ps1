$file = "c:\Users\syahr\Documents\smart-rps-fullstack\backend\templates\template_extract\word\document.xml"
$content = Get-Content $file -Raw -Encoding UTF8

Write-Host "Original length: $($content.Length)"

# Fix complex placeholders
$content = $content.Replace('{{range $index, $header := .SubCPMKHeaders}}', '')
$content = $content.Replace('{{range .CPMKKorelasi}}', '')
$content = $content.Replace('{{range .Korelasi}}', '')
$content = $content.Replace('S-{{add $index 1}}', 'S-1')
$content = $content.Replace('{{if .CPL}}', '')
$content = $content.Replace('{{end}}', '')
$content = $content.Replace('{{if .}}', '')
$content = $content.Replace('({{.CPL}})', '')

Write-Host "New length: $($content.Length)"

Set-Content -Path $file -Value $content -NoNewline -Encoding UTF8
Write-Host "Template fixed"
