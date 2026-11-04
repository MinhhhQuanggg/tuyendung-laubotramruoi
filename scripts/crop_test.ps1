Add-Type -AssemblyName System.Drawing
$imgPath = Resolve-Path "public/images/hero-banner.jpg"
$bmp = [System.Drawing.Bitmap]::FromFile($imgPath)

# Let's crop candidate regions
$rect = New-Object System.Drawing.Rectangle(770, 240, 200, 200)
$cropped = $bmp.Clone($rect, $bmp.PixelFormat)
$outPath = (Resolve-Path "public/images").Path + "\test-logo-crop.png"
$cropped.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$cropped.Dispose()
$bmp.Dispose()
Write-Output "Saved test-logo-crop.png"
