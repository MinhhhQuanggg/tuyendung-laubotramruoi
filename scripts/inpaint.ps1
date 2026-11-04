Add-Type -AssemblyName System.Drawing
$imgPath = (Resolve-Path "public/images/hero-banner.jpg").Path
$bmp = [System.Drawing.Bitmap]::FromFile($imgPath)

# Inpainting: interpolate from borders of the box (774, 240, 190, 198)
$g = [System.Drawing.Graphics]::FromImage($bmp)

# Sample the area to the left (x=600..770, y=240..438) and right (x=965..1020)
# A simple smooth patch or texture clone
for ($y = 240; $y -le 438; $y++) {
    for ($x = 774; $x -le 964; $x++) {
        $u = ($x - 774) / (964 - 774)
        $v = ($y - 240) / (438 - 240)
        
        # sample border pixels
        $cL = $bmp.GetPixel(772, $y)
        $cR = $bmp.GetPixel(966, $y)
        $cT = $bmp.GetPixel($x, 238)
        $cB = $bmp.GetPixel($x, 440)
        
        $r = [int]($cL.R * (1 - $u) * 0.5 + $cR.R * $u * 0.5 + $cT.R * (1 - $v) * 0.5 + $cB.R * $v * 0.5)
        $gCol = [int]($cL.G * (1 - $u) * 0.5 + $cR.G * $u * 0.5 + $cT.G * (1 - $v) * 0.5 + $cB.G * $v * 0.5)
        $b = [int]($cL.B * (1 - $u) * 0.5 + $cR.B * $u * 0.5 + $cT.B * (1 - $v) * 0.5 + $cB.B * $v * 0.5)
        
        $r = [Math]::Min(255, [Math]::Max(0, $r))
        $gCol = [Math]::Min(255, [Math]::Max(0, $gCol))
        $b = [Math]::Min(255, [Math]::Max(0, $b))
        
        $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($r, $gCol, $b))
    }
}

$outPath = (Resolve-Path "public/images").Path + "\hero-banner-clean.jpg"
$bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$bmp.Dispose()
$g.Dispose()
Write-Output "Saved hero-banner-clean.jpg"
