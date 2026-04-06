# TooToo LT — Development Journal

## 2026-04-05

So what's next? Go from Tutu LT back to the big Tootoo.

Add repo stats to LT. no. Keep LT very basic.




***

Again, What amazing progress!

I would like to be able to drop TooToo-LT.html into any local repository folder and have it configure itself or detect the repository it is in and automatically set `CONFIG.owner` and `CONFIG.repo` accordingly.

Can you think of ways to do this?

--allow-file-access-from-files

### Done
* Let files that stream of any size run without prompting.
* OK to load large files that stream
* Smaller file size margins
* Shorter location.hash
* How to get a gat?
* PDFs load OK locally
* If a repository is private, inform the user That the repository is private and prompt them to enter a token in order to view files.
## 2026-04-04

I want to build, create the prompt for a light version or LT version of `index.html`.

It loads and displays the files in a single repository the primary branch.

It does not include the full repo list, orgs, gists, or stats — just the tree and file content for the selected repo's default branch.

The UI will therefore be simplified: the header will only have the owner/repo input fields and the token button. The sidebar will only show the tree for the selected repo/branch, and the content area will render the selected file. All other features from the full TooToo index.html — repo list, orgs, gists, stats — are omitted.

The prompt for the LLM will therefore describe this simplified LT version: it should instruct the model to generate a single `tootoo-lt.html` file that only implements tree sidebar for the selected repo, and content area for the selected file, omitting all other features from the full TooToo app.

Ask any clarifying questions one at a time.
