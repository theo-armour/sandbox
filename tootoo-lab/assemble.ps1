# TooToo Lab — assembler.
# Stitches src/index.template.html + components + css + js into a single
# tootoo-lab/index.html. No build tools: just text substitution.
#
#   <!-- @include components/x.html -->  -> the file's @part:...:start/end fragment
#   /* @include path */                  -> the whole file's contents
#
# Run:  pwsh -File assemble.ps1   (or: & .\assemble.ps1)

$src = Join-Path $PSScriptRoot 'src'
$out = Join-Path $PSScriptRoot 'index.html'

$template = Get-Content (Join-Path $src 'index.template.html') -Raw

# 1. Component HTML includes -> extract the single @part fragment.
$template = [regex]::Replace($template, '<!--\s*@include\s+(components/[^\s]+\.html)\s*-->', {
  param($m)
  $file = Join-Path $src $m.Groups[1].Value
  $content = Get-Content $file -Raw
  $frag = [regex]::Match($content, '(?s)<!--\s*@part:[\w:]+:start\s*-->(.*?)<!--\s*@part:[\w:]+:end\s*-->')
  if ($frag.Success) { $frag.Groups[1].Value.Trim() }
  else { "<!-- assemble: no @part in $($m.Groups[1].Value) -->" }
})

# 2. CSS / JS includes -> whole file contents.
$template = [regex]::Replace($template, '/\*\s*@include\s+([^\s\*]+)\s*\*/', {
  param($m)
  $file = Join-Path $src $m.Groups[1].Value
  if (Test-Path $file) { (Get-Content $file -Raw).TrimEnd() }
  else { "/* assemble: missing $($m.Groups[1].Value) */" }
})

Set-Content -Path $out -Value $template -Encoding UTF8
# Report the content length (Get-Item right after Set-Content can read a stale
# pre-flush cluster size, e.g. 4096, and look truncated when it isn't).
"assembled -> $out  ({0:N0} chars)" -f $template.Length
