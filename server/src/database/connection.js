const { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'admin',
    database: 'FinancialTax',
});

client.connect()
    .then(() => {
        console.log("Database Connected!");
    })
    .catch((err) => {
        console.error("Error connecting to the database:", err);
    });

module.exports = client