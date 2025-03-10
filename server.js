const express = require('express');
const path = require('path');
const { MongoClient } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 1337;
const __dirname = path.resolve();

// Middleware to parse JSON request bodies
app.use(express.json());

// Connect to the database
const uri = "mongodb+srv://u23692619:Jaco%26u%24%401@flip.rt4rm.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

client.connect().then(() => {
    console.log('Connected to the database');

    const db = client.db('OomGawie');
    const users = db.collection('clientInfo');

    // API endpoint for registration
    app.post('/api/register', async (req, res) => {
        try {
            const { firstName, lastName, password, email, phoneNumber, SAID } = req.body;

            const newUser = {
                firstName,
                lastName,
                password,
                email,
                phoneNumber,
                SAID
                
            };

            console.log('about to check if user exists'); 

            // Check if user already exists
            const existingUser = await users.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            console.log('user does not exist yet'); 
            console.log('going to insert user');
            const result = await users.insertOne(newUser);

            res.status(201).json({ message: 'User registered successfully', userId: result.insertedId });
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    // API endpoint for login
    app.post('/api/login', async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            const user = await users.findOne({ email, password });
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            res.status(200).json({ message: 'Login successful' });
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    // API endpoint to get user profile
    app.get('/api/profile/:email', async (req, res) => {
        try {
            const email = req.params.email;
            const user = await users.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json(user);
        } catch (error) {
            console.error('Error getting profile info:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    
    // API endpoint to update user information
    app.put('/api/updateUserInfo', async (req, res) => {
        const { email, primaryResidence, motorVehicles, properties, cashAccounts, companies, shortTermLoans, personalLoans, lifestyleExpenses } = req.body;

        try {
            // Find the user by email
            const user = await users.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Update the user information
            await users.updateOne(
                { email },
                {
                    $set: {
                        primaryResidence,
                        motorVehicles,
                        properties,
                        cashAccounts,
                        companies,
                        shortTermLoans,
                        personalLoans,
                        lifestyleExpenses
                    }
                }
            );

            // Send a success response
            res.status(200).json({ message: 'User information updated successfully' });
        } catch (error) {
            console.error('Error updating user information:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Define explicit routes for each page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/RegisterUser', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/Profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// PORT TO LISTEN TO
app.listen(PORT, () => {
    console.log(`Listening on localhost:${PORT}`);
});