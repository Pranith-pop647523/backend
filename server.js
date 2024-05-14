const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// SQLite connection
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'fraser-tracker.db'
});

const Sighting = sequelize.define('Sighting', {
    time: { type: DataTypes.DATE, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    person: { type: DataTypes.STRING, allowNull: false },
});

// Sync the database
sequelize.sync()
    .then(() => {
        console.log('Connected to SQLite');
    })
    .catch((err) => {
        console.error('Error connecting to SQLite:', err.message);
    });

// Routes
app.get('/api/sightings', async (req, res) => {
    try {
        const sightings = await Sighting.findAll();
        res.json(sightings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sightings' });
    }
});

app.post('/api/sightings', async (req, res) => {
    try {
        const newSighting = await Sighting.create(req.body);
        const sightings = await Sighting.findAll();
        res.json(sightings);
    } catch (error) {
        res.status(500).json({ message: 'Error adding sighting' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
