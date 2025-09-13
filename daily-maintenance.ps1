# SoroOne Daily Maintenance Script
# Run this script daily to maintain GitHub contributions

Write-Host "🎯 SoroOne Daily Maintenance" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""

$currentDate = Get-Date -Format "yyyy-MM-dd"
$currentDateTime = Get-Date -Format "dddd, MMMM dd, yyyy"

Write-Host "📅 Date: $currentDateTime" -ForegroundColor Green
Write-Host ""

try {
    # Run the Node.js maintenance script
    Write-Host "🔧 Running automated maintenance tasks..." -ForegroundColor Yellow
    node scripts/daily-maintenance.js
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Daily maintenance completed successfully!" -ForegroundColor Green
        Write-Host "🚀 Your GitHub contribution for $currentDate has been added!" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📊 Contribution Streak Tips:" -ForegroundColor Magenta
        Write-Host "• Run this script daily to maintain your streak" -ForegroundColor White
        Write-Host "• The script automatically updates badges and docs" -ForegroundColor White
        Write-Host "• Each commit is unique with timestamp-based changes" -ForegroundColor White
        Write-Host "• Check GitHub to see your updated contribution graph!" -ForegroundColor White
    } else {
        Write-Host "⚠️ Maintenance completed with some issues" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error running daily maintenance: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Manual fallback:" -ForegroundColor Yellow
    Write-Host "git add ." -ForegroundColor Gray
    Write-Host "git commit -m 'docs: Daily maintenance - update badges and formatting'" -ForegroundColor Gray
    Write-Host "git push origin main" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor DarkGray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")