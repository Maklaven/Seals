const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;
const SEALS_FILE = path.join(__dirname, 'seals.json');

// Enable CORS for all routes
app.use(cors());

// Parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' and 'uploads' folders
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

// Function to read seals data from JSON file
const readSealsData = () => {
    if (fs.existsSync(SEALS_FILE)) {
        const data = fs.readFileSync(SEALS_FILE);
        return JSON.parse(data);
    } else {
        return [];
    }
};

// Function to write seals data to JSON file
const writeSealsData = (data) => {
    fs.writeFileSync(SEALS_FILE, JSON.stringify(data, null, 2));
};

// Route to get all seals
app.get('/api/seals', (req, res) => {
    const seals = readSealsData();
    res.json(seals);
});

// Route to add a new seal
app.post('/api/seals', upload.single('sealImage'), (req, res) => {
    try {
        const { sealTitle: name, sealDescription: description } = req.body;
        const imageUrl = req.file ? req.file.path : '';

        if (!name || !description || !imageUrl) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const seals = readSealsData();
        const newSeal = {
            id: uuidv4(), 
            name,
            description,
            imageUrl
        };
        seals.push(newSeal);
        writeSealsData(seals);

        res.status(201).json(newSeal);
    } catch (error) {
        console.error('Error while adding a new seal:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
