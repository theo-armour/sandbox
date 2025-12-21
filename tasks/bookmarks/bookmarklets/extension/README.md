# Bookmark Folder Exporter Extension

A simple Chrome/Edge browser extension that allows you to export a specific bookmark folder (and all its subfolders) into a standard Netscape HTML bookmark file.

## Features

*   **Folder Selection**: Browse your bookmarks in a collapsible tree view to find the exact folder you want to export.
*   **Clean Export**: Generates a standard Netscape Bookmark HTML file compatible with most browsers and bookmark managers.
*   **Custom Metadata**: The exported file uses the selected folder's name for the file title and header, making it easy to identify.
*   **Privacy Focused**: Runs entirely locally on your machine. No data is sent to any server.

## Installation

Since this is a local development extension, you need to load it in "Developer Mode":

1.  Open your browser's Extensions page:
    *   **Chrome**: `chrome://extensions`
    *   **Edge**: `edge://extensions`
2.  Enable **Developer mode** (usually a toggle switch in the top right or left corner).
3.  Click the **Load unpacked** button.
4.  Select the `extension` folder containing this `README.md` file.

## Usage

1.  Click the extension icon in your browser toolbar.
2.  Navigate the tree view to find the folder you wish to export.
    *   Click a folder name to **select** it.
    *   Click the arrow (▶) to **expand/collapse** subfolders.
3.  Once a folder is selected (highlighted in blue), click the **Export to HTML** button.
4.  The extension will generate the HTML file and prompt you to save it.

## Technical Details

*   **Manifest Version**: V3
*   **Permissions**: `bookmarks` (Required to read the folder structure).
*   **Output Format**: Netscape Bookmark File Format (HTML DL/DT structure).

## File Structure

*   `manifest.json`: Extension configuration and permissions.
*   `popup.html`: The user interface (tree view).
*   `popup.js`: Logic for fetching bookmarks, rendering the tree, and generating the HTML export.
