# Copies PNG screenshots from Cursor workspace storage into readme/screenshots/
# Run from: readme\  (Right-click PowerShell "Run with PowerShell" or: .\copy-screenshots.ps1)

$Source = "C:\Users\jonat\.cursor\projects\c-Semester6-FullStack-Pro-Assignment2\assets"
$Dest = Join-Path $PSScriptRoot "screenshots"

if (-not (Test-Path $Source)) {
    Write-Host "Source not found: $Source"
    Write-Host "Edit `$Source in this script to your Cursor project assets path."
    exit 1
}

New-Item -ItemType Directory -Force -Path $Dest | Out-Null
$files = Get-ChildItem -Path $Source -Recurse -Filter *.png -ErrorAction SilentlyContinue
if (-not $files) {
    Write-Host "No PNG files found under $Source"
    exit 0
}

$i = 1
foreach ($f in $files | Sort-Object FullName) {
    $name = "{0:D2}-{1}" -f $i, $f.Name
    Copy-Item -LiteralPath $f.FullName -Destination (Join-Path $Dest $name) -Force
    Write-Host "Copied $($f.Name) -> $name"
    $i++
}

Write-Host "`nDone. Rename files in screenshots\ to match SCREENSHOTS.md if you want cleaner names."
