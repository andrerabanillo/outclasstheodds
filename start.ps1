# Start script for Outclass The Odds
# - Activates the project's venv if present
# - Loads variables from .env (if present)
# - Starts uvicorn and watches only the `app` directory to avoid reloading site-packages

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

if (Test-Path .\.venv\Scripts\Activate.ps1) {
    Write-Host "Activating venv .venv..."
    . .\.venv\Scripts\Activate.ps1
} else {
    Write-Host "Warning: .venv activation script not found. Ensure venv exists or activate manually." -ForegroundColor Yellow
}

# Load .env if present (simple parser, ignores blank lines and comments starting with #)
if (Test-Path .env) {
    Write-Host "Loading .env file..."
    Get-Content .env | ForEach-Object {
        if ($_ -and ($_ -notmatch '^[\s#]')) {
            $pair = $_ -split '=', 2
            if ($pair.Count -eq 2) {
                $name = $pair[0].Trim()
                $value = $pair[1].Trim().Trim("'\"")
                # Use Set-Item to assign environment variable dynamically
                Set-Item -Path "Env:$name" -Value $value
            }
        }
    }
}

# Start uvicorn but watch only the app directory to avoid watching site-packages
Write-Host "Starting server (uvicorn) watching 'app'..."
python -m uvicorn main:app --reload --reload-dir app
