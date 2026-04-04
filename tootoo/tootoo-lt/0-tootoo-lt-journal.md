# TooToo LT — Development Journal

## 2026-04-04

I want to build, create the prompt for a light version or LT version of `index.html`.

It loads and displays the files in a single repository the primary branch.

It does not include the full repo list, orgs, gists, or stats — just the tree and file content for the selected repo's default branch.

The UI will therefore be simplified: the header will only have the owner/repo input fields and the token button. The sidebar will only show the tree for the selected repo/branch, and the content area will render the selected file. All other features from the full TooToo index.html — repo list, orgs, gists, stats — are omitted.

The prompt for the LLM will therefore describe this simplified LT version: it should instruct the model to generate a single `tootoo-lt.html` file that only implements tree sidebar for the selected repo, and content area for the selected file, omitting all other features from the full TooToo app.

Ask any clarifying questions one at a time.
