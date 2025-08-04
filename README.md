# 🍽️ Treat Caterers - Catering Management App

A full-stack MERN web application tailored for local caterers to streamline lead handling, menu creation, quote generation, and event planning — with seamless WhatsApp chatbot integration.

🔗 **Live App:** [https://treat-caterers.vercel.app](https://treat-caterers.vercel.app)  
🧠 Built for: Real-world catering use cases with structured quote control and smart event parsing.

---

## ✨ Features

### 🧾 Lead Management via WhatsApp
- WhatsApp bot auto-collects structured event details
- Supports fuzzy matching for event types
- Stores leads with full event data in MongoDB
- Attachable tier-based quotes

### 💬 Quotation System
- Category-based dish selection
- Maximum selectable limits per category
- Editable quotes for leads and chefs
- Tier-based pricing with dynamic dish blocks

### 📋 Dish & Menu Management
- Add, update, delete dishes by category
- Create menus from selected dishes
- Separate admin/user ownership for menus

---

## 🔌 Tech Stack

- **Frontend**: React, Vite, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB + Mongoose
- **Chatbot**: Meta WhatsApp Cloud API (or WhatsApp Web.js)
- **Libraries**: Fuse.js (fuzzy match), chrono-node (date parsing)

---

## 📦 API Overview

| Feature         | Route                    | Description                           |
|-----------------|--------------------------|---------------------------------------|
| Leads           | `/api/leads`             | Create/view leads, attach quotes      |
| Quotes          | `/api/quotesNew`         | Tier + category-based quote creation  |
| Dishes          | `/api/dishes`            | CRUD operations on individual dishes  |
| Menus           | `/api/menus`             | Create/edit menus with multiple dishes|
| Tiers           | `/api/tiers`             | Define tier rules + dish blocks       |
| Categories      | `/api/categories`        | Add/manage reusable categories        |
| WhatsApp Webhook| `/whatsapp`              | Handles messages from bot             |

---

## 🤖 WhatsApp Bot Flow

When a user sends "Hi", the bot replies:

```
Hi, this is Treat Caterers!

Please send your event details:

Name:  
Contact Number:  
Event Type:  
Event Date:  
Event Time:  
Number of Guests:  
Location:  

Menu: https://treat-caterers.vercel.app/menu
```

→ The backend parses the message, validates it, stores in MongoDB, and sends confirmation.

---

## 🗂 Directory Structure (Backend)

```
/models          → Mongoose schemas (Lead, Quote, Tier, Dish, etc.)
/routes          → Express routes for API endpoints
/utils           → Message senders, parsers
/app.js          → Server entry point
/.env            → MONGO_URI, META_VERIFY_TOKEN, etc.
```

---

## 🚀 Deployment Info

- Frontend deployed on **Vercel**
- Backend deployed via **Render**
- WhatsApp Bot tested via Meta Cloud API / Twilio webhook

---

## 📈 Future Improvements

- Admin dashboard with analytics
- Procurement list auto-generation
- Event calendar view for chefs
- OTP-based lead verification

---

## 👨‍💻 Developer Note

This project was built to simplify real-life catering workflows for both customers and caterers. Chat-based interaction, quote control, and modular dish-tier logic make it flexible for all scales of catering businesses.

---

> For collaboration, feel free to raise an issue or connect via GitHub/LinkedIn.
