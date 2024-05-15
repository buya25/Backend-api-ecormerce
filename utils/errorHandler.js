function errorHandler(err, req, res, next) {
    //error handler for unauthorized
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ message: 'Unauthorized' });
    }
    //error handler for other errors
    else {
        res.status(500).json({ message: err });
    }
    //validationError
    if (err.name === 'ValidationError') {
        res.status(422).json({ message: err.message });
    }
}

module.exports = errorHandler;
