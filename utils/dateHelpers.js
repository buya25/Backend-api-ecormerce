// utils/dateHelpers.js
const getStartOfDay = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const getStartOfWeek = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);
    return getStartOfDay(startOfWeek);
};

const getStartOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
};

const getStartOfYear = (date) => {
    return new Date(date.getFullYear(), 0, 1);
};

module.exports = {
    getStartOfDay,
    getStartOfWeek,
    getStartOfMonth,
    getStartOfYear
};