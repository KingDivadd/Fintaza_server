import { Request, Response, NextFunction } from 'express'
import prisma from '../helpers/prisma_initializer'
import { salt_round } from '../helpers/constants'
import converted_datetime from '../helpers/date_time_elements'
import { redis_auth_store, redis_otp_store, redis_value_update } from '../helpers/redis_funtions'
import {generate_otp, generate_referral_code} from '../helpers/generated_entities'
import { CustomRequest } from '../helpers/interface'
import {send_sms_otp} from '../helpers/sms_funtions'
import { handle_decrypt } from '../helpers/encryption_decryption'
import { password_reset_otp_mail } from '../helpers/emails'
const bcrypt = require('bcrypt')

export const signup = async(req: Request, res: Response, next: NextFunction)=>{

    try {
        const encrypted_password = await bcrypt.hash(req.body.password, salt_round);

        req.body.password = encrypted_password;
        req.body.created_at = converted_datetime();
        req.body.updated_at = converted_datetime();

        const user = await prisma.user.create({
            data: req.body
        })
    
        const auth_key = await redis_auth_store(user, 60 * 60 * 24)
        if (auth_key){ res.setHeader('x-id-key', auth_key) }

        return next()        

    } catch (err:any) {
        console.log('Error occured during signup ', err);
        return res.status(500).json({err:'Error occured during signup ', error:err});
    }
}

export const login = async(req: Request, res: Response, next: NextFunction)=>{
    const {email, password, remember_me} = req.body
    try {
        
        const user:any = await prisma.user.findUnique({ where: { email: req.body.email }})

        if (!user){
            console.log('Incorrect email address')
            return res.status(404).json({err: 'user not found, check email and try again'})
        }


        const encrypted_password = user.password
        const match_password: boolean = await bcrypt.compare(password, encrypted_password)

        if (!match_password) {
            console.log('Incorrect password')
            return res.status(401).json({ err: `Incorrect password entered!` })
        }

        if (remember_me) {
            const auth_key = await redis_auth_store(user, 60 * 60 * 24 * 365)
            if (auth_key){
                res.setHeader('x-id-key', auth_key)
            }
        }else{
            const auth_key = await redis_auth_store(user, 60 * 60 * 24)
            if (auth_key){
                res.setHeader('x-id-key', auth_key)
            }
        }
        
        return res.status(200).json({ msg: "Login successful", user_data: user })
        
    } catch (err:any) {
        console.log('Error occured during login ', err);
        return res.status(500).json({err: 'Error occured during login ', error: err})
    }
}


export const persist_login = async(req: CustomRequest, res: Response, next: NextFunction)=>{
    try {
        const user_id = req.account_holder.user.user_id

        const user:any = await prisma.user.findUnique({ where: { user_id }})

        if (!user){
            return res.status(404).json({err: 'Login again!'})
        }
        
        return res.status(200).json({ msg: "Login successful", user_data: user })
        
    } catch (err:any) {
        console.log('Error occured during persist login ', err);
        return res.status(500).json({err: 'Error occured during persist login ', error: err})
    }
}

export const patient_signup = async(req: Request, res: Response, next: NextFunction)=>{
    
    try {
        const encrypted_password = await bcrypt.hash(req.body.password, salt_round);

        req.body.password = encrypted_password
        req.body.created_at = converted_datetime()
        req.body.updated_at = converted_datetime()
        req.body.referral_code = generate_referral_code()
        
        const user = await prisma.user.create({ data: req.body })

        const auth_key = await redis_auth_store(user, 60 * 60 * 23)
        if (auth_key){
            res.setHeader('x-id-key', auth_key)
        }
        
        return res.status(201).json({msg: 'User created successfully, proceed to setting up your profile.'})
    } catch (err:any) {
        console.log('Error during patient signup ',err)
        return res.status(500).json({err: 'Error during patient signup ', error: err})
        
    }
}


export const generate_user_otp = async(req: CustomRequest, res: Response, next: NextFunction)=>{
    try {
        const {email} = req.body

        const otp = generate_otp()

        const user = await prisma.user.findUnique({where: {email}})

        if (!user) { return res.status(404).json({err: 'Email address not linked to any user!'}) }

        await redis_otp_store(email, otp, 'unverified', 60 * 60 * 1/6) // otp valid for 10min

        password_reset_otp_mail(user, otp)
        
        return res.status(201).json({ msg: `Kindly check your email for a six digit code`})

    } catch (err:any) {
        console.log('Error occured while generating otp ',err)
        return res.status(500).json({err: 'Error occured while genrating otp ', error: err})
    }
}

export const verify_otp = async(req: CustomRequest, res: Response, next: NextFunction)=>{
    const { otp, email } = req.body

    try {
        const otp_data = req.otp_data

        if (otp !== otp_data.sent_otp) {
            return res.status(401).json({ err: 'Incorrect otp provided'})
        }

        const user = await prisma.user.findFirst({where: {email}})        

        const auth_id = await redis_auth_store(user, 60 * 60 * 23);

        if (auth_id){
            res.setHeader('x-id-key', auth_id)
        }

        return res.status(200).json({ msg: 'Verification successful' })
    } catch (err:any) {
        console.log('Error while verifying user otp ',err)
        return res.status(500).json({err: 'Error while verifying user otp ', error: err})
    }
}

export const reset_password = async (req: CustomRequest, res: Response) => {
    const {password, confirm_password} = req.body
    try {
        const user_id = req.account_holder.user.user_id

        if (password !== confirm_password){
            return res.status(400).json({err: 'Password do not match!'})
        }

        const encrypted_password = await bcrypt.hash(confirm_password, salt_round);

        const update_password = await prisma.user.update({
            where: {user_id},
            data: {
                password: encrypted_password,
                updated_at: converted_datetime()
            }
        })

        // password_reset_success_mail(update_password)

        return res.status(200).json({
            msg: 'Password changed successfully',
            user: update_password
        })

    } catch (err:any) {
        console.log('Error occured while resetting password ', err);
        return res.status(500).json({err:'Error occured while resetting password ', error: err});
        
    }
}