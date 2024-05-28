const mongoose = require('mongoose');

// Supplier Data Schema
const supplierDataSchema = mongoose.Schema({
    leadTime: {
        type: Number,
        required: true,
        min: 0
    },
    reliability: {
        type: Number, // Assuming reliability is a percentage (0 to 100)
        required: true,
        min: 0,
        max: 100
    },
    defectRate: {
        type: Number, // Assuming defect rate is a percentage (0 to 100)
        required: true,
        min: 0,
        max: 100
    }
});

module.exports = mongoose.model('SupplierData', supplierDataSchema);