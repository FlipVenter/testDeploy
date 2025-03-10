// filepath: d:\coding challenges\testDeploy\netlify\functions\updateUserInfo.js
const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://u23692619:Jaco%26u%24%401@flip.rt4rm.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'PUT') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    try {
        const { email, primaryResidence, motorVehicles, properties, cashAccounts, companies, shortTermLoans, personalLoans, lifestyleExpenses } = JSON.parse(event.body);

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

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'User information updated successfully' }),
        };
    } catch (error) {
        console.error('Error updating user information:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' }),
        };
    }
};