// filepath: d:\coding challenges\testDeploy\netlify\functions\profile.js
const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://u23692619:Jaco%26u%24%401@flip.rt4rm.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    try {
        const email = event.queryStringParameters.email;

        if (!email) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Email is required' }),
            };
        }

        await client.connect();
        const db = client.db('OomGawie');
        const users = db.collection('clientInfo');

        const user = await users.findOne({ email });
        if (!user) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'User not found' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(user),
        };
    } catch (error) {
        console.error('Error getting profile info:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' }),
        };
    }
};