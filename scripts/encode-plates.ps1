Add-Type -AssemblyName System.Drawing

$root = "C:\Users\Aworeni Oluwadolabom\Documents\Qoder\2026-10-23\2d8c933c"
$jobs = @(
  @{ in = "plate-hero_1793635208816_0995411f.png";    out = "plate-hero.jpg";    width = 1600; quality = 70 },
  @{ in = "plate-aurora_1793635323604_0b3ce06b.png";  out = "plate-aurora.jpg";  width = 1600; quality = 62 },
  @{ in = "plate-network_1793635232173_04e89c56.png"; out = "plate-network.jpg"; width = 1000; quality = 72 },
  @{ in = "plate-layers_1793635248021_ea329b7c.png";  out = "plate-layers.jpg";  width = 1000; quality = 72 },
  @{ in = "plate-flow_1793635280071_4542acd7.png";    out = "plate-flow.jpg";    width = 1000; quality = 72 },
  @{ in = "plate-traces_1793635299971_b7849622.png";  out = "plate-traces.jpg";  width = 1000; quality = 72 }
)

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq "image/jpeg" } |
  Select-Object -First 1
if (-not $codec) { throw "no jpeg encoder registered" }
$params = New-Object System.Drawing.Imaging.EncoderParameters(1)

foreach ($j in $jobs) {
  $src = Join-Path $root "vibe_images\$($j.in)"
  $dst = Join-Path $root "public\img\$($j.out)"
  $img = [System.Drawing.Image]::FromFile($src)
  $h = [int][Math]::Round($img.Height * ($j.width / $img.Width))
  $bmp = New-Object System.Drawing.Bitmap($j.width, $h, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  # JPEG has no alpha; the generated plates are already on white, so flatten onto white.
  $g.Clear([System.Drawing.Color]::White)
  $g.DrawImage($img, 0, 0, $j.width, $h)
  $g.Dispose()
  $img.Dispose()
  $q = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$j.quality)
  $params.Param[0] = $q
  $bmp.Save($dst, $codec, $params)
  $bmp.Dispose()
  $kb = [math]::Round((Get-Item $dst).Length / 1KB)
  Write-Output "$($j.out) $($j.width)x$h ${kb}KB"
}
