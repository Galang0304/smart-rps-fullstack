$file = "c:\Users\syahr\Documents\smart-rps-fullstack\backend\templates\template_extract\word\document.xml"
$content = [IO.File]::ReadAllText($file)

Write-Host "Original length: $($content.Length)"

# Use regex to find and replace broken placeholders
# Pattern for {{range ...}} that may be split across XML tags

# Remove all {{range...}} patterns (they span across w:t tags)
$content = [regex]::Replace($content, '\{\{range[^}]*\}\}', '')

# Remove all {{end}} patterns
$content = [regex]::Replace($content, '\{\{end\}\}', '')

# Remove all {{if ...}} patterns
$content = [regex]::Replace($content, '\{\{if[^}]*\}\}', '')

# Replace S-{{add $index 1}} with S-1
$content = [regex]::Replace($content, 'S-\{\{add[^}]*\}\}', 'S-1')

# Replace {{add ...}} patterns
$content = [regex]::Replace($content, '\{\{add[^}]*\}\}', '1')

# Replace ({{.CPL}}) with empty
$content = $content.Replace('({{.CPL}})', '')

Write-Host "New length: $($content.Length)"
Write-Host "Removed: $($content.Length) chars"

[IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
Write-Host "Template fixed!"
