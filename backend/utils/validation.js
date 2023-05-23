const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    if(!validationErrors.isEmpty()){
        const errors = {};
        console.log(validationErrors.array());
        validationErrors.array().forEach(err => errors[err.path] = err.msg);

        const err = Error('Bad Request');
        err.errors = errors;
        err.status = 400;
        err.title = 'Bad Request.';
        next(err);
    }

    next();
}

module.exports = { handleValidationErrors } ;
