const paypal = require('paypal-rest-sdk');
const dotenv = require('dotenv');
dotenv.config();

const paypal_client_id = process.env.PAYPAL_CLIENT_ID;
const paypal_client_secret = process.env.PAYPAL_CLIENT_SECRET;

// Configure PayPal with your credentials
paypal.configure({
    mode: 'sandbox', // Set to 'live' for production
    client_id: paypal_client_id,
    client_secret: paypal_client_secret,
});

// Create a payment
const createPayment = async (req, res) => {
    const { user, amount } = req.body;
    try {
        const paymentData = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal',
            },
            redirect_urls: {
                return_url: 'http://localhost:3000/success', // Replace with your success URL
                cancel_url: 'http://localhost:3000/cancel', // Replace with your cancel URL
            },
            transactions: [{
                item_list: {
                    items: [{
                        name: `Payment for ${user.first_name}'s item`, // Dynamic item name based on user
                        sku: 'item001',
                        price: amount, // Use the dynamic amount from the user
                        currency: 'USD',
                        quantity: 1,
                    }],
                },
                amount: {
                    total: amount, // Use the dynamic amount from the user
                    currency: 'USD',
                },
                description: `Payment for ${user.first_name}'s item`, // Dynamic description based on user
            }],
        };

        paypal.payment.create(paymentData, (error, payment) => {
            if (error) {
                res.status(500).json({ error: `Failed to create payment: ${error.message}` });
            } else {
                const approvalUrl = payment.links.find(link => link.rel === 'approval_url').href;
                res.json({ approvalUrl });
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Execute the payment
const executePayment = async (req, res) => {
    try {
        const { paymentId, payerId } = req.body;

        const executeData = {
            payer_id: payerId,
        };

        paypal.payment.execute(paymentId, executeData, (error, payment) => {
            if (error) {
                res.status(500).json({ error: `Failed to execute payment: ${error.message}` });
            } else {
                res.json({ payment });
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    createPayment,
    executePayment
};
