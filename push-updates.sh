#!/bin/bash
# Quick script to push documentation updates to GitHub Pages

cd "/Users/alexandra.sommers/Environment Documentation"

# Check if there are changes
if [[ -z $(git status -s) ]]; then
    echo "✓ No changes to commit"
    exit 0
fi

# Show what will be committed
echo "📝 Changes to be committed:"
git status -s

# Add all changes
git add -A

# Prompt for commit message
echo ""
echo "Enter commit message (or press Enter for default):"
read commit_msg

if [[ -z "$commit_msg" ]]; then
    commit_msg="Update MDM environment documentation"
fi

# Commit with co-author
git commit -m "$commit_msg

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# Push to GitHub
echo ""
echo "🚀 Pushing to GitHub..."
git push

echo ""
echo "✓ Done! Your changes will be live at:"
echo "  https://alsommers-ifna-sfdc.github.io/mdm-environment-docs/"
echo ""
echo "⏱  GitHub Pages typically updates in 1-2 minutes"
