const paypal = require('paypal-rest-sdk');
const dotenv = require('dotenv');
dotenv.config();

const paypalClientId = process.env.PAYPAL_CLIENT_ID;
const paypalClientSecret = process.env.PAYPAL_CLIENT_SECRET;

// Configure PayPal with your credentials
paypal.configure({
    mode: 'sandbox', // Set to 'live' for production
    client_id: paypalClientId,
    client_secret: paypalClientSecret,
});

// Create a payment for tax return
const createTaxReturnPayment = async (req, res) => {
    const { user, amount } = req.body;
    try {
        const paymentData = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal',
            },
            redirect_urls: {
                return_url: 'http://localhost:3000/tax-return/success', // Replace with your success URL for tax return
                cancel_url: 'http://localhost:3000/tax-return/cancel', // Replace with your cancel URL for tax return
            },
            transactions: [{
                item_list: {
                    items: [{
                        name: `Tax Return Payment for ${user.first_name}`,
                        sku: 'tax_return_item',
                        price: amount,
                        currency: 'USD',
                        quantity: 1,
                    }],
                },
                amount: {
                    total: amount,
                    currency: 'USD',
                },
                description: `Tax return payment for ${user.first_name}`,
            }],
        };

        paypal.payment.create(paymentData, (error, payment) => {
            if (error) {
                res.status(500).json({ error: `Failed to create tax return payment: ${error.message}` });
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

// Execute the tax return payment
const executeTaxReturnPayment = async (req, res) => {
    try {
        const { paymentId, payerId } = req.body;

        const executeData = {
            payer_id: payerId,
        };

        paypal.payment.execute(paymentId, executeData, (error, payment) => {
            if (error) {
                res.status(500).json({ error: `Failed to execute tax return payment: ${error.message}` });
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
    createTaxReturnPayment,
    executeTaxReturnPayment
};
