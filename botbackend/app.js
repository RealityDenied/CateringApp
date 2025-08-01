const cors = require('cors');

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const dishRoutes = require('./routes/dishRoutes');
const menuRoutes = require('./routes/menuRoutes');
const tierRoutes = require('./routes/tierRoutes');
const messageRoutes = require('./routes/messageRoutes');
const leadRoutes = require('./routes/leadRoutes');
const whatsappbotRoutes = require('./routes/whatsappbotRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const quoteRoutesNew = require('./routes/quoteRoutesNew');






const app = express();



//  Use Express's built-in body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB error:', err));


app.use('/api/dishes', dishRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/leads', leadRoutes);
app.use('/whatsappbot', whatsappbotRoutes);

//working routes latest from here
app.use('/api/tiers', tierRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/quotesNew', quoteRoutesNew);

app.use('/api/messages', messageRoutes);

app.get('/api', (req, res) => {
  res.send('✅ API root reached.');
});

// ✅ Config endpoint to expose CLIENT_URL
app.get('/api/config', (req, res) => {
  res.json({
    CLIENT_URL: process.env.CLIENT_URL
  });
});

// ✅ Root route to test server
app.get('/', (req, res) => {
    res.send('Treat Caterers WhatsApp Bot is running 🚀');
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
