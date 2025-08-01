# 🎨 ChefManage Frontend Documentation

* "Ctrl+Shift+V" to view this file in VSCode" *

## 📖 **Project Overview**

The ChefManage Frontend is a modern React application built with Vite that provides an administrative interface for lead management , event creation and Menu to quote system. 

---

## 🛠️ **Technology Stack**

### **Core Technologies**
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | `^19.1.0` | UI Framework - Component-based architecture |
| **Vite** | `^6.3.5` | Build Tool - Fast development and optimized builds |
| **React Router DOM** | `^7.6.3` | Client-side Routing - Navigation between pages |
| **Axios** | `^1.10.0` | HTTP Client - API communication |

### **Development Tools**
| Tool | Version | Purpose |
|------|---------|---------|
| **ESLint** | `^9.25.0` | Code Linting - Code quality enforcement |
| **TypeScript Types** | `^19.1.2` | Type Definitions - Enhanced development experience |
| **Vite React Plugin** | `^4.4.1` | Build Integration - React support in Vite |

---

## 🏗️ **Project Architecture**

### **Directory Structure**
```
frontend/
├── public/                      # Static assets
│   ├── icons/                  # Event type icons
│   │   ├── birthday.png
│   │   ├── calendar.png
│   │   ├── corporate.png
│   │   └── wedding.png
│   └── vite.svg
├── src/                        # Source code
│   ├── assets/                 # Project assets
│   │   ├── logocater.png
│   │   ├── logonew.png
│   │   └── react.svg
│   ├── components/             # Reusable UI components
│   ├── context/                # React Context providers
│   ├── pages/                  # Route-level components
│   ├── styles/                 # CSS stylesheets
│   ├── utils/                  # Utility functions
│   ├── App.jsx                 # Root application component
│   ├── main.jsx               # Application entry point
│   └── index.css              # Global styles
├── eslint.config.js           # ESLint configuration
├── package.json               # Dependencies and scripts
├── vite.config.js            # Vite configuration
└── README.md                  # Project documentation
```

---

## 🔌 **API Integration**

### **API Configuration**
```javascript
// src/utils/api.js
import axios from 'axios';

export const API = axios.create({
  baseURL: '/api'  // Proxied to http://localhost:3000 via Vite
});
```

### **Vite Proxy Setup**
```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
});
```

### **API Endpoints Used**
| Endpoint | Method | Purpose | Components Using |
|----------|--------|---------|------------------|
| `/api/leads` | GET | Fetch all customer leads | ChatInbox, Dashboard |
| `/api/leads` | POST | Create new lead | AddEventModal |
| `/api/messages/lead/:id` | GET | Get messages for specific lead | ChatWindow |
| `/api/messages/send` | POST | Send message to customer | ChatWindow |
| `/api/tiers` | GET | Fetch pricing tiers | TierViewer, QuoteSession |
| `/api/dishes` | GET | Fetch available dishes | TierViewer, QuoteSession |
| `/api/categories` | GET | Fetch food categories | CategoryViewer, TierViewer |
| `/api/quotesNew` | POST | Create customer quote | QuoteSession |

---

## 📱 **Application Routes**

### **Route Configuration**
```jsx
// App.jsx - Main routing structure
<BrowserRouter>
  <SelectedLeadProvider>
    <Routes>
      <Route path="/dish" element={<DishManager />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/menumodule" element={<MenuModule />} />
      <Route path="/quote-editor/:token" element={<QuoteSession />} />
    </Routes>
  </SelectedLeadProvider>
</BrowserRouter>
```

### **Route Details**
| Route | Component | Purpose | Access Level |
|-------|-----------|---------|--------------|
| `/dashboard` | `Dashboard` | Main admin interface | Admin Only |
| `/chat` | `ChatPage` | Dedicated chat interface | Admin Only |
| `/dish` | `DishManager` | Dish inventory management | Admin Only |
| `/menumodule` | `MenuModule` | Menu configuration | Admin Only |
| `/quote-editor/:token` | `QuoteSession` | Customer quote creation | Public (Token-based) |

---

## 🧩 **Components Library**

### **📄 Page Components**

#### **1. Dashboard.jsx**
**Purpose:** Main administrative interface combining multiple features
```jsx
Features:
- Navigation sidebar with quick actions
- Integrated chat system (inbox + window)
- Event calendar management
- Lead monitoring dashboard
- Quick booking creation
```

**Key Features:**
- 📊 **Real-time Lead Monitoring**
- 💬 **Integrated Chat System**
- 📅 **Event Calendar View**
- ⚡ **Quick Action Buttons**

#### **2. ChatPage.jsx**
**Purpose:** Dedicated chat interface for customer communication
```jsx
Layout: Side-by-side chat inbox and conversation window
Components: ChatInbox + ChatWindow
Responsive: Optimized for full-screen chat experience
```

#### **3. QuoteSession.jsx**
**Purpose:** Customer-facing quote creation interface
```jsx
Features:
- Token-based session authentication
- Tier selection (Silver/Gold/Platinum)
- Dish selection with category limits
- Add-on selection functionality
- Quote submission to backend
```

**Customer Journey:**
1. 🔐 **Session Validation** - Token verification
2. 🎯 **Tier Selection** - Choose pricing tier
3. 🍽️ **Dish Selection** - Select from available dishes
4. ➕ **Add-ons** - Choose additional items
5. 📋 **Quote Submission** - Send to admin for review

#### **4. MenuModule.jsx**
**Purpose:** Menu and pricing management interface
```jsx
Features:
- Category management (drag & drop)
- Tier configuration
- Dish assignment to tiers
- Pricing adjustments
```

#### **5. DishManager.jsx**
**Purpose:** Dish inventory and catalog management
```jsx
Features:
- Add/edit/delete dishes
- Category assignment
- Price management
- Availability controls
```

### **🧱 UI Components**

#### **1. ChatInbox.jsx**
**Purpose:** Customer lead list with filtering and search
```jsx
Key Features:
- 🔍 Search functionality (name, phone, event type)
- 🏷️ Status filtering (All, New, In Progress, Converted)
- 📅 Event type filtering
- 🔄 Sort options (Event Date, Created Date, Name)
- 📱 Lead selection for chat
```

#### **2. ChatWindow.jsx**
**Purpose:** Real-time messaging interface with customers
```jsx
Key Features:
- 💬 Real-time message display
- 📤 Message sending via WhatsApp API
- 🔄 Auto-refresh for new messages
- 📱 Mobile-optimized chat bubbles
- 🟢 Online status indicator
```

**Message Flow:**
1. 📥 **Load Messages** - Fetch conversation history
2. 💬 **Display Chat** - Render message bubbles
3. ✍️ **Type Message** - Admin input interface
4. 📤 **Send Message** - API call to backend
5. 📱 **WhatsApp Delivery** - Message sent to customer

#### **3. EventManager.jsx**
**Purpose:** Calendar view for event scheduling
```jsx
Features:
- 📅 Calendar visualization
- 📋 Event date selection
- 🎯 Lead assignment to dates
- 📊 Event overview dashboard
```

#### **4. TierViewer.jsx**
**Purpose:** Pricing tier management with drag-and-drop
```jsx
Features:
- 🎯 Create/edit/delete tiers
- 📋 Category assignment to tiers
- 🔢 Dish limit configuration
- 💰 Price per plate setting
- 🎨 Drag-and-drop interface
```

**Tier Structure:**
```jsx
Tier Object:
{
  name: "Gold",
  pricePerPlate: 500,
  categories: [
    {
      category: "Main Course",
      maxSelectable: 3,
      dishIds: ["dish1", "dish2", "dish3"]
    }
  ]
}
```

#### **5. CategoryViewer.jsx**
**Purpose:** Food category management
```jsx
Features:
- 📝 Add/edit/delete categories
- 🔧 Flexibility settings
- 🎨 Drag-and-drop to tiers
- 🍽️ Linked dish management
```

#### **6. AddEventModal.jsx**
**Purpose:** Quick lead creation form
```jsx
Form Fields:
- 👤 Customer name
- 📞 Phone number
- 🎉 Event type
- 📅 Event date
- 👥 Number of guests
- 📍 Location
```

**Form Submission Flow:**
1. ✅ **Validation** - Required field checks
2. 📤 **API Call** - POST to /api/leads
3. 🔗 **Token Generation** - Create quote session
4. 📱 **WhatsApp Link** - Send quote link to customer

#### **7. QuoteBubble.jsx**
**Purpose:** Quote display component in chat
```jsx
Features:
- 📋 Quote summary display
- 💰 Price breakdown
- 🎯 Tier information
- 🍽️ Selected dishes list
```

#### **8. QuoteDetails.jsx**
**Purpose:** Detailed quote view for admin
```jsx
Features:
- 📊 Complete quote breakdown
- 💰 Pricing calculations
- 📝 Quote modification options
- 📤 Quote approval/rejection
```

#### **9. ChatProfile.jsx**
**Purpose:** Customer profile sidebar in chat
```jsx
Features:
- 👤 Customer information
- 📱 Contact details
- 🎉 Event information
- 📋 Quote history
- 📊 Interaction timeline
```

#### **10. EventCalendernew.jsx**
**Purpose:** Enhanced calendar component
```jsx
Features:
- 📅 Interactive calendar grid
- 🎯 Event highlighting
- 📱 Date selection
- 🔄 Month navigation
- 📊 Event density indicators
```

---

## 🔄 **State Management**

### **Global State - Context API**

#### **SelectedLeadContext.jsx**
**Purpose:** Manages currently selected customer lead across components
```jsx
// Context Provider
export const SelectedLeadProvider = ({ children }) => {
  const [selectedLead, setSelectedLead] = useState(null);
  return (
    <SelectedLeadContext.Provider value={{ selectedLead, setSelectedLead }}>
      {children}
    </SelectedLeadContext.Provider>
  );
};

// Hook for consuming context
export const useSelectedLead = () => useContext(SelectedLeadContext);
```

---

## 💅 **Styling Architecture**

### **CSS Organization**
The project uses a hybrid approach combining:
1. **Component-specific CSS files** in `/src/styles/`
2. **Inline styles** for dynamic styling
3. **TailwindCSS utilities** for rapid development

### **CSS Files Structure**
| File | Purpose | Components |
|------|---------|------------|
| `dashboard.css` | Main dashboard layout | Dashboard.jsx |
| `chat.css` | Chat interface styling | ChatPage.jsx |
| `chatwindow.css` | Chat window specific styles | ChatWindow.jsx |
| `chatprofile.css` | Customer profile sidebar | ChatProfile.jsx |
| `CategoryViewer.css` | Category management interface | CategoryViewer.jsx |
| `TierViewer.css` | Tier management interface | TierViewer.jsx |
| `calender.css` | Calendar component styles | EventCalendernew.jsx |
| `addEventModal.css` | Modal dialog styles | AddEventModal.jsx |
| `quotebubble.css` | Quote display bubbles | QuoteBubble.jsx |
| `quotedetails.css` | Quote details view | QuoteDetails.jsx |
| `quotesession.css` | Customer quote session | QuoteSession.jsx |
| `loginform.css` | Login interface (legacy) | - |
| `loginpage.css` | Login page layout (legacy) | - |
| `Navbar.css` | Navigation component (legacy) | - |



---

## 🔐 **Authentication & Security**

### **Token-based Sessions**
The QuoteSession component uses token-based authentication:
```jsx
const { token } = useParams();

useEffect(() => {
  const validateSession = async () => {
    try {
      const response = await API.get(`/leads/session/${token}`);
      setLead(response.data);
    } catch (error) {
      // Handle invalid token
      navigate('/');
    }
  };
  validateSession();
}, [token]);
```
---


### **Development Issues**

#### **1. API Connection Problems**
**Problem:** API calls failing in development
**Solution:**
```javascript
// Check vite.config.js proxy settings
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      secure: false
    }
  }
}
```

#### **2. React Context Not Working**
**Problem:** Context values not updating across components
**Solution:**
```jsx
// Ensure SelectedLeadProvider wraps all components that need it
<SelectedLeadProvider>
  <Routes>
    {/* All routes that need context */}
  </Routes>
</SelectedLeadProvider>
```

#### **3. Chat Messages Not Updating**
**Problem:** Real-time messages not appearing
**Solution:**
```jsx
// Implement polling for real-time updates
useEffect(() => {
  const interval = setInterval(() => {
    if (selectedLead) {
      fetchMessages(selectedLead._id);
    }
  }, 3000); // Poll every 3 seconds

  return () => clearInterval(interval);
}, [selectedLead]);
```

---


## 🔄 **Future Enhancements**

### **Planned Features**
1. 🔔 **Real-time Notifications** - WebSocket integration
2. 📱 **PWA Support** - Offline functionality
3. 🌙 **Dark Mode** - Theme switching
4. 📊 **Advanced Analytics** - Business intelligence dashboard
5. 🎨 **Drag & Drop Builder** - Visual menu composer
6. 📄 **PDF Generation** - Quote and invoice exports
7. 💳 **Payment Integration** - Online payment processing
8. 📸 **Image Upload** - Dish photos and gallery

### **Technical Improvements**
1. 🧪 **Unit Testing** - Jest and React Testing Library
2. 🔍 **TypeScript Migration** - Enhanced type safety
3. 🎯 **Error Boundaries** - Better error handling
4. 📱 **Mobile App** - React Native version
5. 🔒 **Enhanced Security** - JWT authentication
6. 🚀 **Performance Optimization** - Code splitting and lazy loading

---

## 🏁 **Getting Started**

### **Prerequisites**
- Node.js v16+ installed
- npm v8+ installed
- Backend server running on port 3000

### **Installation Steps**
```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser to http://localhost:5173
```

### **First Time Setup**
1. ✅ Ensure backend is running on `http://localhost:3000`
2. ✅ Verify API proxy configuration in `vite.config.js`
3. ✅ Check that all dependencies are installed
4. ✅ Test basic API connectivity through browser network tab

---

This comprehensive frontend documentation provides everything needed to understand, develop, and maintain the ChefManage React application. The architecture is designed for scalability, maintainability, and excellent user experience in managing catering business operations.
