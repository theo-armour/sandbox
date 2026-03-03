# MCP Server Troubleshooting Guide

Fixes for common MCP (Model Context Protocol) server errors in Claude Desktop on Windows.

## Error 1: Filesystem MCP — "Server disconnected"

**Symptoms**: Server disconnected, Could not attach to MCP server

**Server config**:
- Command: `node`
- Arguments: `C:\Users\tarmo\AppData\Roaming\Claude\Claude Extensions\ant.dir.ant.anthropic.filesystem/server/index.js` plus Google Drive paths

### Likely Causes & Fixes

#### A. Node.js not installed or not in PATH

1. Open PowerShell and run:
   ```powershell
   node --version
   ```
2. If not found, install Node.js LTS from https://nodejs.org
3. After installing, restart Claude Desktop (it needs the updated PATH)

#### B. Google Drive paths with spaces

The paths `G:\My Drive\2026-theo-github\...` contain spaces. Verify the Claude Desktop config wraps these correctly.

Open `%APPDATA%\Claude\claude_desktop_config.json` and check the filesystem server entry:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "node",
      "args": [
        "C:\\Users\\tarmo\\AppData\\Roaming\\Claude\\Claude Extensions\\ant.dir.ant.anthropic.filesystem\\server\\index.js",
        "G:\\My Drive\\2026-theo-github\\theo-armour-agenda",
        "G:\\My Drive\\2026-theo-github\\theo-armour-pages",
        "G:\\My Drive\\2026-theo-github\\theo-armour-sandbox"
      ]
    }
  }
}
```

Each path must be a **separate string** in the `args` array, not concatenated.

#### C. Google Drive not running / paths not accessible

1. Make sure Google Drive for Desktop is running and synced
2. Test the paths exist:
   ```powershell
   Test-Path "G:\My Drive\2026-theo-github\theo-armour-sandbox"
   ```
3. If Google Drive assigns a different drive letter, update the config

#### D. Server module missing or corrupted

Verify the filesystem server exists:
```powershell
Test-Path "C:\Users\tarmo\AppData\Roaming\Claude\Claude Extensions\ant.dir.ant.anthropic.filesystem\server\index.js"
```

If missing, try:
1. In Claude Desktop, remove the Filesystem MCP server
2. Re-add it from the MCP servers list
3. Restart Claude Desktop

---

## Error 2: Windows-MCP — "spawn uv ENOENT"

**Symptoms**: `spawn uv ENOENT`, Server disconnected

**Cause**: The `uv` command (Astral's Python package manager) is not installed or not in PATH.

### Fix

#### Option A: Install uv (recommended)

```powershell
# Using PowerShell
irm https://astral.sh/uv/install.ps1 | iex
```

Or with pip:
```powershell
pip install uv
```

After installing, **restart Claude Desktop** so it picks up the new PATH.

#### Option B: Install via WinGet

```powershell
winget install astral-sh.uv
```

#### Option C: Verify PATH

If `uv` is already installed but not found:

1. Find where it's installed:
   ```powershell
   where.exe uv
   ```
2. If it's not in PATH, add its directory to the system PATH:
   - Settings > System > About > Advanced system settings > Environment Variables
   - Add the uv directory to the `Path` variable
3. Restart Claude Desktop

---

## General MCP Debugging Steps

1. **Restart Claude Desktop** — always try this first after any config change
2. **Check logs**: `%APPDATA%\Claude\logs\` for detailed error output
3. **Test commands manually** — run the MCP server commands in PowerShell to see errors:
   ```powershell
   # Test filesystem server
   node "C:\Users\tarmo\AppData\Roaming\Claude\Claude Extensions\ant.dir.ant.anthropic.filesystem\server\index.js"

   # Test if uv works
   uv --version
   ```
4. **Config file location**: `%APPDATA%\Claude\claude_desktop_config.json`
5. **Windows Defender / antivirus** can sometimes block spawning child processes — check if either is blocking `node` or `uv`

---

## Quick Checklist

- [ ] Node.js installed and `node --version` works in PowerShell
- [ ] `uv` installed and `uv --version` works in PowerShell
- [ ] Google Drive running and paths accessible
- [ ] `claude_desktop_config.json` has correctly formatted JSON with paths as separate args
- [ ] Claude Desktop restarted after any changes

---

**Last Updated**: 2026-03-03
