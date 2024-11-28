import { Request, Response, NextFunction } from 'express';
import Joi from 'joi'


export const signup_validation = async (req: Request, res: Response, next: NextFunction)=>{
    try {
        const schema = Joi.object({
            last_name: Joi.string().trim().required(),
            first_name: Joi.string().trim().required(),
            business_name: Joi.string().trim().allow('').optional(),
            email: Joi.string().trim().email().required(),
            password: Joi.string().trim().required(),
            user_role: Joi.string().trim().required(),
            
            code: Joi.string().trim().allow('').optional(),
            phone: Joi.string().trim().allow('').optional(),
            city: Joi.string().trim().allow('').optional(),
            state: Joi.string().trim().allow('').optional(),
            zip: Joi.string().trim().allow('').optional(),
            address: Joi.string().trim().allow('').optional(),
        })

        const { error: validation_error } = schema.validate(req.body)

        if (validation_error) {
            const error_message = validation_error.message.replace(/"/g, '');
            return res.status(400).json({ err: error_message });
        }
        return next()
    } catch (err:any) {
        console.log('Error occured in signup validation function ',err)
        return res.status(422).json({err: 'Error occured in signup validation funtion ', error: err})
        
    }
}

export const login_validation = async (req: Request, res: Response, next: NextFunction)=>{
    try {
        const schema = Joi.object({
            email: Joi.string().trim().email().required(),
            password: Joi.string().trim().required(),
            remember_me: Joi.boolean().optional()
        })

        const { error: validation_error } = schema.validate(req.body)

        if (validation_error) {
            const error_message = validation_error.message.replace(/"/g, '');
            return res.status(400).json({ err: error_message });
        }
        return next()
    } catch (err:any) {
        console.log('Error occured in signup validation function ',err)
        return res.status(422).json({err: 'Error occured in signup validation funtion ', error: err})
        
    }
}


export const generate_otp_validation = async (req: Request, res: Response, next: NextFunction)=>{
    try {
        const schema = Joi.object({
            email: Joi.string().trim().email().required(),
        })

        const { error: validation_error } = schema.validate(req.body)

        if (validation_error) {
            const error_message = validation_error.message.replace(/"/g, '');
            return res.status(400).json({ err: error_message });
        }
        return next()
    } catch (err:any) {
        console.log('Error occured in otp validation function ',err)
        return res.status(422).json({err: 'Error occured in otp validation funtion ', error: err})
        
    }
}

export const verify_otp_validation = async (req: Request, res: Response, next: NextFunction)=>{
    try {
        const schema = Joi.object({
            email: Joi.string().trim().email().required(),
            otp: Joi.string().trim().required()
        })

        const { error: validation_error } = schema.validate(req.body)

        if (validation_error) {
            const error_message = validation_error.message.replace(/"/g, '');
            return res.status(400).json({ err: error_message });
        }
        return next()
    } catch (err:any) {
        console.log('Error occured in otp validation function ',err)
        return res.status(422).json({err: 'Error occured in otp validation funtion ', error: err})
        
    }
}

export const reset_password_validation = async (req: Request, res: Response, next: NextFunction)=>{
    try {
        const schema = Joi.object({
            confirm_password: Joi.string().trim().required(),
            password: Joi.string().trim().required()
        })

        const { error: validation_error } = schema.validate(req.body)

        if (validation_error) {
            const error_message = validation_error.message.replace(/"/g, '');
            return res.status(400).json({ err: error_message });
        }
        return next()
    } catch (err:any) {
        console.log('Error occured in password reset validation function ',err)
        return res.status(422).json({err: 'Error occured in password reset validation funtion ', error: err})
        
    }
}


export const user_validation = async (req: Request, res: Response, next: NextFunction)=>{
    try {
        const schema = Joi.object({
            last_name: Joi.string().trim().required(),
            first_name: Joi.string().trim().required(),
            business_name: Joi.string().trim().allow('').optional(),
            email: Joi.string().trim().email().required(),
            is_active:Joi.boolean().optional(),
            
            code: Joi.string().trim().allow('').optional(),
            phone: Joi.string().trim().allow('').optional(),
            city: Joi.string().trim().allow('').optional(),
            state: Joi.string().trim().allow('').optional(),
            zip: Joi.string().trim().allow('').optional(),
            address: Joi.string().trim().allow('').optional(),

        })

        const { error: validation_error } = schema.validate(req.body)

        if (validation_error) {
            const error_message = validation_error.message.replace(/"/g, '');
            return res.status(400).json({ err: error_message });
        }
        return next()
    } catch (err:any) {
        console.log('Error occured in user validation function ',err)
        return res.status(422).json({err: 'Error occured in user validation funtion ', error: err})
        
    }
}
