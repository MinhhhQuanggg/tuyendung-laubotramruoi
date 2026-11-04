Add-Type -AssemblyName System.Drawing
$imgPath = Resolve-Path "public/images/hero-banner.jpg"
$bmp = [System.Drawing.Bitmap]::FromFile($imgPath)

$minX = 1024
$maxX = 0
$minY = 687
$maxY = 0

for ($y = 200; $y -lt 550; $y++) {
    for ($x = 700; $x -lt 1000; $x++) {
        $c = $bmp.GetPixel($x, $y)
        # Red background of the badge: R > 120 and R > G * 2 and R > B * 2
        if ($c.R -gt 110 -and $c.R -gt ($c.G * 2) -and $c.R -gt ($c.B * 2)) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}
$bmp.Dispose()
Write-Output "Detected: X=$minX Y=$minY Width=$($maxX - $minX) Height=$($maxY - $minY)"
