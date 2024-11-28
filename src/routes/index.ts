import express from 'express'


import {
        test_basic_connection, 
        test_db_connection} from '../controllers/test_connection'

import {
        generate_otp_validation,
        login_validation,
        reset_password_validation,
        signup_validation,
        user_validation,
        verify_otp_validation, } from '../validations/index'

import { 
        email_exist,
        verify_auth_id,
        verify_otp_status} from '../helpers/auth_helper'

import {
        generate_user_otp,
        login,
        persist_login,
        reset_password,
        signup, 
        verify_otp} from '../controllers/authentication'

import {
        welcome_notification} from '../controllers/notification'
        
import { 
        add_user,
        all_paginated_users, 
        edit_user} from '../controllers/users_controller'

const router = express.Router()

// authentication

router.route('/signup').post(signup_validation, email_exist, signup, welcome_notification)

router.route('/login').post(login_validation, login)

router.route('/persist-login').post(verify_auth_id, persist_login)

router.route('/generate-otp').post(generate_otp_validation, generate_user_otp)

router.route('/verify-otp').post(verify_otp_validation, verify_otp_status, verify_otp )

router.route('/reset-password').post(verify_auth_id, reset_password_validation, reset_password)

// User management

router.route('/all-paginated-users/:list_number/:page_number').get(verify_auth_id, all_paginated_users)

router.route('/add-user').post(verify_auth_id, user_validation, email_exist, add_user)

router.route('/edit-user/:user_id').patch(verify_auth_id, user_validation, edit_user)

// test connection

router.route('/test-basic-connection').get(test_basic_connection)

router.route('/test-db-connection').get(test_db_connection)

export default router