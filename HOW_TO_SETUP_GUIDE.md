# 🚀 ChefManage - Simple Setup Guide

---

## **Step 0: Check Prerequisites**
Make sure you have these installed:

```bash
# Check Node.js (should be v16 or higher)
node --version

# Check npm (comes with Node.js)
npm --version

# Check MongoDB (should be running)
mongod --version
```

**If not installed:**
- **Node.js**: Download from https://nodejs.org/
- **MongoDB**: Download from https://www.mongodb.com/try/download/community

---
* Click "Ctrl+Shift+V" to view this file *

## **Step 1: Setup Frontend**
```bash
# Go to frontend folder
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# You should see: "Local: http://localhost:5173"
```

---

## **Step 2: Setup Backend**
```bash
# Open new terminal and go to backend folder
cd botbackend

# Install dependencies
npm install

# Start development server
npm run dev

# You should see: "Server running on port 3000" and "MongoDB connected"
```

---

## **Step 3: Setup WhatsApp Bot**

### **3.1) Create WhatsApp App in Meta Developer Account**
1. Go to https://developers.facebook.com/
2. Create account → Create App → Business → WhatsApp
3. Follow this tutorial: https://www.youtube.com/watch?v=q0ojEbdezFU&list=PLi9cSkiBrnxa58GtrU8OdNiBErd20I0JY

### **3.2) Get Your 3 Credentials and Add to .env File**
Create a `.env` file in the `botbackend/` folder and paste this:

```properties
WHATSAPP_TOKEN=your_access_token_from_meta
WABA_PHONE_NUMBER_ID=your_phone_number_id_from_meta
META_VERIFY_TOKEN=any_text_you_want
MONGO_URI=mongodb://localhost:27017/cateringbot
PORT=3000
CLIENT_URL=http://localhost:5173
```

**Where to get each value:**
- **WHATSAPP_TOKEN** → Meta Console → WhatsApp → Getting Started → Copy "Access Token"
- **WABA_PHONE_NUMBER_ID** → Meta Console → WhatsApp → Getting Started → Copy "Phone Number ID"
- **META_VERIFY_TOKEN** → Make up any text (like: "my_verify_token_123")

### **3.3) Expose Port with Ngrok and Set Webhook**
```bash
# Create free account at https://ngrok.com first (required)

# Then run this command (no installation needed)
npx ngrok http 3000

# Copy the HTTPS URL (like: https://abc123.ngrok-free.app)
```

**Set Webhook in Meta:**
1. Go to Meta Console → WhatsApp → Configuration
2. **Webhook URL**: `https://your-ngrok-url.ngrok-free.app/whatsappbot`
3. **Verify Token**: Use the same text you put in `META_VERIFY_TOKEN`
4. Click "Verify and Save"
5. Subscribe to "messages"

---

## ✅ **That's It!**

Your app is now running:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **WhatsApp**: Connected via webhook

Please check the Technical Documents folder for further development 
