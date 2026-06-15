# Phaser Games App - Android Build Script (Windows PowerShell)
# Builds an Android APK for direct installation, or an APK/AAB for release.

param(
    [switch]$Release = $false,
    [switch]$Clean = $false
)

Write-Host "Phaser Games App - Android Build Script" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

function Write-Step {
    param([string]$Step, [string]$Message)
    Write-Host "[$Step] " -NoNewline -ForegroundColor Blue
    Write-Host $Message
}

function Write-Success {
    param([string]$Message)
    Write-Host "OK " -NoNewline -ForegroundColor Green
    Write-Host $Message
}

function Stop-Build {
    param([string]$Message)
    Write-Host "ERROR " -NoNewline -ForegroundColor Red
    Write-Host $Message
    exit 1
}

Write-Step "1/6" "Checking prerequisites..."

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Stop-Build "Node.js is not installed"
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Stop-Build "npm is not installed"
}

Write-Success "Prerequisites checked"
Write-Host ""

if ($Clean) {
    Write-Step "2/6" "Cleaning build files..."
    Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "android\app\build" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Success "Cleaned build files"
    Write-Host ""
    $step = 3
} else {
    $step = 2
}

Write-Step "$step/6" "Installing dependencies..."
npm install
if ($LASTEXITCODE -ne 0) {
    Stop-Build "Failed to install dependencies"
}
Write-Success "Dependencies installed"
Write-Host ""
$step++

Write-Step "$step/6" "Building web assets..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Stop-Build "Failed to build web assets"
}
Write-Success "Web assets built"
Write-Host ""
$step++

Write-Step "$step/6" "Syncing web assets to Android..."
npx cap sync android
if ($LASTEXITCODE -ne 0) {
    Stop-Build "Failed to sync Android project"
}
Write-Success "Android project synced"
Write-Host ""
$step++

if ($Release) {
    Write-Step "$step/6" "Building release APK and AAB..."
    Push-Location android
    .\gradlew.bat assembleRelease bundleRelease
    $gradleExitCode = $LASTEXITCODE
    Pop-Location
} else {
    Write-Step "$step/6" "Building debug APK..."
    Push-Location android
    .\gradlew.bat assembleDebug
    $gradleExitCode = $LASTEXITCODE
    Pop-Location
}

if ($gradleExitCode -ne 0) {
    Stop-Build "Failed to build Android package"
}

Write-Success "Build completed"
Write-Host ""
Write-Host "Build Complete!" -ForegroundColor Green
Write-Host ""

if ($Release) {
    $apk = Get-Item -Path "android\app\build\outputs\apk\release\*.apk" -ErrorAction SilentlyContinue | Select-Object -First 1
    $aab = Get-Item -Path "android\app\build\outputs\bundle\release\*.aab" -ErrorAction SilentlyContinue | Select-Object -First 1

    Write-Host "Release builds:"
    if ($apk) {
        Write-Host "   APK: $($apk.FullName)"
    }
    if ($aab) {
        Write-Host "   AAB: $($aab.FullName)"
    }
} else {
    $apk = Get-Item -Path "android\app\build\outputs\apk\debug\app-debug.apk" -ErrorAction SilentlyContinue

    if ($apk) {
        Write-Host "Debug APK:"
        Write-Host "   $($apk.FullName)"
        Write-Host ""
        Write-Host "To install on a connected Android device:"
        Write-Host "   adb install -r `"$($apk.FullName)`""
    } else {
        Write-Host "APK not found at expected location" -ForegroundColor Yellow
        Write-Host "   Check Android SDK and JDK installation"
    }
}

Write-Host ""
Write-Host "Need a clean rebuild?"
Write-Host "   .\build-sdk.ps1 -Clean"
Write-Host ""
