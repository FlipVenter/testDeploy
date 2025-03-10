// filepath: d:\coding challenges\testDeploy\netlify\functions\register.js
const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://u23692619:Jaco%26u%24%401@flip.rt4rm.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    try {
        const { firstName, lastName, password, email, phoneNumber, SAID } = JSON.parse(event.body);

        const newUser = {
            firstName,
            lastName,
            password,
            email,
            phoneNumber,
            SAID
        };

        await client.connect();
        const db = client.db('OomGawie');
        const users = db.collection('clientInfo');

        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'User already exists' }),
            };
        }

        const result = await users.insertOne(newUser);

        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'User registered successfully', userId: result.insertedId }),
        };
    } catch (error) {
        console.error('Error registering user:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' }),
        };
    }
};