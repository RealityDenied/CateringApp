const cors = require('cors');

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { sendBotMessage } = require('./utils/sendMessage');
const chrono = require('chrono-node');
const Fuse = require('fuse.js');
const Lead = require('./models/lead');

const dishRoutes = require('./routes/dishRoutes');
const menuRoutes = require('./routes/menuRoutes');

const eventTypes = ['Birthday', 'Wedding/Marriage', 'Engagement', 'Corporate Event', 'Others'];
const fuse = new Fuse(eventTypes, { threshold: 0.4 });

const leadRoutes = require('./routes/leadRoutes');

const quoteRoutes = require('./routes/quoteRoutes');

const whatsappbotRoutes = require('./routes/whatsappbotRoutes');



const app = express();



// ✅ Use Express's built-in body parsers
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
app.use('/api/quotes', quoteRoutes);
app.use('/whatsappbot', whatsappbotRoutes);

// ✅ Root route to test server
app.get('/', (req, res) => {
    res.send('Treat Caterers WhatsApp Bot is running 🚀');
});

// WhatsApp webhook
app.post('/whatsapp', async (req, res) => {
    console.log('Incoming webhook:', req.body);
    const message = req.body.Body?.trim();
    const from = req.body.From;

    if (!message) return res.sendStatus(200);

    if (message.toLowerCase() === 'hi') {
        await sendBotMessage(
            `Hi, this is Treat Caterers!\n\nPlease send your event details:\n\nName:\nContact Number:\nEvent Type:\nEvent Date:\nEvent Time:\nNumber of Guests:\nLocation:\n\nMenu: ${process.env.MENU_URL}`,
            from
        );
    } else if (message.toLowerCase().includes('name:') && message.toLowerCase().includes('contact number:')) {
        const lines = message.split('\n').map(line => line.trim());
        const data = {};
        lines.forEach(line => {
            const [key, value] = line.split(':');
            if (key && value) {
                data[key.trim().toLowerCase()] = value.trim();
            }
        });

        let matchedEventType = 'Others';
        const match = fuse.search(data['event type']);
        if (match.length > 0) {
            matchedEventType = match[0].item;
        }

        const dateTimeString = `${data['event date']} ${data['event time']}`;
        const eventDateTimeIST = chrono.parseDate(dateTimeString);
        const eventDateUTC = new Date(eventDateTimeIST.getTime() - 5.5 * 60 * 60 * 1000);

        try {
            const newLead = new Lead({
                phone: from,
                name: data['name'],
                contactNumber: Number(data['contact number']),
                eventType: matchedEventType,
                eventDate: eventDateUTC,
                numberOfGuests: Number(data['number of guests']),
                location: data['location']
            });

            await newLead.save();
            await sendBotMessage('✅ Thanks! Your event details have been saved successfully.', from);
        } catch (error) {
            console.error('MongoDB save error:', error);
            await sendBotMessage('❌ Error saving details. Please ensure all fields are filled correctly.', from);
        }
    }

    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
