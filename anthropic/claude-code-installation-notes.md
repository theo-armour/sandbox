# Claude Code Installation Notes

## Does Claude Code Require Node.js?

**No.** The recommended installation uses a native standalone binary with no Node.js dependency.

## Recommended Installation (Native Binary)

| Platform | Command |
|----------|---------|
| macOS / Linux / WSL | `curl -fsSL https://claude.ai/install.sh \| bash` |
| Windows PowerShell | `irm https://claude.ai/install.ps1 \| iex` |
| Homebrew | `brew install --cask claude-code` |
| WinGet | `winget install Anthropic.ClaudeCode` |

The native binary auto-updates in the background.

## System Requirements

- **OS**: macOS 13+, Windows 10 1809+, Ubuntu 20.04+, Debian 10+, Alpine 3.19+
- **RAM**: 4 GB+
- **Network**: Internet connection required
- **Shell**: Bash, Zsh, PowerShell, or CMD

## Deprecated: npm Installation

There is an npm method (`npm install -g @anthropic-ai/claude-code`) requiring **Node.js 18+**, but it is deprecated. Use the native installer instead.

---

**Last Updated**: 2026-03-03
