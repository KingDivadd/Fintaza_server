import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import bodyParser, { text } from 'body-parser';
import webpush from 'web-push'
import apn from 'apn'
import cors from 'cors';
import colors from 'colors';
require('colors')
import dotenv from 'dotenv'; 
const jwt = require('jsonwebtoken')
import { CORS_OPTION, general_physician_chat_percentage, port, specialist_physician_chat_percentage, vapid_private_key, vapid_public_key } from './helpers/constants';
import connect_to_mongo_db from './config/mongodb';
import index from './routes/index'
import not_found from  './middlewares/not_found'
import check_network_availability from './middlewares/network_availability'
import { check_user_availability, socket_verify_auth_id } from './helpers/auth_helper';
import prisma from './helpers/prisma_initializer';
import converted_datetime, { readable_date } from './helpers/date_time_elements';


dotenv.config();

const app = express();

const server = http.createServer(app);

const io:any = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] }});

app.use(express.json());
app.use(cors(CORS_OPTION));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// config webpush.js

if (vapid_public_key && vapid_private_key) { 
    webpush.setVapidDetails( 'mailto:iroegbu.dg@gmail.com', vapid_public_key, vapid_private_key);
}

// Sockets area

export {io}

// middleware
app.use(check_network_availability);

// routes
app.use('/api/v1/app', index);


app.use(not_found);




const start = async () => {
    const PORT = port || 4000;
    try {
        await connect_to_mongo_db();
        server.listen(PORT, () => console.log(`EaseCredit server started and running on port ${PORT}`.cyan.bold));
    } catch (err) {
        console.log(`something went wrong`.red.bold);
    }
}

start();