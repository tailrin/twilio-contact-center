require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const twilio = require('twilio');
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const NODE_ENV = process.env.NODE_ENV
const client = new twilio(accountSid, authToken);

const app = express()

client.messages
  .create({
     body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
     from: '+19045670593',
     to: '+19705396535'
   })
  .then(message => console.log(message.sid));

const morganOption = (NODE_ENV === 'production')
	? 'tiny'
	: 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use(function errorHandler(error, req, res, next){
	let response
	if (NODE_ENV === 'production'){
		response = { error: { message: 'server error' } }
	} else {
		console.error(error)
		response = { message: error.message, error }
	}
	res.status(500).json(response)
})
app.get('/', (req, res) => {
	res.send('Hello, world!')
})

module.exports = app