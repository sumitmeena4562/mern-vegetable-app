import { validationResult } from 'express-validator';

const validate = (req, res, next) => {
    const errors = validationResult(req);
    
    if (errors.isEmpty()) {
        return next();
    }
    
    // Format errors
    const formattedErrors = errors.array().map(error => ({
        field: error.path,
        message: error.msg
    }));
    
    return res.status(400).json({
        success: false, // Humne 'status' ko 'success' se replace kiya taaki server.js se match kare
        message: 'Validation failed',
        errors: formattedErrors
    });
};

export default validate;