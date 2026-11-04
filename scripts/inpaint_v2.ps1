Add-Type -AssemblyName System.Drawing
$imgPath = (Resolve-Path "public/images/hero-banner.jpg").Path
$bmp = [System.Drawing.Bitmap]::FromFile($imgPath)
$g = [System.Drawing.Graphics]::FromImage($bmp)

# Clone from the left area (diners & restaurant entrance)
# Left source: x=580..770, y=240..438
$srcRect = New-Object System.Drawing.Rectangle(580, 240, 190, 198)
$destRect = New-Object System.Drawing.Rectangle(774, 240, 190, 198)

# Create a cloned bitmap
$patch = $bmp.Clone($srcRect, $bmp.PixelFormat)

# Draw patch with feathering at borders
$ia = New-Object System.Drawing.Imaging.ImageAttributes
$cm = New-Object System.Drawing.Imaging.ColorMatrix
# normal matrix
$ia.SetColorMatrix($cm)

$g.DrawImage($patch, $destRect, 0, 0, 190, 198, [System.Drawing.GraphicsUnit]::Pixel, $ia)

# Smooth the borders of destRect
for ($step = 0; $step -lt 15; $step++) {
    $alpha = $step / 15.0
    for ($y = 230; $y -lt 448; $y++) {
        # left border blend
        $xL = 774 + $step
        $cSrc = $bmp.GetPixel(774 - 15 + $step, $y)
        $cDst = $bmp.GetPixel($xL, $y)
        $r = [int]($cSrc.R * (1 - $alpha) + $cDst.R * $alpha)
        $gCol = [int]($cSrc.G * (1 - $alpha) + $cDst.G * $alpha)
        $b = [int]($cSrc.B * (1 - $alpha) + $cDst.B * $alpha)
        $bmp.SetPixel($xL, $y, [System.Drawing.Color]::FromArgb($r, $gCol, $b))
    }
}

$outPath = (Resolve-Path "public/images").Path + "\hero-banner-clean.jpg"
$bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$patch.Dispose()
$bmp.Dispose()
$g.Dispose()
Write-Output "Saved hero-banner-clean.jpg v2"
