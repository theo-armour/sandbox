#!/usr/bin/env python3
"""
Export Raindrop.io CSV bookmarks to a folder/file structure.
Each bookmark becomes a markdown file with metadata.
"""

import csv
import os
import re
from pathlib import Path
from datetime import datetime

# Configuration
INPUT_CSV = "raindrop-io.csv"
OUTPUT_DIR = "exported-bookmarks"

def sanitize_filename(name):
    """Sanitize a string to be used as a filename."""
    # Remove or replace invalid characters
    name = re.sub(r'[<>:"/\\|?*]', '-', name)
    # Remove leading/trailing spaces and dots
    name = name.strip('. ')
    # Limit length
    if len(name) > 200:
        name = name[:200]
    return name or "untitled"

def create_markdown_file(bookmark, output_path):
    """Create a markdown file for a bookmark."""
    content = f"""# {bookmark['title']}

**URL:** {bookmark['url']}

**Created:** {bookmark['created']}

**Tags:** {bookmark['tags']}

**Favorite:** {bookmark['favorite']}

"""

    if bookmark['excerpt']:
        content += f"## Excerpt\n\n{bookmark['excerpt']}\n\n"

    if bookmark['note']:
        content += f"## Notes\n\n{bookmark['note']}\n\n"

    if bookmark['cover']:
        content += f"## Cover Image\n\n![Cover]({bookmark['cover']})\n\n"

    if bookmark['highlights']:
        content += f"## Highlights\n\n{bookmark['highlights']}\n\n"

    # Write the file
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    """Main function to export bookmarks."""
    script_dir = Path(__file__).parent
    csv_path = script_dir / INPUT_CSV
    base_output_dir = script_dir / OUTPUT_DIR

    # Remove old output directory if it exists
    if base_output_dir.exists():
        import shutil
        shutil.rmtree(base_output_dir)

    base_output_dir.mkdir(parents=True, exist_ok=True)

    print(f"Reading bookmarks from: {csv_path}")
    print(f"Output directory: {base_output_dir}")

    bookmark_count = 0
    folder_count = set()

    with open(csv_path, 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)

        for row in reader:
            bookmark_count += 1

            # Get folder path and split into hierarchy
            folder_path = row['folder'].strip() or "Unsorted"
            folder_parts = [part.strip() for part in folder_path.split('/')]

            # Track unique folders
            folder_count.add(folder_path)

            # Create folder path
            folder_dir = base_output_dir
            for part in folder_parts:
                folder_dir = folder_dir / sanitize_filename(part)

            # Create filename from title or ID
            title = row['title'] or f"bookmark-{row['id']}"
            filename = sanitize_filename(title) + ".md"

            # Handle duplicate filenames by appending ID
            output_path = folder_dir / filename
            if output_path.exists():
                filename = sanitize_filename(f"{title}-{row['id']}") + ".md"
                output_path = folder_dir / filename

            # Create the markdown file
            create_markdown_file(row, output_path)

            if bookmark_count % 100 == 0:
                print(f"Processed {bookmark_count} bookmarks...")

    print(f"\n✅ Export complete!")
    print(f"   Total bookmarks: {bookmark_count}")
    print(f"   Unique folders: {len(folder_count)}")
    print(f"   Output location: {base_output_dir}")

if __name__ == "__main__":
    main()
