param(
    [switch]$NoChat,
    [string]$Model
)

try { $Host.UI.RawUI.WindowTitle = "Ollama Picker" } catch {}

# --- Step 1: Find / start Ollama ---
$ollama = Get-Command ollama.exe -ErrorAction SilentlyContinue
if (-not $ollama) {
    $paths = @(
        "$env:LOCALAPPDATA\Programs\Ollama\ollama.exe",
        "${env:ProgramFiles}\Ollama\ollama.exe",
        "${env:ProgramFiles(x86)}\Ollama\ollama.exe"
    )
    $ollamaPath = $null
    foreach ($p in $paths) {
        if (Test-Path $p) { $ollamaPath = $p; break }
    }
    if (-not $ollamaPath) {
        Write-Host "Ollama not found. Install from https://ollama.com" -ForegroundColor Red
        pause
        exit 1
    }
    $ollama = Get-Command $ollamaPath
}

$proc = Get-Process ollama -ErrorAction SilentlyContinue
if (-not $proc) {
    Write-Host "Starting Ollama..." -ForegroundColor Cyan
    Start-Process -FilePath $ollama.Source -WindowStyle Hidden
    Start-Sleep -Seconds 3
}

# --- Step 2: Fetch models ---
Write-Host "Fetching available models..." -ForegroundColor Cyan
$list = & $ollama list 2>$null
if (-not $list -or $list.Count -le 1) {
    Write-Host "No models found. Pull one first, e.g.: ollama pull llama3.2" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Suggested models:" -ForegroundColor Green
    Write-Host "    llama3.2       (8B, solid general-purpose)" -ForegroundColor Gray
    Write-Host "    llama3.2:1b    (tiny, fast)" -ForegroundColor Gray
    Write-Host "    mistral        (7B, good code/chat)" -ForegroundColor Gray
    Write-Host "    deepseek-r1:8b (reasoning, mid-range)" -ForegroundColor Gray
    Write-Host "    phi4           (14B, smart on modest hardware)" -ForegroundColor Gray
    pause
    exit 0
}

# Parse model table (skip header line)
$models = @()
for ($i = 1; $i -lt $list.Count; $i++) {
    $parts = ($list[$i] -split '\s+', 4) | Where-Object { $_ -ne '' }
    if ($parts.Count -ge 1) {
        $tag = 'latest'
        if ($parts[0] -match ':') { $tag = $parts[0].Split(':')[1] }
        $size = '?'
        if ($parts.Count -ge 3) { $size = $parts[2] }
        $modified = '?'
        if ($parts.Count -ge 4) { $modified = $parts[3] }

        $obj = New-Object PSObject -Property @{
            Name     = $parts[0]
            Tag      = $tag
            Size     = $size
            Modified = $modified
        }
        $models += $obj
    }
}

if ($models.Count -eq 0) {
    Write-Host "No models parsed from list output." -ForegroundColor Red
    pause
    exit 1
}

# --- Step 3: Pick model ---
if ($Model) {
    $chosen = $models | Where-Object { $_.Name -like "*$Model*" } | Select-Object -First 1
    if (-not $chosen) {
        Write-Host "Model matching '$Model' not found." -ForegroundColor Red
        pause
        exit 1
    }
} else {
    Write-Host ""
    Write-Host "Available models:" -ForegroundColor Green
    for ($i = 0; $i -lt $models.Count; $i++) {
        Write-Host "  [$($i+1)] $($models[$i].Name)  ($($models[$i].Size))"
    }
    Write-Host ""
    $choice = Read-Host "Pick a model (1-$($models.Count))"
    $parsed = [int]::TryParse($choice, [ref]$null)
    if (-not $parsed) { $idx = -1 } else { $idx = [int]$choice - 1 }
    if ($idx -lt 0 -or $idx -ge $models.Count) {
        Write-Host "Invalid choice." -ForegroundColor Red
        pause
        exit 1
    }
    $chosen = $models[$idx]
}

# --- Step 4: Run ---
Write-Host ""
Write-Host "Running $($chosen.Name)..." -ForegroundColor Cyan
Write-Host "Type /exit to quit, /models to switch" -ForegroundColor Gray
Write-Host ""

if ($NoChat) {
    Write-Host "Selected: $($chosen.Name)" -ForegroundColor Green
    pause
    exit 0
}

& $ollama run $chosen.Name
pause
