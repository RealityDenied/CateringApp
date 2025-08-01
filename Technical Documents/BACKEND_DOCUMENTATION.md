# ChefManage Backend API Documentation

* "Ctrl+Shift+V" to view this file in VSCode" *

## 📋 Project Overview

**Project Name:** QuickCater - Catering Management System  
**Backend Framework:** Node.js with Express.js  
**Database:** MongoDB 
**Version:** 1.0.0  
**Main Entry Point:** botbackend/app.js  

### 🎯 Purpose
QuickCater is a comprehensive catering management system that handles:

- Lead Management - Whatsapp bot Integration for Lead OnBoarding , Event Calendar for Visualisation . The Lead can also send event details and Quote through whatsapp. It includes fuzzy matching to parse the raw whatsapp message to actual data type in MongoDB database.

- Menu to Quote System - Chef can create Per plate pricing based Tiers and drag and drop categories with dishes . He can also put add ons for dishes with extra pricing as an option

- Ingredient Procurement - To be made ...

---

## 🏗️ Architecture Overview

### Project Structure
```
botbackend/
├── app.js              # Main application entry point
├── package.json        # Dependencies and scripts
├── .env               # Environment variables (All API keys are stored here , dont push )
├── models/            # Mongoose data models
│   ├── Category.js    # Dish Category schema
│   ├── dish.js        # Dish schema
│   ├── lead.js        # Lead/Customer schema
│   ├── menu.js        # Menu schema (currently depreciated , so ignore)
│   ├── Message.js     # Whatsapp Message schema
│   ├── QuoteModel.js  # Quote schema
│   └── Tier.js        # Pricing tier schema
├── routes/            # API route handlers
│   ├── categoryRoutes.js    # Category CRUD operations
│   ├── dishRoutes.js        # Dish management
│   ├── leadRoutes.js        # Lead management
│   ├── menuRoutes.js        # Menu operations (currently depreciated , so ignore)
│   ├── messageRoutes.js     # Messaging system
│   ├── quoteRoutesNew.js    # Quote management
│   ├── tierRoutes.js        # Tier management
│   └── whatsappbotRoutes.js # WhatsApp webhook handler
└── utils/             # Utility functions
    └── metaSend.js    # WhatsApp messaging utilities
```

---

## 📦 Dependencies

### Production Dependencies
- **express** (^5.1.0) - Web application framework
- **mongoose** (^8.16.0) - MongoDB object modeling
- **cors** (^2.8.5) - Cross-Origin Resource Sharing
- **dotenv** (^16.5.0) - Environment variable management
- **body-parser** (^2.2.0) - Request body parsing
- **chrono-node** (^2.8.3) - Natural language date parsing
- **fuse.js** (^7.1.0) - Fuzzy search functionality
- **meta**  - Whatsapp Meta API 

### Development Dependencies
- **nodemon** (^3.1.10) - Development server with auto-restart
- **ngrok** - Using currently for port forwarding.

---

## 🗄️ Database Models

### 1. Lead Model (`models/lead.js`)
Identifies each lead . Either came from whatsapp or created Manually are stored in this schema. Each Lead has its own unique Quote Session Link.

**Fields:**
- `phone` (String) - Customer phone number
- `name` (String) - Customer name
- `contactNumber` (Number) - Contact number
- `eventType` (String) - Type of event (Birthday, Wedding, etc.)
- `eventDate` (Date) - Event date and time
- `numberOfGuests` (Number) - Expected guest count
- `location` (String) - Event location
- `sessionToken` (String) - Unique session identifier for accessing quote webpage. 
- `quote` (ObjectId) - Reference to Quote model
- `createdAt` (Date) - Record creation timestamp

### 2. Dish Model (`models/dish.js`)
Represents individual dish items to be stored in categories.
dishes can be put in 2 categories - felxible and non-flexible .
Flexible Category -Has Dish with individual pricing.
Non-Flexible Category - Dish doesnt have individual pricing it inherits the price of its Tier. 
In non-flexible category dish price is set to zero , such that it can inherit the pricing of tier .
Flexible category is basically Add-ons category , where every dish has their own price on basis of per guest or per stall.

**Fields:**
- `name` (String) - Dish name
- `price` (Number) - Dish price
- `category` (String) - Food category
- `description` (String) - Dish description
- `isActive` (Boolean) - Availability status

### 3. Category Model (`models/Category.js`)
In non-flexible category dish price is set to zero , such that it can inherit the pricing of tier .
Flexible category is basically Add-ons category , where every dish has their own price on basis of per guest or per stall.

**Fields:**
- `name` (String) - Category name
- `isFlexible` (Boolean) - Whether category allows flexible selection
- `createdAt` (Date) - Creation timestamp

### 4. Tier Model (`models/Tier.js`)
Tiers are subset of Menu , where each Tier represent per guest priced plate .
Eg - Silver Tier - Rs 400 per guest , Gold Tier - Rs 500 per guest.

**Fields:**
- `name` (String) - Tier name (Silver, Gold, Platinum)
- `description` (String) - Tier description
- `pricePerPlate` (Number) - Base price per plate
- `categories` (Array) - Category configurations
  - `category` (String) - Category name
  - `maxSelectable` (Number) - Maximum selectable items
  - `dishIds` (Array) - Available dish IDs

### 5. Quote Model (`models/QuoteModel.js`)
Stores customer quote information.Every Quote is inherited from Menu created by Chef and the input selections by Lead 

**Fields:**
- `tierId` (ObjectId) - Reference to selected tier
- `selectedDishes` (Array) - Selected dishes by category
- `selectedAddOns` (Array) - Additional items
- `updatedBy` (String) - Last updated by (chef/lead)
- `updatedAt` (Date) - Last update timestamp

### 6. Message Model (`models/Message.js`)
Chat messages between Chef ( facing QuickCater App) and customers(facing whatsapp bot).

**Fields:**
- `leadId` (ObjectId) - Reference to lead
- `sender` (String) - Message sender (chef/lead)
- `text` (String) - Message content
- `timestamp` (Date) - Message timestamp

### 7. Menu Model (`models/menu.js`) (currently depreciated , so ignore)
Menu configurations

**Fields:**
- `name` (String) - Menu name
- `dishes` (Array) - Associated dishes
- `price` (Number) - Menu price

---

## 🚀 API Endpoints

### Base URL: `http://localhost:3000`

### 1. Dish Management (`/api/dishes`)

#### GET `/api/dishes`
- **Description:** Retrieve all dishes
- **Response:** Array of dish objects
- **Status Codes:** 200 (Success), 500 (Server Error)

#### POST `/api/dishes`
- **Description:** Create a new dish
- **Body:** `{ name, price, category, description }`
- **Response:** Created dish object
- **Status Codes:** 201 (Created), 400 (Bad Request)

#### DELETE `/api/dishes/:id`
- **Description:** Delete a dish by ID
- **Parameters:** `id` - Dish ID
- **Response:** Confirmation message
- **Status Codes:** 200 (Success), 500 (Server Error)

### 2. Category Management (`/api/categories`)

#### GET `/api/categories`
- **Description:** Retrieve all categories
- **Response:** Array of category objects

#### POST `/api/categories`
- **Description:** Create a new category
- **Body:** `{ name, isFlexible }`
- **Response:** Created category object

### 3. Tier Management (`/api/tiers`)

#### GET `/api/tiers`
- **Description:** Get all tiers with populated categories and dishes
- **Response:** Array of tier objects with full data

#### POST `/api/tiers`
- **Description:** Create a new pricing tier
- **Body:** `{ name, description, pricePerPlate }`
- **Response:** Created tier object

#### PUT `/api/tiers/:id/categories`
- **Description:** Add or update category configuration in a tier
- **Body:** `{ category, maxSelectable, dishIds }`
- **Response:** Updated tier object

#### DELETE `/api/tiers/:id`
- **Description:** Delete a tier
- **Response:** Confirmation message

### 4. Lead Management (`/api/leads`)

#### GET `/api/leads`
- **Description:** Retrieve all leads
- **Response:** Array of lead objects

#### GET `/api/leads/by-token/:token`
- **Description:** Get lead by session token
- **Parameters:** `token` - Session token
- **Response:** Lead object

#### POST `/api/leads`
- **Description:** Create a new lead
- **Body:** Lead information
- **Response:** Created lead object

#### PATCH `/api/leads/:id/attach-quote`
- **Description:** Attach a quote to a lead
- **Body:** `{ quoteId }`
- **Response:** Updated lead object

### 5. Quote Management (`/api/quotesNew`)

#### POST `/api/quotesNew`
- **Description:** Create a new quote
- **Body:** `{ tierId, selectedDishes, selectedAddOns, updatedBy }`
- **Response:** Created quote object

#### GET `/api/quotesNew/:id`
- **Description:** Get quote with populated tier and dishes
- **Response:** Quote object with full data

#### PUT `/api/quotesNew/:id`
- **Description:** Update a quote
- **Body:** `{ selectedDishes, selectedAddOns, updatedBy }`
- **Response:** Updated quote object

#### PATCH `/api/quotesNew/:id/add-addon`
- **Description:** Add an addon to existing quote
- **Body:** `{ dishId, unit }`
- **Response:** Updated quote object

### 6. Message System (`/api/messages`)

#### GET `/api/messages/lead/:leadId`
- **Description:** Get all messages for a specific lead
- **Parameters:** `leadId` - Lead ID
- **Response:** Array of message objects sorted by timestamp

#### POST `/api/messages/send`
- **Description:** Send a message to a lead via WhatsApp
- **Body:** `{ leadId, text }`
- **Response:** Created message object
- **Side Effect:** Sends WhatsApp message to customer

### 7. WhatsApp Webhook (`/whatsappbot`)

#### GET `/whatsappbot`
- **Description:** WhatsApp webhook verification
- **Query Parameters:** `hub.mode`, `hub.verify_token`, `hub.challenge`
- **Response:** Challenge string or 403 error

#### POST `/whatsappbot`
- **Description:** Handle incoming WhatsApp messages
- **Body:** WhatsApp webhook payload
- **Processing:**
  - Saves incoming messages to database
  - Responds to "hi" with event form
  - Processes event detail forms
  - Creates leads and generates session tokens

### 8. Utility Endpoints

#### GET `/api`
- **Description:** API health check
- **Response:** "✅ API root reached."

#### GET `/api/config`
- **Description:** Get client configuration
- **Response:** `{ CLIENT_URL }`

#### GET `/`
- **Description:** Root endpoint
- **Response:** "Treat Caterers WhatsApp Bot is running 🚀"

---

## 🔧 Configuration

### Environment Variables (.env)
```
All the API keys are stored here , It is a confidential file please never try to push it in public codebase .
```

### Server Configuration
- **Port:** 3000 for backend and 5173 for frontend.
- **CORS:** Enabled for all origins
- **Body Parsers:** JSON and URL-encoded
- **Database:** MongoDB with Mongoose connection

---

## 🔄 Business Logic Flow

### 1. Customer Onboarding via WhatsApp
1. Customer sends "hi" to WhatsApp number
2. Bot responds with event details form
3. Customer fills and submits form
4. System creates Lead record with session token
5. Bot sends quote session link to customer

### 2. Quote Generation Process
1. Customer accesses quote session link in whatsapp
2. Selects pricing tier (Silver/Gold/Platinum)
3. Chooses dishes within tier limits
4. Adds optional add-ons
5. Quote is saved and attached to lead

### 3. Admin Communication
1. Admin views leads in dashboard
2. Can send messages via chat interface
3. Messages are sent to WhatsApp and stored in database
4. Real-time polling updates conversation

### 4. Menu Management
1. Admin creates categories and dishes
2. Configures pricing tiers with category limits
3. Associates dishes within categories with tiers
4. Manages availability and pricing

---



## 🚀 Deployment Instructions

### Prerequisites
- Node.js (>=14.x)
- MongoDB instance

### Backend Installation
1. Clone the repository
2. Navigate to botbackend directory
3. Run `npm install`
4. Configure environment variables. 
5. Run `npm run dev` for development

### Frontend Installation
1. Clone the repository
2. Navigate to frontend directory
3. Run `npm install`
4. Run `npm run dev` for development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

---

## 🔮 Future Enhancements

### Planned Features
- Authentication system
- File upload support
- Advanced reporting
- Payment integration
- Email notifications/Google Calendar integration

### Scalability
- Google Oauth Integration
- Single whatsapp bot to handle multiple Chef.


---

*Last Updated: July 26, 2025*  
*Version: 1.0.0*  
*Author: Vikash Kumar*
*Email: For any queries , please email me at vikashkumar3791kzq(attherate)gmail.com*
