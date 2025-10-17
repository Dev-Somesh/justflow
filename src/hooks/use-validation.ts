import { useState, useCallback, useMemo } from 'react';
import { validateEmail, validatePassword, validateProjectName, validateTaskTitle, sanitizeInput } from '@/utils/security';

export interface ValidationRule<T> {
  validate: (value: T) => { isValid: boolean; error?: string };
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const useValidation = <T>(
  initialValue: T,
  rules: ValidationRule<T>[]
) => {
  const [value, setValue] = useState<T>(initialValue);
  const [touched, setTouched] = useState(false);

  const validate = useCallback((val: T): ValidationResult => {
    const errors: string[] = [];
    
    for (const rule of rules) {
      const result = rule.validate(val);
      if (!result.isValid) {
        errors.push(result.error || rule.message || 'Invalid value');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }, [rules]);

  const validationResult = useMemo(() => validate(value), [value, validate]);

  const setValueAndValidate = useCallback((newValue: T) => {
    setValue(newValue);
    setTouched(true);
  }, []);

  const reset = useCallback(() => {
    setValue(initialValue);
    setTouched(false);
  }, [initialValue]);

  return {
    value,
    setValue: setValueAndValidate,
    touched,
    setTouched,
    validation: validationResult,
    isValid: validationResult.isValid,
    errors: validationResult.errors,
    reset
  };
};

// Predefined validation rules
export const validationRules = {
  email: (message?: string): ValidationRule<string> => ({
    validate: (value) => {
      if (!value || value.trim().length === 0) {
        return { isValid: false, error: 'Email is required' };
      }
      return validateEmail(value) 
        ? { isValid: true }
        : { isValid: false, error: message || 'Please enter a valid email address' };
    }
  }),

  password: (message?: string): ValidationRule<string> => ({
    validate: (value) => {
      if (!value || value.trim().length === 0) {
        return { isValid: false, error: 'Password is required' };
      }
      const result = validatePassword(value);
      return result.isValid 
        ? { isValid: true }
        : { isValid: false, error: message || result.errors[0] };
    }
  }),

  required: (message?: string): ValidationRule<string> => ({
    validate: (value) => {
      if (!value || value.trim().length === 0) {
        return { isValid: false, error: message || 'This field is required' };
      }
      return { isValid: true };
    }
  }),

  minLength: (min: number, message?: string): ValidationRule<string> => ({
    validate: (value) => {
      if (!value || value.length < min) {
        return { 
          isValid: false, 
          error: message || `Must be at least ${min} characters long` 
        };
      }
      return { isValid: true };
    }
  }),

  maxLength: (max: number, message?: string): ValidationRule<string> => ({
    validate: (value) => {
      if (value && value.length > max) {
        return { 
          isValid: false, 
          error: message || `Must be no more than ${max} characters long` 
        };
      }
      return { isValid: true };
    }
  }),

  projectName: (message?: string): ValidationRule<string> => ({
    validate: (value) => {
      const result = validateProjectName(value);
      return result.isValid 
        ? { isValid: true }
        : { isValid: false, error: message || result.error };
    }
  }),

  taskTitle: (message?: string): ValidationRule<string> => ({
    validate: (value) => {
      const result = validateTaskTitle(value);
      return result.isValid 
        ? { isValid: true }
        : { isValid: false, error: message || result.error };
    }
  }),

  sanitized: (message?: string): ValidationRule<string> => ({
    validate: (value) => {
      if (!value) return { isValid: true };
      const sanitized = sanitizeInput(value);
      if (sanitized !== value) {
        return { 
          isValid: false, 
          error: message || 'Input contains invalid characters' 
        };
      }
      return { isValid: true };
    }
  }),

  url: (message?: string): ValidationRule<string> => ({
    validate: (value) => {
      if (!value) return { isValid: true };
      try {
        new URL(value);
        return { isValid: true };
      } catch {
        return { 
          isValid: false, 
          error: message || 'Please enter a valid URL' 
        };
      }
    }
  }),

  number: (message?: string): ValidationRule<string> => ({
    validate: (value) => {
      if (!value) return { isValid: true };
      if (isNaN(Number(value))) {
        return { 
          isValid: false, 
          error: message || 'Please enter a valid number' 
        };
      }
      return { isValid: true };
    }
  }),

  positiveNumber: (message?: string): ValidationRule<string> => ({
    validate: (value) => {
      if (!value) return { isValid: true };
      const num = Number(value);
      if (isNaN(num) || num <= 0) {
        return { 
          isValid: false, 
          error: message || 'Please enter a positive number' 
        };
      }
      return { isValid: true };
    }
  })
};

// Hook for form validation
export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  validationSchema: Record<keyof T, ValidationRule<any>[]>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);
  const [errors, setErrors] = useState<Record<keyof T, string[]>>({} as Record<keyof T, string[]>);

  const validateField = useCallback((field: keyof T, value: any) => {
    const rules = validationSchema[field] || [];
    const fieldErrors: string[] = [];
    
    for (const rule of rules) {
      const result = rule.validate(value);
      if (!result.isValid) {
        fieldErrors.push(result.error || 'Invalid value');
      }
    }
    
    setErrors(prev => ({
      ...prev,
      [field]: fieldErrors
    }));
    
    return fieldErrors.length === 0;
  }, [validationSchema]);

  const validateForm = useCallback(() => {
    let isValid = true;
    const newErrors = {} as Record<keyof T, string[]>;
    
    for (const field in validationSchema) {
      const fieldErrors: string[] = [];
      const rules = validationSchema[field] || [];
      
      for (const rule of rules) {
        const result = rule.validate(values[field]);
        if (!result.isValid) {
          fieldErrors.push(result.error || 'Invalid value');
          isValid = false;
        }
      }
      
      newErrors[field] = fieldErrors;
    }
    
    setErrors(newErrors);
    return isValid;
  }, [values, validationSchema]);

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }));
    
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
    
    validateField(field, value);
  }, [validateField]);

  const setTouchedField = useCallback((field: keyof T) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setTouched({} as Record<keyof T, boolean>);
    setErrors({} as Record<keyof T, string[]>);
  }, [initialValues]);

  const isFieldValid = useCallback((field: keyof T) => {
    return !errors[field] || errors[field].length === 0;
  }, [errors]);

  const isFormValid = useMemo(() => {
    return Object.keys(validationSchema).every(field => isFieldValid(field));
  }, [validationSchema, isFieldValid]);

  return {
    values,
    setValue,
    touched,
    setTouched: setTouchedField,
    errors,
    validateField,
    validateForm,
    isFieldValid,
    isFormValid,
    reset
  };
};
