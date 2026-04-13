param(
  [Parameter(Mandatory = $true)]
  [string]$Title,

  [string]$Slug = "",

  [string]$Date = (Get-Date -Format "yyyy-MM-dd")
)

function New-SafeSlug {
  param([string]$Value)

  $slug = $Value.ToLowerInvariant()
  $slug = $slug -replace "[^a-z0-9]+", "-"
  $slug = $slug.Trim("-")

  if ([string]::IsNullOrWhiteSpace($slug)) {
    $slug = "post"
  }

  return $slug
}

$repoRoot = Split-Path -Parent $PSScriptRoot
$postsDir = Join-Path $repoRoot "posts"
$manifestPath = Join-Path $postsDir "manifest.json"

if ([string]::IsNullOrWhiteSpace($Slug)) {
  $Slug = New-SafeSlug -Value $Title
}

$displayDate = $Date -replace "-", "."
$fileName = "$Date-$Slug.md"
$filePath = Join-Path $postsDir $fileName

if (Test-Path $filePath) {
  throw "Post already exists: $filePath"
}

$template = @"
# $Title

这里写开头。

## 我做了什么

写你的过程。

## 为什么这么做

写你的判断。

## 下一步

写你后面准备做什么。
"@

Set-Content -LiteralPath $filePath -Value $template -Encoding UTF8

$manifest = @()
if (Test-Path $manifestPath) {
  $manifest = Get-Content -Raw -Encoding UTF8 $manifestPath | ConvertFrom-Json
}

$newEntry = [PSCustomObject]@{
  slug = "$Date-$Slug"
  title = $Title
  date = $displayDate
  summary = "请把这段摘要改成你的文章简介。"
  tags = @("New", "Draft")
  file = "posts/$fileName"
}

$updatedManifest = @($newEntry) + @($manifest)
$updatedManifest | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $manifestPath -Encoding UTF8

Write-Output "Created $fileName"
Write-Output "Update the summary/tags in posts/manifest.json, then run git add . ; git commit ; git push"
