Add-Type -AssemblyName System.Drawing
$imgPath = (Resolve-Path "public/images/hero-banner.jpg").Path
$bmp = [System.Drawing.Bitmap]::FromFile($imgPath)

# Pixel-perfect crop of the red recruitment badge
# X=774, Y=240, W=190, H=198
$rect = New-Object System.Drawing.Rectangle(774, 240, 190, 198)
$cropped = $bmp.Clone($rect, $bmp.PixelFormat)

$outLogo = (Resolve-Path "public/images").Path + "\logo-tuyendung.png"
$cropped.Save($outLogo, [System.Drawing.Imaging.ImageFormat]::Png)
$cropped.Dispose()
$bmp.Dispose()
Write-Output "Successfully saved logo-tuyendung.png"
