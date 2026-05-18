$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$toolsDir = Join-Path $PWD "tools"
if (-not (Test-Path $toolsDir)) { New-Item -ItemType Directory -Path $toolsDir | Out-Null }

$client = New-Object System.Net.WebClient

Write-Host "1. Locating or Downloading OpenJDK 17..."
$extractedJdk = Get-ChildItem -Path $toolsDir -Directory | Where-Object { $_.Name -like "*jdk*" } | Select-Object -First 1

if ($null -eq $extractedJdk) {
    $jdkZip = Join-Path $toolsDir "jdk.zip"
    Write-Host "Starting high-speed download with TLS 1.2..."
    $client.DownloadFile("https://download.java.net/java/GA/jdk17.0.2/dfd4a8d0985749f896bed50d7138ee7f/8/GPL/openjdk-17.0.2_windows-x64_bin.zip", $jdkZip)
    Write-Host "Extracting JDK..."
    Expand-Archive -Path $jdkZip -DestinationPath $toolsDir -Force
    $extractedJdk = Get-ChildItem -Path $toolsDir -Directory | Where-Object { $_.Name -like "*jdk*" } | Select-Object -First 1
    Remove-Item -Force $jdkZip -ErrorAction SilentlyContinue
}

$jdkDir = $extractedJdk.FullName
$env:JAVA_HOME = $jdkDir
$env:PATH = "$jdkDir\bin;" + $env:PATH
java -version

Write-Host "2. Downloading Android Command Line Tools..."
$androidSdkDir = Join-Path $toolsDir "android-sdk"
$cmdlineToolsZip = Join-Path $toolsDir "cmdline-tools.zip"
$cmdlineToolsDir = Join-Path $androidSdkDir "cmdline-tools\latest"

if (-not (Test-Path $cmdlineToolsDir)) {
    if (Test-Path $androidSdkDir) { Remove-Item -Force -Recurse $androidSdkDir -ErrorAction SilentlyContinue }
    New-Item -ItemType Directory -Path (Join-Path $androidSdkDir "cmdline-tools") -Force | Out-Null

    Write-Host "Starting high-speed download for Android Tools..."
    $client.DownloadFile("https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip", $cmdlineToolsZip)
    Write-Host "Extracting Android CMD Line Tools..."
    Expand-Archive -Path $cmdlineToolsZip -DestinationPath (Join-Path $androidSdkDir "cmdline-tools") -Force
    
    # The zip extracts to a folder named "cmdline-tools". So we have android-sdk/cmdline-tools/cmdline-tools.
    $extractedFolder = Join-Path $androidSdkDir "cmdline-tools\cmdline-tools"
    # Wait a second to release file locks
    Start-Sleep -Seconds 2
    Rename-Item -Path $extractedFolder -NewName "latest"
    Remove-Item -Force $cmdlineToolsZip -ErrorAction SilentlyContinue
}
$env:ANDROID_HOME = $androidSdkDir

Write-Host "3. Accepting Android Licenses and Installing Platforms..."
$sdkmanager = Join-Path $cmdlineToolsDir "sdkmanager.bat"
if (-not (Test-Path $sdkmanager)) {
    $sdkmanager = Join-Path $cmdlineToolsDir "bin\sdkmanager.bat"
}
cmd /c "echo y| $sdkmanager --licenses"
cmd /c "$sdkmanager `"platform-tools`" `"platforms;android-34`" `"build-tools;34.0.0`""

Write-Host "4. Building Android APK via Gradle..."
Set-Location "android"
cmd /c "gradlew.bat assembleDebug"
Set-Location ".."

Write-Host "5. Copying APK to project root..."
$apkPath = "android\app\build\outputs\apk\debug\app-debug.apk"
if (Test-Path $apkPath) {
    Copy-Item $apkPath -Destination "JanAushadhi-Finder.apk" -Force
    Write-Host "SUCCESS: APK is available at JanAushadhi-Finder.apk"
} else {
    Write-Host "ERROR: APK build failed."
}
