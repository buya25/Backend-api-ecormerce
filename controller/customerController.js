const { User } = require("../models/user");
const { calculateAOV,
        calculateCLV,
        segmentCustomers, 
        filterCustomersByCLV,
        paginateResults} = require("../utils/customerHelpers");


const getCustomerStatistics = async (req, res) => {
    try {
        const { customer_type, time_frame, segmentation, min_clv, max_clv, page = 1, limit = 10 } = req.query;

        // Fetch customers based on query parameters
        let query = {};
        if (customer_type) {
            const dateThreshold = new Date();
            if (time_frame === 'last_30_days') {
                dateThreshold.setDate(dateThreshold.getDate() - 30);
            } else if (time_frame === 'last_quarter') {
                dateThreshold.setMonth(dateThreshold.getMonth() - 3);
            }
            query.dateCreated = { $gte: dateThreshold };

            if (customer_type === 'new') {
                query.totalOrders = { $eq: 1 };
            } else if (customer_type === 'returning') {
                query.totalOrders = { $gt: 1 };
            }
        }
        console.log(customer_type)
        let customers = await User.find(query).populate('purchaseHistory');

        if (segmentation) {
            customers = segmentCustomers(customers, segmentation);
        }
        if (min_clv || max_clv) {
            customers = filterCustomersByCLV(customers, min_clv, max_clv);
        }

        const totalRecords = customers.length;
        customers = paginateResults(customers, parseInt(page), parseInt(limit));

        const customerData = customers.map(customer => ({
            id: customer._id,
            name: customer.name,
            email: customer.email,
            clv: calculateCLV(customer),
            aov: calculateAOV(customer),
            totalSpent: customer.totalSpent,
            totalOrders: customer.totalOrders
        }));

        res.json({
            customerData,
            totalRecords,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(totalRecords / parseInt(limit))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getCustomerStatistics
};
