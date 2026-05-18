[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$client = New-Object System.Net.WebClient
$zip = "tools\jdk21.zip"
Write-Host "Downloading JDK 21..."
$client.DownloadFile("https://download.java.net/java/GA/jdk21.0.2/f2283984656d49d69e91c558476027ac/13/GPL/openjdk-21.0.2_windows-x64_bin.zip", $zip)
Write-Host "Extracting..."
Expand-Archive -Path $zip -DestinationPath "tools" -Force
Remove-Item $zip
Write-Host "Done!"
