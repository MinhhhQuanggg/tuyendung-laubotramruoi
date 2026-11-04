Add-Type -AssemblyName System.Drawing
$imgPath = (Resolve-Path "public/images/hero-banner.jpg").Path
$bmp = [System.Drawing.Bitmap]::FromFile($imgPath)

# Check vertical line along x=850 (center of badge) to find top and bottom outer border
Write-Output "Scanning Y along X=850:"
for ($y = 230; $y -lt 460; $y++) {
    $c = $bmp.GetPixel(850, $y)
    if ($c.R -gt 130 -and $c.R -gt ($c.G * 2)) {
        Write-Output "First red Y: $y"
        break
    }
}

for ($y = 450; $y -gt 240; $y--) {
    $c = $bmp.GetPixel(850, $y)
    if ($c.R -gt 130 -and $c.R -gt ($c.G * 2)) {
        Write-Output "Last red Y: $y"
        break
    }
}

# Check horizontal line along y=340 (center of badge) to find left and right outer border
Write-Output "Scanning X along Y=340:"
for ($x = 760; $x -lt 970; $x++) {
    $c = $bmp.GetPixel($x, 340)
    if ($c.R -gt 130 -and $c.R -gt ($c.G * 2)) {
        Write-Output "First red X: $x"
        break
    }
}

for ($x = 970; $x -gt 760; $x--) {
    $c = $bmp.GetPixel($x, 340)
    if ($c.R -gt 130 -and $c.R -gt ($c.G * 2)) {
        Write-Output "Last red X: $x"
        break
    }
}

$bmp.Dispose()
