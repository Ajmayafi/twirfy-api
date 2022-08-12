const express = require('express');
const bodyParser = require('body-parser'); // latest version of exressJS now comes with Body-Parser!
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
var uniqid = require('uniqid'); 

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const transactions = require('./controllers/transactions')
const goboy = require('./controllers/goboy')
const dashboard = require('./controllers/dashboard');
const profile = require('./controllers/profile')


const db = knex({
  // connect to your own database here:
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : '07568759',
    database : 'twirfy'
  }
});


const app = express();

app.use(cors())
app.use(express.json()); // latest version of exressJS now comes with Body-Parser!

app.get('/', (req, res)=> { res.send(db.users) })
app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.post('/sendmoney', (req, res) => { transactions.sendMoney(req, res, db, uniqid)})
app.post('/updateuser', (req, res) => { profile.updateUser(req, res, db)})
app.post('/updateu', (req, res) => { goboy.getUser(req, res, db)})
app.get('/getuser/:useremail', (req, res) => { goboy.getUser(req ,res, db)})
app.delete('/deleteuser', (req, res) => { profile.handleDeleteUser(req, res, db) })
app.post('/gettransactions', (req, res) => { transactions.getTransactions(req, res, db)} )
app.delete('/reset', (req, res) => { goboy.deletealltransactions(req, res, db) })
app.post('/withdraw', (req, res) => { transactions.withdraw(req,res,db)})
app.post('/viewtransaction', (req, res) => { transactions.viewTransaction(req,res,db)})
app.post('/overview', (req, res) => { dashboard.fetchTransactionsOverview(req, res, db)})

app.listen(3000, ()=> {
  console.log('app is running on port 3000');
})
