// src/middleware/validateRequest.js
/**
 * Generic high-performance schema validator for Express requests.
 * @param {Object} schema - Validation schema with rules for req.body, req.query, or req.params
 * @returns {Function} Express middleware
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    const errors = [];

    // Helper to validate a target object against schema rules
    const validateTarget = (target, rules, source) => {
      if (!rules) return;

      for (const [field, rule] of Object.entries(rules)) {
        const val = target[field];

        // Required check
        if (rule.required && (val === undefined || val === null || val === '')) {
          errors.push({
            field,
            source,
            message: rule.message || `${field} is required in ${source}`
          });
          continue;
        }

        // Skip type checks if optional and not provided
        if (val === undefined || val === null || val === '') continue;

        // Type check
        if (rule.type) {
          if (rule.type === 'number' && (isNaN(Number(val)) || typeof val === 'boolean')) {
            errors.push({ field, source, message: `${field} must be a valid number` });
          } else if (rule.type === 'array' && !Array.isArray(val)) {
            errors.push({ field, source, message: `${field} must be an array` });
          } else if (rule.type === 'string' && typeof val !== 'string') {
            errors.push({ field, source, message: `${field} must be a string` });
          } else if (rule.type === 'date' && isNaN(Date.parse(val))) {
            errors.push({ field, source, message: `${field} must be a valid ISO date` });
          }
        }

        // Min/Max for numbers or string length
        if (rule.min !== undefined) {
          if (rule.type === 'number' && Number(val) < rule.min) {
            errors.push({ field, source, message: `${field} cannot be less than ${rule.min}` });
          } else if (rule.type === 'string' && String(val).length < rule.min) {
            errors.push({ field, source, message: `${field} must be at least ${rule.min} characters` });
          } else if (rule.type === 'array' && val.length < rule.min) {
            errors.push({ field, source, message: `${field} must contain at least ${rule.min} items` });
          }
        }

        // Enum / allowed values check
        if (rule.enum && Array.isArray(rule.enum)) {
          if (!rule.enum.includes(val)) {
            errors.push({
              field,
              source,
              message: `${field} must be one of: ${rule.enum.join(', ')}`
            });
          }
        }
      }
    };

    if (schema.body) validateTarget(req.body, schema.body, 'body');
    if (schema.query) validateTarget(req.query, schema.query, 'query');
    if (schema.params) validateTarget(req.params, schema.params, 'params');

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed on request parameters',
        errors
      });
    }

    next();
  };
};

module.exports = validateRequest;
