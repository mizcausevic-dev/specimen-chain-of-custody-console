$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$screenshots = Join-Path $root "screenshots"
New-Item -ItemType Directory -Force -Path $screenshots | Out-Null

Add-Type -AssemblyName System.Drawing

function New-ProofImage {
    param(
        [string]$Path,
        [string]$Title,
        [string]$Subtitle,
        [string[]]$Bullets
    )

    $bitmap = New-Object System.Drawing.Bitmap 1600, 1000
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.Clear([System.Drawing.Color]::FromArgb(7, 10, 15))

    $panelBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(11, 18, 32))
    $accentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(55, 255, 139))
    $altAccentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(25, 199, 255))
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(233, 243, 255))
    $mutedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(171, 186, 201))
    $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(42, 111, 88), 2)

    $graphics.FillRectangle($panelBrush, 48, 48, 1504, 904)
    $graphics.DrawRectangle($borderPen, 48, 48, 1504, 904)

    $eyebrowFont = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
    $titleFont = New-Object System.Drawing.Font("Georgia", 34, [System.Drawing.FontStyle]::Bold)
    $bodyFont = New-Object System.Drawing.Font("Segoe UI", 18)
    $graphics.DrawString("Specimen Chain Of Custody Console", $eyebrowFont, $accentBrush, 92, 92)
    $graphics.DrawString($Title, $titleFont, $textBrush, 92, 142)
    $graphics.DrawString($Subtitle, $bodyFont, $mutedBrush, 92, 214)

    $y = 320
    foreach ($bullet in $Bullets) {
        $graphics.FillEllipse($altAccentBrush, 114, $y + 12, 10, 10)
        $graphics.DrawString($bullet, $bodyFont, $textBrush, 138, $y + 2)
        $y += 82
    }

    $graphics.DrawString("Synthetic proof render for README packaging.", $bodyFont, $mutedBrush, 92, 880)
    $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
}

New-ProofImage -Path (Join-Path $screenshots "01-overview-proof-v2.png") `
    -Title "Overview proof" `
    -Subtitle "Labeling integrity, cold-chain posture, handoff signoff, and release blockers in one specimen-custody operator surface." `
    -Bullets @(
        "Barcode integrity and courier handoff drift surface before release posture breaks.",
        "Temperature excursions, storage mismatches, and consent gaps stay visible together.",
        "Every lane stays tied to an operator-safe custody packet."
    )

New-ProofImage -Path (Join-Path $screenshots "02-custody-lane-proof-v2.png") `
    -Title "Custody lane" `
    -Subtitle "Each custody lane keeps owner, focus, status, and next action visible." `
    -Bullets @(
        "Accession, courier, storage, and consent lanes stay separated cleanly.",
        "Status remains readable at a glance.",
        "Next actions stay operator-safe and audit-readable."
    )

New-ProofImage -Path (Join-Path $screenshots "03-transfer-gaps-proof-v2.png") `
    -Title "Transfer gaps" `
    -Subtitle "Findings map severity, owner, control family, specimen path, and the exact custody break." `
    -Bullets @(
        "High-severity custody findings surface first.",
        "Operators can tie risk back to transfer path and control family quickly.",
        "The lane is grounded in real specimen-operations primitives."
    )

New-ProofImage -Path (Join-Path $screenshots "04-release-posture-proof-v2.png") `
    -Title "Release posture" `
    -Subtitle "Packets tie completeness, blocker, owner, and release timing together." `
    -Bullets @(
        "Accession, handoff, storage, and consent packets stay visible.",
        "Red and yellow posture remains easy to scan.",
        "The system is shaped for real biotech and diagnostics proof."
    )
