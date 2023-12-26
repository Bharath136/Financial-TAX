const paypal = require('paypal-rest-sdk');
const dotenv = require('dotenv');
const {updateTaxreturnDocumentPaymentStatus} = require('../controllers/taxReturnDocuments');
const client = require('../database/connection');
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
    const { user, amount,document_id } = req.body;
    console.log(req.body)
    try {
        const paymentData = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal',
            },
            redirect_urls: {
                return_url: 'http://localhost:3000/user/tax-return/success',
                cancel_url: 'http://localhost:3000/user/tax-return/cancel',
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

        paypal.payment.create(paymentData, async (error, payment) => {
            if (error) {
                res.status(500).json({ error: `Failed to create tax return payment: ${error.message}` });
            } else {
                const approvalUrl = payment.links.find(link => link.rel === 'approval_url').href;
                const paymentId = payment.id; // Extract payment ID

                const createPaymentDetails = `
                    INSERT INTO payments(user_id, payment_id,amount,date,document_id)
                    VALUES($1,$2,$3,$4,$5)
                `
                const user_id = user.user_id
                const response = await client.query(createPaymentDetails, [user_id,paymentId,amount,new Date(),document_id])
                

                res.json({ approvalUrl, paymentId });
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
        const { paymentId, payerId } = req.query;

        const executeData = {
            payer_id: payerId,
        };

        const response = await client.query(`
            UPDATE payments SET payer_id = $1 WHERE payment_id = $2
        `, [payerId, paymentId])
        console.log(response.rows)

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

const paymentDetails = async (req, res) => {
    const { userId, paymentAmount, updatedBy, taxReturnId, payerId, paymentId } = req.body;
    console.log(req.body)

    try {
        const result = await client.query(
            'INSERT INTO payments (user_id, payment_id, payer_id, amount, date) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *',
            [userId, paymentId, payerId, paymentAmount]
        );
        console.log(result)

        await updateTaxreturnDocumentPaymentStatus(taxReturnId, updatedBy, 'Paid');

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getAllPaymentDetails = async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM payments');

        res.json(result.rows);
    } catch (error) {
        console.error('Error retrieving all payment details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getPaymentDetails = async (req, res) => {
    const { paymentId } = req.params; // Assuming paymentId is part of the route parameters

    try {
        const result = await client.query(
            'SELECT * FROM payments WHERE payment_id = $1',
            [paymentId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error retrieving payment details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getPaymentDetailsByUserId = async (req, res) => {
    const id = req.params.id; 

    try {
        const result = await client.query(
            'SELECT * FROM payments WHERE user_id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        res.json(result.rows);
    } catch (error) {
        console.error('Error retrieving payment details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    createTaxReturnPayment,
    executeTaxReturnPayment,
    paymentDetails,
    getAllPaymentDetails,
    getPaymentDetailsByUserId
};
