param(
  [Parameter(Mandatory = $true)]
  [string]$Title,

  [string]$Slug = "",

  [string]$Date = (Get-Date -Format "yyyy-MM-dd"),

  [string]$Category = "Growth",

  [string]$Tags = "Log",

  [string]$Summary = ""
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

function Get-TagArray {
  param([string]$Value)

  return @(
    $Value -split "," |
      ForEach-Object { $_.Trim() } |
      Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
  )
}

$repoRoot = Split-Path -Parent $PSScriptRoot
$postsDir = Join-Path $repoRoot "posts"
$manifestPath = Join-Path $postsDir "manifest.json"

New-Item -ItemType Directory -Force -Path $postsDir | Out-Null

if ([string]::IsNullOrWhiteSpace($Slug)) {
  $Slug = New-SafeSlug -Value $Title
}

$displayDate = $Date -replace "-", "."
$fileName = "$Date-$Slug.md"
$filePath = Join-Path $postsDir $fileName
$manifestSlug = "$Date-$Slug"

if (Test-Path -LiteralPath $filePath) {
  throw "Post already exists: $filePath"
}

if ([string]::IsNullOrWhiteSpace($Summary)) {
  $Summary = "Draft note for $Title."
}

$tagArray = Get-TagArray -Value $Tags
if ($tagArray.Count -eq 0) {
  $tagArray = @("Log")
}

$template = @"
# $Title

## What I did

Write the concrete work here.

## What I learned

Write the lesson, bug, paper note, or project reflection here.

## Next step

Write the next action here.
"@

Set-Content -LiteralPath $filePath -Value $template -Encoding UTF8

$manifest = @()
if (Test-Path -LiteralPath $manifestPath) {
  $rawManifest = Get-Content -Raw -Encoding UTF8 -LiteralPath $manifestPath
  if (-not [string]::IsNullOrWhiteSpace($rawManifest)) {
    $parsed = $rawManifest | ConvertFrom-Json
    if ($parsed) {
      $manifest = @($parsed)
    }
  }
}

$newEntry = [PSCustomObject]@{
  slug = $manifestSlug
  title = $Title
  date = $displayDate
  category = $Category
  summary = $Summary
  tags = $tagArray
  readingTime = "1 minute read"
  file = "posts/$fileName"
}

$updatedManifest = @($newEntry) + @($manifest)
$updatedManifest |
  ConvertTo-Json -Depth 6 |
  Set-Content -LiteralPath $manifestPath -Encoding UTF8

Write-Output "Created: posts/$fileName"
Write-Output "Updated: posts/manifest.json"
Write-Output "Preview locally: python -m http.server 8000 --bind 127.0.0.1"
Write-Output "Publish: git add posts/manifest.json posts/$fileName ; git commit -m `"publish $Slug`" ; git push"
