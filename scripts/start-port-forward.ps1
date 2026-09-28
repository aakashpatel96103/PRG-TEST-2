$LocalPort = 8001
$TargetPort = 8000
$Namespace = "employee-system"

$existing = Get-NetTCPConnection -LocalPort $LocalPort -State Listen -ErrorAction SilentlyContinue
if ($existing) {
    Write-Host "Port 8001 is already in use. Keeping the existing listener."
    Write-Host "Swagger: http://localhost:8001/docs"
    exit 0
}

$logOut = Join-Path $PWD "jenkins-port-forward.log"
$logErr = Join-Path $PWD "jenkins-port-forward-error.log"

$env:JENKINS_NODE_COOKIE = "dontKillMe"

Start-Process -FilePath "kubectl.exe" `
    -ArgumentList "port-forward","service/employee-backend","8001:8000","-n",$Namespace `
    -WindowStyle Hidden `
    -RedirectStandardOutput $logOut `
    -RedirectStandardError $logErr

Start-Sleep -Seconds 3

$check = Get-NetTCPConnection -LocalPort 8001 -State Listen -ErrorAction SilentlyContinue
if (-not $check) {
    Write-Host "kubectl port-forward did not start."
    if (Test-Path $logErr) { Get-Content $logErr }
    exit 1
}

Write-Host "Swagger UI: http://localhost:8001/docs"
Write-Host "Swagger alias: http://localhost:8001/doc"
