# DeepSeek Clone

A full-stack AI-powered chat application built with **Next.js**, **Tailwind CSS**, **MongoDB**, and **Clerk** for authentication. This project mimics the functionality and UI of DeepSeek, allowing users to interact with an AI assistant.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-DeepSeek%20Clone-green)](https://deep-seek-clone-one.vercel.app/)

---

## Features

- **AI Chat**: Interact with an AI assistant powered by the DeepSeek API.
- **User Authentication**: Secure user authentication using **Clerk**.
- **Conversation History**: Save and retrieve chat history using **MongoDB**.
- **Responsive UI**: Built with **Tailwind CSS** for a clean and responsive design.
- **Hosted on Vercel**: Deployed and hosted on **Vercel** for seamless accessibility.

---

## Prerequisites

Before running the project, ensure you have the following:

- **Node.js** installed (v16 or higher).
- **npm** or **yarn** installed.
- Accounts on the following platforms:
  - [Clerk](https://clerk.com/) for authentication.
  - [MongoDB Atlas](https://cloud.mongodb.com/) for the database.
  - [OpenRouter](https://openrouter.ai/) for the DeepSeek API key.

---

## Environment Variables

To run this project, you need to set up the following environment variables: (you will fild them in **.env.example**)
### From [Clerk](https://clerk.com/)
```Markdown
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: Your Clerk Publishable Key.
    CLERK_SECRET_KEY: Your Clerk Secret Key.
    SIGNING_SECRET:
        - Go to [Clerk Dashboard](https://clerk.com/apps).
        - Navigate to Webhooks.
        - Add an endpoint and copy the signing secret.
```
---

### From [MongoDB Atlas](https://cloud.mongodb.com/)
```Markdown
    MONGODB_URI: Your MongoDB connection string.
```

### From [OpenRouter](https://openrouter.ai/)
```Markdown
    DEEPSEEK_API_KEY: Your DeepSeek API key.
```

---

## Getting Started

Follow these steps to set up and run the project locally:
1. **Clone the Repository**:
```bash
   git clone https://github.com/your-username/deep-seek-clone.git
   cd deep-seek-clone
```
2. **Install Dependencies**:
```bash
    npm install
```
3. **Set Up Environment Variables**:
- add the following environment variables to .env file
```bash
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    CLERK_SECRET_KEY=your_clerk_secret_key
    SIGNING_SECRET=your_signing_secret
    MONGODB_URI=your_mongodb_uri
    DEEPSEEK_API_KEY=your_deepseek_api_key
```
4. **Run the Development Server**:
```bash
    npm run dev
```
5. **Open the Application**: Visit http://localhost:3000 in your browser to view the application.

6. **How to use**:
- login
- start chating X'D
