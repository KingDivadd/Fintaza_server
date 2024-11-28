import { Request, Response, NextFunction } from 'express'
import prisma from '../helpers/prisma_initializer'
import { salt_round } from '../helpers/constants'
import converted_datetime from '../helpers/date_time_elements'
import { redis_auth_store, redis_otp_store, redis_value_update } from '../helpers/redis_funtions'
import {generate_otp, generate_password, generate_referral_code} from '../helpers/generated_entities'
import { CustomRequest } from '../helpers/interface'
import {send_sms_otp} from '../helpers/sms_funtions'
import { handle_decrypt } from '../helpers/encryption_decryption'
import { password_reset_otp_mail } from '../helpers/emails'
const bcrypt = require('bcrypt')


export const add_user = async(req: CustomRequest, res: Response, next: NextFunction)=>{
    try {
        const user_role = req.account_holder.user.user_role

        if (user_role != 'admin') { return res.status(401).json({err: 'Unauthorized to perform operation'}) }

        const generated_password = generate_password()

        const encrypted_password = await bcrypt.hash('password', salt_round);
        
        req.body.password = encrypted_password;
        req.body.created_at = converted_datetime();
        req.body.updated_at = converted_datetime();
        req.body.user_role = 'user'

        const new_user = await prisma.user.create({ data: req.body })

        const x_id_key = await redis_auth_store(new_user, 60 * 60 * 24)
        if (x_id_key){
            res.setHeader('x-id-key', x_id_key)
        }

        // user_account_created_mail(new_user, generated_password)

        return res.status(201).json({msg: 'User added successfully', user: new_user})        

    } catch (err:any) {
        console.log('Error occured during user addition ', err);
        return res.status(500).json({err:'Error occured during user addition ', error:err});
    }
}

export const edit_user = async(req: CustomRequest, res: Response, next: NextFunction)=>{
    const {last_name, first_name, email, is_active, business_name, code, phone, city, state, zip, address, user_role} = req.body
    try {
        const user_role = req.account_holder.user.user_role

        if (user_role != 'admin') { return res.status(401).json({err: 'Unauthorized to perform operation'}) }
        
        const {user_id} = req.params

        const user = await prisma.user.findUnique({where: {user_id}})

        
        const update: any = {}
        update.updated_at = converted_datetime()

        if (first_name.trim() !== ''){ update.first_name = first_name }

        if (last_name.trim() !== ''){ update.last_name = last_name }

        if (email.trim() !== ''){ update.email = email }

        if (business_name.trim() !== ''){ update.business_name = business_name }

        if (code.trim() !== ''){ update.code = code }
        
        if (phone.trim() !== ''){ update.phone = phone }

        if (city.trim() !== ''){ update.city = city }

        if (state.trim() !== ''){ update.state = state }

        if (address.trim() !== ''){ update.address = address }

        update.is_active = is_active

        const edit_member = await prisma.user.update({
            where: {user_id},
            data: update
        })

        // user_account_created_mail(new_user, generated_password)
        return res.status(200).json({msg: 'User updated successfully', user:edit_member})

    } catch (err:any) {
        console.log('Error occured during user update ', err);
        return res.status(500).json({err:'Error occured during user update ', error:err});
    }
}

export const all_paginated_users = async(req: CustomRequest, res: Response)=>{
    try {
        const user_id = req.account_holder.user.user_id;

        const {list_number, page_number} = req.params

        const no_of_items_per_table = Number(list_number) || 15

        const [number_of_users, users ] = await Promise.all([

            prisma.user.count({ where: {is_trashed: false} }),

            prisma.user.findMany({
                where: {is_trashed: false},

                skip: (Math.abs(Number(page_number)) - 1) * no_of_items_per_table, take: no_of_items_per_table, orderBy: { created_at: 'desc'  } 
            }),

        ])
        
        const number_of_user_pages = (number_of_users <= no_of_items_per_table) ? 1 : Math.ceil(number_of_users / no_of_items_per_table)

        return res.status(200).json({ total_number_of_users: number_of_users, total_number_of_pages: number_of_user_pages, users })

    } catch (err:any) {
        console.log('Error occured while fetching all users ',err);
        return res.status(500).json({err:'Error occured while fetching all users ',error:err});
    }
}