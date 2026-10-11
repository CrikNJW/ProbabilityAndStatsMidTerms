param([switch]$Inspect)
$ErrorActionPreference = 'Stop'
$repoName = 'CrikNJW/ProbabilityAndStatsMidTerms'
$credentialLines = "protocol=https`nhost=github.com`n`n" | git credential fill 2>$null
if ($LASTEXITCODE -ne 0) { throw 'GitHub authentication is unavailable in the Git credential helper.' }
$credentialValues = @{}
foreach ($line in $credentialLines) {
    if ($line -match '^([^=]+)=(.*)$') { $credentialValues[$matches[1]] = $matches[2] }
}
if (-not $credentialValues['password']) { throw 'The Git credential helper returned no GitHub credential.' }
$headers = @{ Authorization = "Bearer $($credentialValues['password'])"; Accept = 'application/vnd.github+json'; 'X-GitHub-Api-Version' = '2022-11-28' }
$apiUri = "https://api.github.com/repos/$repoName/pages"
$existing = $null
try { $existing = Invoke-RestMethod -Uri $apiUri -Headers $headers }
catch {
    if ([int]$_.Exception.Response.StatusCode -ne 404) { throw "GitHub Pages API access failed (HTTP $([int]$_.Exception.Response.StatusCode))." }
}
if ($Inspect) {
    @{ configured = [bool]$existing; status = $existing.status; url = $existing.html_url; buildType = $existing.build_type; branch = $existing.source.branch } | ConvertTo-Json -Compress
    exit 0
}
$body = @{ build_type = 'legacy'; source = @{ branch = 'main'; path = '/' } } | ConvertTo-Json -Compress
if ($existing) {
    $result = Invoke-RestMethod -Method Put -Uri $apiUri -Headers $headers -ContentType 'application/json' -Body $body
} else {
    $result = Invoke-RestMethod -Method Post -Uri $apiUri -Headers $headers -ContentType 'application/json' -Body $body
}
@{ configured = $true; status = $result.status; url = $result.html_url; branch = 'main'; folder = '/' } | ConvertTo-Json -Compress
