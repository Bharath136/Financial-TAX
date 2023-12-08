const paypal = require('paypal-rest-sdk');



// Configure PayPal with your credentials
paypal.configure({
    mode: 'sandbox', // Set to 'live' for production
    client_id: 'YOUR_CLIENT_ID',
    client_secret: 'YOUR_CLIENT_SECRET',
});

// Create a payment
const createPayment = async (req, res) => {
    try {
        const paymentData = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal',
            },
            redirect_urls: {
                return_url: 'http://localhost:3000/api/success', // Replace with your success URL
                cancel_url: 'http://localhost:3000/api/cancel', // Replace with your cancel URL
            },
            transactions: [{
                item_list: {
                    items: [{
                        name: 'Sample Item',
                        sku: 'item001',
                        price: '10.00',
                        currency: 'USD',
                        quantity: 1,
                    }],
                },
                amount: {
                    total: '10.00',
                    currency: 'USD',
                },
                description: 'Payment for a sample item',
            }],
        };

        paypal.payment.create(paymentData, (error, payment) => {
            if (error) {
                res.status(500).json({ error: 'Failed to create payment' });
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
                res.status(500).json({ error: 'Failed to execute payment' });
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
}