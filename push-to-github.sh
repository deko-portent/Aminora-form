#!/bin/bash

# Script to push Aminora-form to GitHub
# Repository: https://github.com/deko-portent/Aminora-form.git

echo "Initializing git repository..."
git init

echo "Adding all files..."
git add .

echo "Creating initial commit..."
git commit -m "Initial commit: Aminora form main"

echo "Setting branch to main..."
git branch -M main

echo "Adding remote origin..."
git remote add origin https://github.com/deko-portent/Aminora-form.git

echo "Pushing to GitHub..."
git push -u origin main

echo "Done! Your code has been pushed to GitHub."

