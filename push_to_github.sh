#!/bin/bash

echo "=== DriverConnect GitHub Push Script ==="
echo "This script will help you push your code to GitHub"
echo ""

# Check if git is configured
echo "Current git configuration:"
git config --list | grep user

echo ""
echo "Repository status:"
git status

echo ""
echo "To push to your GitHub repository, run these commands:"
echo ""
echo "1. If you haven't set up authentication, you'll need to either:"
echo "   - Use GitHub CLI: gh auth login"
echo "   - Or use a personal access token"
echo ""
echo "2. Then run:"
echo "   git push --force origin main"
echo ""
echo "This will overwrite everything in your remote repository with the current code."
echo ""
echo "Your repository URL: https://github.com/Jaycubic/DriversProject.git"
