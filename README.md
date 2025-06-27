# Quick Pick Markdown Snippets for VSCode

A VSCode extension to quickly insert common markdown snippets using / commands, similar to Notion. Supports one-click packaging to .vsix for easy installation.

## Features

- [x] Insert markdown table
- [x] Insert code block
- [x] Insert TODO list
- [x] Insert ordered list
- [x] Insert unordered list
- [x] Insert calendar placeholder
- [x] Insert header (h1 - h5)
- [x] Insert image
- [x] Insert link
- [x] Insert highlight block
- [x] Insert file link
- [x] Insert subfield
- [x] Slash (/) command completion in markdown files

## Usage

1. Open a markdown file in VSCode.
2. Type `/` anywhere in the file, and the QuickPick menu will automatically pop up, allowing you to select and insert a markdown snippet.
   - **Note:** With this feature enabled, you cannot directly input the `/` character in markdown files, as it will always trigger the menu.
3. Alternatively, you can press `Ctrl+Alt+K` (when focused in a markdown editor) to manually open the QuickPick menu at any time.
4. You can also use the Command Palette (Ctrl+Shift+P) and search for commands like `QuickPick: Insert Markdown Table`, `QuickPick: Insert Code Block`, etc.

## One-Click Packaging

To build and package the extension as a .vsix file:

```bash
bash scripts/build.sh
```

The generated `.vsix` file can be installed directly in VSCode.

## Project Structure

```
quick-pick/
├── .vscode/           # VSCode configuration
├── src/               # Source code directory
│   └── extension.ts   # Main entry point
├── package.json       # Extension description and dependencies
├── tsconfig.json      # TypeScript configuration
├── README.md          # Project documentation
├── scripts/
│   └── build.sh       # One-click packaging script
└── .gitignore
```