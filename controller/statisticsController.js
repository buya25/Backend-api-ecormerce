const { Order } = require('../models/order');
const { Product } = require('../models/product');

// Function to calculate inventory statistics
const getInventoryStatistics = async (req, res) => {
    try {
        // Get all products
        const products = await Product.find();

        // Calculate total stock levels
        const totalStock = products.reduce((acc, product) => acc + product.countInStock, 0);

        // Fetch all orders with related order items and products
        const orders = await Order.find().populate({
            path: 'orderItems',
            populate: {
                path: 'product',
                model: 'Product'
            }
        });

        
        // Calculate total sales and total revenue
        let totalSales = 0;
        let totalRevenue = 0;
        orders.forEach(order => {
            order.orderItems.forEach(item => {
                totalSales += item.quantity;
                totalRevenue += item.quantity * item.product.price;
            });
        });

        // Calculate inventory turnover rate
        const inventoryTurnoverRate = totalSales / totalStock;

        // Send response
        res.json({
            totalStock,
            inventoryTurnoverRate,
            totalRevenue
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getInventoryStatistics };