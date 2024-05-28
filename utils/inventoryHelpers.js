// Helper function to calculate supplier performance metrics
const calculateSupplierPerformance = (products) => {
    let totalLeadTime = 0;
    let totalDefectRate = 0;
    let totalDeliveries = 0;

    products.forEach(product => {
        if (product.supplierData) { // Assume you have supplierData field in the product schema
            totalLeadTime += product.supplierData.leadTime;
            totalDefectRate += product.supplierData.defectRate;
            totalDeliveries++;
        }
    });

    const averageLeadTime = totalDeliveries > 0 ? totalLeadTime / totalDeliveries : 0;
    const averageDefectRate = totalDeliveries > 0 ? totalDefectRate / totalDeliveries : 0;

    return {
        averageLeadTime,
        averageDefectRate
    };
};


// Helper function to calculate overstock levels and potential obsolescence risks
const calculateOverstockAndObsolescence = (products) => {
    const overstockThreshold = 100; // Define a threshold for overstock
    const obsolescenceDays = 365; // Define a threshold for obsolescence risk in days

    let overstockLevels = 0;
    let obsolescenceRisks = 0;

    products.forEach(product => {
        if (product.countInStock > overstockThreshold) {
            overstockLevels++;
        }
        const daysInInventory = (Date.now() - product.dateCreated) / (1000 * 60 * 60 * 24);
        if (daysInInventory > obsolescenceDays) {
            obsolescenceRisks++;
        }
    });

    return {
        overstockLevels,
        obsolescenceRisks
    };
};

// Helper function to calculate stockout occurrences and duration
const calculateStockouts = (products) => {
    let stockoutOccurrences = 0;
    let totalStockoutDuration = 0;

    products.forEach(product => {
        if (product.stockoutDates) { // Assume you have a stockoutDates field in the product schema
            stockoutOccurrences += product.stockoutDates.length;
            product.stockoutDates.forEach(duration => {
                totalStockoutDuration += duration;
            });
        }
    });

    return {
        stockoutOccurrences,
        averageStockoutDuration: stockoutOccurrences > 0 ? totalStockoutDuration / stockoutOccurrences : 0
    };
};

// Helper function to calculate COGS, Cost of goods sold
const calculateCOGS = (orders) => {
    let totalCOGS = 0;

    orders.forEach(order => {
        order.orderItems.forEach(item => {
            totalCOGS += item.quantity * item.product.price; // Assume product has a cost field
        });
    });

    return totalCOGS;
};

// Helper function to calculate GMROI, Gross Margin Return on Investment
const calculateGMROI = (totalRevenue, totalCOGS) => {
    const grossProfit = totalRevenue - totalCOGS;
    const gmroi = grossProfit / totalCOGS;
    return gmroi;
};

// Helper function to calculate the inventory accuracy rate
const calculateInventoryAccuracy = (products) => {
    let totalExpected = 0;
    let totalActual = 0;

    products.forEach(product => {
        totalExpected += product.expectedCount; // Assume you have expectedCount field
        totalActual += product.countInStock;
    });

    const accuracyRate = (totalActual / totalExpected) * 100;
    return accuracyRate;
};

// Helper function to calculate the average days on hand
const calculateDaysOnHand = (products, orders) => {
    let totalDaysOnHand = 0;
    let totalSoldItems = 0;

    orders.forEach(order => {
        order.orderItems.forEach(item => {
            const product = products.find(p => p._id.equals(item.product._id));
            if (product) {
                const daysOnHand = (order.dateOrdered - product.dateCreated) / (1000 * 60 * 60 * 24); // Convert ms to days
                totalDaysOnHand += daysOnHand * item.quantity;
                totalSoldItems += item.quantity;
            }
        });
    });

    const averageDaysOnHand = totalSoldItems > 0 ? totalDaysOnHand / totalSoldItems : 0;
    return averageDaysOnHand;
};

// Helper function to calculate total stock levels
const calculateTotalStock = (products) => {
    return products.reduce((acc, product) => acc + product.countInStock, 0);
};

// Helper function to calculate total sales and revenue
const calculateSalesAndRevenue = (orders) => {
    let totalSales = 0;
    let totalRevenue = 0;

    orders.forEach(order => {
        order.orderItems.forEach(item => {
            totalSales += item.quantity;
            totalRevenue += item.quantity * item.product.price;
        });
    });

    return { totalSales, totalRevenue };
};

// Export the helper functions
module.exports = {
    calculateTotalStock,
    calculateSalesAndRevenue,
    calculateDaysOnHand,
    calculateInventoryAccuracy,
    calculateGMROI,
    calculateCOGS,
    calculateStockouts,
    calculateOverstockAndObsolescence,
    calculateSupplierPerformance
};
