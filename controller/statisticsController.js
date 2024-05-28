const { Order } = require('../models/order');
const { Product } = require('../models/product');
const { calculateSalesAndRevenue,
        calculateTotalStock,
        calculateDaysOnHand, 
        calculateInventoryAccuracy,
        calculateCOGS,
        calculateGMROI,
        calculateStockouts,
        calculateOverstockAndObsolescence,
        calculateSupplierPerformance} = require('../utils/inventoryHelpers');

// Function to calculate inventory statistics
const getInventoryStatistics = async (req, res) => {
    try {
        const products = await Product.find();

        const totalStock = calculateTotalStock(products);

        const orders = await Order.find().populate({
            path: 'orderItems',
            populate: {
                path: 'product',
                model: 'Product'
            }
        });

        const { totalSales, totalRevenue } = calculateSalesAndRevenue(orders);

        const inventoryTurnoverRate = totalSales / totalStock;

        const averageDaysOnHand = calculateDaysOnHand(products, orders);

        const inventoryAccuracyRate = calculateInventoryAccuracy(products);

        const totalCOGS = calculateCOGS(orders);

        const gmroi = calculateGMROI(totalRevenue, totalCOGS);

        const { stockoutOccurrences, averageStockoutDuration } = calculateStockouts(products);

        const { overstockLevels, obsolescenceRisks } = calculateOverstockAndObsolescence(products);

        const { averageLeadTime, averageDefectRate } = calculateSupplierPerformance(products);

        res.json({
            totalStock,
            inventoryTurnoverRate,
            totalRevenue,
            averageDaysOnHand,
            inventoryAccuracyRate,
            totalCOGS,
            gmroi,
            stockoutOccurrences,
            averageStockoutDuration,
            overstockLevels,
            obsolescenceRisks,
            averageLeadTime,
            averageDefectRate

        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getInventoryStatistics };