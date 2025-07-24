const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

const validateUserCreation = [
  body('UserID').notEmpty().withMessage('UserID is required'),
  body('EmpID').notEmpty().withMessage('EmpID is required'),
  body('TenentID').notEmpty().withMessage('TenentID is required'),
  body('Name').notEmpty().withMessage('Name is required'),
  body('Status').isIn(['Enabled', 'Disabled']).withMessage('Status must be Enabled or Disabled'),
  handleValidationErrors
];

const validateUserUpdate = [
  body('EmpID').optional().notEmpty().withMessage('EmpID cannot be empty'),
  body('TenantID').optional().notEmpty().withMessage('TenantID cannot be empty'),
  body('Name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('Status').optional().isIn(['Enabled', 'Disabled']).withMessage('Status must be Enabled or Disabled'),
  handleValidationErrors
];

module.exports = {
  validateUserCreation,
  validateUserUpdate
};
