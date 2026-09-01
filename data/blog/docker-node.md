---
title: "Dockerizing a Node.js App"
author: "dayanch"
createdAt: "2024-06-25T17:00:00.000Z"
description: "Learn how to build and run a Node.js app in Docker with minimal setup."
category: "devops"
---

Docker is a popular containerization tool that allows you to package applications and their dependencies into a portable container.

In this post, we will learn how to Dockerize a simple Node.js application.

---

### 🛠 Project Structure

```bash
my-node-app/
├── Dockerfile
├── package.json
├── package-lock.json
└── index.js
```

---

### 📦 Step 1: Create a basic Node.js app

```js
// index.js
const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello from Dockerized Node.js app!\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

### 📄 Step 2: `package.json`

```json
{
  "name": "my-node-app",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {}
}
```

---

### 🐳 Step 3: Create the `Dockerfile`

```Dockerfile
# Use an official Node.js image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Run the app
CMD [ "npm", "start" ]
```

---

### 🚀 Step 4: Build and Run the Container

```bash
docker build -t my-node-app .
docker run -p 3000:3000 my-node-app
```

Now open your browser and go to `http://localhost:3000` — you should see:

> Hello from Dockerized Node.js app!

---

### ✅ Summary

- `Dockerfile` describes how to build the app image
- App runs inside isolated container
- Easy to share and deploy

This is a basic example. In future posts, we’ll look at:

- Adding volume mounts
- Using `docker-compose`
- Multi-stage builds for smaller image sizes

Happy shipping! 🐳
