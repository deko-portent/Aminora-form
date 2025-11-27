# Setting Up GitHub Repository

Follow these steps to initialize and push this project to a new GitHub repository:

## Step 1: Create a New Repository on GitHub

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name your repository (e.g., `aminora-form-main`)
5. Choose whether it should be public or private
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

## Step 2: Initialize Git and Push to GitHub

Open your terminal in the project directory and run these commands:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Make initial commit
git commit -m "Initial commit: Aminora form main"

# Add your GitHub repository as remote
git remote add origin https://github.com/deko-portent/Aminora-form.git

# Rename default branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Alternative: Using GitHub CLI

If you have GitHub CLI installed:

```bash
# Initialize git
git init
git add .
git commit -m "Initial commit: Aminora weight loss quiz funnel"

# Note: Repository already exists at https://github.com/deko-portent/Aminora-form.git
# Just push your code using the commands above
```

## Step 3: Verify

After pushing, refresh your GitHub repository page. You should see all your files there!

## Future Updates

For future changes, use these commands:

```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push
```

