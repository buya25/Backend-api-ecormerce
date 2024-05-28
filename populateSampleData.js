const mongoose = require('mongoose');
const { Product } = require('./models/product');
const { Order } = require('./models/order');
const orderItems = require('./models/order-items');

const sampleProducts = [
    {
        name: 'Product 1',
        description: 'Description for product 1',
        richDescription: 'Rich description for product 1',
        image: 'image1.jpg',
        images: ['image1.jpg', 'image1-2.jpg'],
        brand: 'Brand 1',
        price: 100,
        category: '6645ac7be15373c698dd8869', // Update with actual category ID
        expectedCount: 50,
        countInStock: 40,
        rating: 4,
        numviews: 100,
        isFeatured: true,
        purchases: 10,
        dateCreated: new Date(),
        stockoutDates: [2, 5], // Add stockout dates if applicable
        supplierData: { leadTime: 5, defectRate: 0.02 }, // Add supplier data if applicable
    },
    // Add more sample products as needed
];

const sampleOrders = [
    {
        orderItems: [], // Will be populated later
        shippingAddress1: '123 Main St',
        shippingAddress2: '',
        city: 'Anytown',
        zip: '12345',
        country: 'USA',
        phone: '555-555-5555',
        status: 'Pending',
        totalPrice: 200,
        user: '6651dda9c4518ffe824df21a', // Update with actual user ID
        dateOrdered: new Date(),
    },
    // Add more sample orders as needed
];

const createSampleData = async () => {
    await mongoose.connect(process.env.DB_CONNECT_STRING_URL, {
        dbName: 'e-cormerce-api'
    });

    try {
        // Clear existing data
        await Product.deleteMany({});
        await Order.deleteMany({});
        await orderItems.deleteMany({});

        // Insert sample products
        const products = await Product.insertMany(sampleProducts);

        // Create sample order items and associate them with sample orders
        const sampleOrderItems = [
            { quantity: 2, product: products[0]._id },
            // Add more sample order items as needed
        ];
        const orderItems = await orderItems.insertMany(sampleOrderItems);

        sampleOrders[0].orderItems.push(orderItems[0]._id);
        // Add more order items to orders as needed

        // Insert sample orders
        await Order.insertMany(sampleOrders);

        console.log('Sample data inserted successfully');
    } catch (error) {
        console.error('Error inserting sample data:', error);
    } finally {
        await mongoose.disconnect();
    }
};

createSampleData();