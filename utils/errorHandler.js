function errorHandler(err, req, res, next) {
    //error handler for unauthorized
    if (err.name === 'UnauthorizedError') {
       return res.status(401).json({ message: 'Unauthorized' });
    }
    //validationError
    if (err.name === 'ValidationError') {
       return res.status(422).json({ message: err.message });
    }

    return res.status(500).json({message: err.message});
}

module.exports = errorHandler;
