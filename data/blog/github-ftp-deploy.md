---
title: "Automated FTP Deployment with GitHub Actions"
author: "dayanch"
createdAt: "2024-04-05T15:00:00.000Z"
description: "Learn how to automatically deploy your website to an FTP server using GitHub Actions and SamKirkland's FTP Deploy Action."
category: "devops"
---

If you’re maintaining a static website or PHP project and you’re still deploying manually via FTP, **you can automate it using GitHub Actions**.

This article shows how to deploy your code to an FTP server whenever you push to the `main` branch of your GitHub repository.

---

### 🧩 Required Setup
1. Your project should be on GitHub
2. You need an FTP server (many shared hostings offer this)
3. You must add the following secrets to your repo under `Settings > Secrets and variables > Actions`:
   - `FTP_SERVER`
   - `FTP_USER`
   - `FTP_PASSWORD`

---

### 📁 Directory Structure
This deploys everything from the root directory (`./`). If you want to deploy only a `build/` or `dist/` folder, change `local-dir` accordingly.

---

### ✅ GitHub Workflow: `.github/workflows/main.yml`

```yml
name: Site name

on:
  push:
    branches:
      - main

jobs:
  FTP-Deploy-Action:
    name: FTP-Deploy-Action
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
      with:
        fetch-depth: 2

    - name: Get list of changed files
      id: changed-files
      run: |
        echo "Changed files:"
        git diff --name-only HEAD^ HEAD
        echo "::set-output name=files::$(git diff --name-only HEAD^ HEAD | tr '\n' ' ')"
        echo "files=$changed_files" >> $GITHUB_ENV

    - name: FTP-Deploy-Action
      uses: SamKirkland/FTP-Deploy-Action@v4.3.3
      with:
        server: ${{ secrets.FTP_SERVER }}
        username: ${{ secrets.FTP_USER }}
        password: ${{ secrets.FTP_PASSWORD }}
        local-dir: './'
```

---

### 🛠️ Customization Tips
- Want to upload only certain folders? Use `local-dir: './build'`
- Want to deploy only when a tag is pushed? Change `on.push.branches` to `on.push.tags`
- Need to exclude files like `.gitignore`? Use [`exclude` options](https://github.com/SamKirkland/FTP-Deploy-Action#exclude)

---

### 📌 Summary
- Fast, automated, and efficient
- No manual FileZilla needed ever again 🙌
- Great for static sites, WordPress themes, and simple PHP apps

You can now deploy directly from GitHub to any shared hosting account with FTP support!
