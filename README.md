# Listan

A modern **full‑stack web application** for creating and managing lists with authentication and persistent storage.

🔗 **Live demo:** https://listan.sixten.app

---

## Screenshot

![Listan Screenshot](./screenshot.png)

> 📸 Add a screenshot named `screenshot.png` to the root of this repository  
> (Home page or main list view is ideal)

---

## Description

Listan is a full‑stack application that allows users to create, manage, and organize lists in a clean and intuitive interface.  
Authentication is handled securely, and all data is persisted in a backend database.

This project was built to practice and demonstrate modern full‑stack JavaScript development using production‑ready tools.

---

## Tech Stack

### Frontend
- **Next.js** (App Router)
- **TypeScript**
- **React**
- **Tailwind CSS**

### Backend
- **Convex** – database and server‑side functions
- **Clerk** – authentication & user management

### Deployment
- **Railway** – backend & infrastructure
- **Custom domain** – `listan.sixten.app`

---

## Features

- User authentication (sign up / sign in) via Clerk
- Create, read, update, and delete lists
- Persistent data storage using Convex
- Server‑side backend functions
- Responsive and accessible UI
- Deployed and publicly accessible

---

## Architecture

The application is built using a modern full‑stack architecture:

- The **Next.js frontend** handles routing, UI, and client‑side interactions
- **Clerk** manages authentication and user sessions
- **Convex** provides backend functions and database access
- The application is deployed on **Railway** with a custom domain
