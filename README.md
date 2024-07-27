# 🧠 [Smart Brain](https://smart-brain-black.vercel.app/) [![Visit](https://img.shields.io/badge/Visit-green?logo=globe&logoColor=white)](https://smart-brain-black.vercel.app/)

Welcome to **Smart Brain** – your intelligent solution for efficient document management, note-taking, and fast information retrieval. Built with modern technologies, Smart Brain empowers users to interact seamlessly with their documents and notes while leveraging advanced search capabilities.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Features](#features)
- [Future Implementations](#future-implementations)
- [Screenshots](#screenshots)
- [Environment Variables](#environment-variables)

## Technologies Used

This section lists the external resources and technologies used in the project.

- **[Next.js](https://nextjs.org/)**: A React framework for server-side rendering and static site generation.
- **[TypeScript](https://www.typescriptlang.org/)**: Enhances JavaScript with type safety and improved developer tooling.
- **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework for designing custom user interfaces effortlessly.
- **[Shadcn](https://shadcn.dev/)**: A modern UI component library for building accessible and responsive web interfaces.
- **[Convex](https://convex.dev/)**: A serverless backend platform that simplifies building real-time applications.
- **[Clerk](https://clerk.dev/)**: Provides secure user authentication and management.

## Features

- **📂 Document Upload**: Upload and organize your documents with ease.
- **💬 Document Chat**: Engage in interactive chats with your documents to extract valuable insights.
- **📝 Note Creation**: Create, manage, and organize your notes effectively.
- **🔍 Vector Search**: Perform quick and accurate searches to find relevant information using advanced vector search technology.
- **🔐 Authentication**: Secure user authentication and management with Clerk.

## Future Implementations

We are continually working on improving Smart Brain. Upcoming features include:

🏢 Organization Management: Integrate Clerk’s organization feature to manage and organize user accounts more effectively.

## Screenshots

Include screenshots of your application to give users a visual preview.

![Screenshot 1](/public/landing-page.png)

## Environment Variables

This project uses several environment variables for configuration. Create a `.env` file in the root of your project and add the following variables:

```dotenv
CONVEX_DEPLOYMENT=

NEXT_PUBLIC_CONVEX_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

CLERK_SECRET_KEY=
```
