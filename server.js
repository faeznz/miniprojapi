const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

mongoose.connect('mongodb+srv://faeznz:faeznz@data.h3xudui.mongodb.net/miniproj?retryWrites=true&w=majority')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB:', error);
    });

// Define the item schema and model (assuming you have an Item model)
const itemSchema = new mongoose.Schema({
    image: String,
    nama: String,
    harga: String,
    keterangan: String,
});

const Item = mongoose.model('Item', itemSchema);

app.get('/item', async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});

app.delete('/item/:id', async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

app.post('/item', async (req, res) => {
    try {
        const newItem = new Item(req.body);
        const savedItem = await newItem.save();
        res.json(savedItem);
        res.status(200).json({ message: 'Item post successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add item' });
    }
});

app.put('/item/:id', async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json({ message: 'Item update successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update item' });
    }
});


app.get('/', (req, res) => {
    res.send('API for llaboooApp');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
