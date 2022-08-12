
const getTransactions = (req, res, db) => {
     const { email } = req.body;


db.select('transactions.amount', 'transactions.sendfrom', 'transactions.sendto', 'transactions.reference', 'transactions.id')
.from('transactions')
.where('sendfrom', '=', email).orWhere('sendto', '=', email)
.orderBy('id', 'desc')
.then(transactions => {
    if(transactions.length) {
        res.status(200).json(transactions)
    } else {
       res.status(404).json('no transactions found')
    }
}) 
 

}



const sendMoney = (req, res, db, uniqid) => {
    const { sendfrom, sendto, narration, amount } = req.body;

    db('users').where('email', '=', sendto) 
    .returning('users')
    .then(users => {
        if(users.length >= 1) { 
            db('users').where('email', '=', sendfrom)
            .then(users => {
                if(amount > Number(users[0].balance)) {
                   return res.status(400).json('You dont have enough money')
                } else {
                    db('users').where('email', '=', sendfrom)
                    .decrement('balance', amount)
                    .then(count => {
                        if(count) {
                            db('users').where('email', '=', sendto)
                            .increment('balance', amount)
                            .then(count => {
                                if(count) {
                                    db.insert({
                                        sendfrom: sendfrom,
                                        sendto: sendto,
                                        amount: amount,
                                        narration: narration,
                                        reference: uniqid.time(),
                                        date: new Date()
                                      })
                                      .into('transactions')
                                      .then(count => {
                                        if(count) {
                                            res.status(200).json("Money sent successfully")
                                        }
                                      })
                                }
                            })
                        }
                    })
                }
            })

        } else {
            return res.status(404).json('Not found')
        }
    })
}


const addDeposit = (req, res, db) => {
     const  { email, amount, method } = req.body;

}


const withdraw = (req, res, db) => {
     const { email, amount, accountnumber, bankname, method} = req.body;

     db('users').where('email', '=', email)
     .then(user => {
        if(amount >  Number(user[0].balance)) {
            return res.status(400).json("You dont have enough money")
        } else {
            db('users').where('email', '=', email)
            .decrement('balance', amount)
            .then(count => {
                if(count) {
                    db.insert({
                        made_by: email,
                        amount: amount,
                        status: 'pending',
                        date: new Date(),
                        method: method,
                        withdraw_to: [accountnumber, bankname]
                    })
                    .into("withdrawals")
                    .then(count => {
                        if(count) {
                            res.status(200).json('Withdrawal is successfully')
                        }
                    })
                }
            })
        }
     })
}


const viewTransaction = (req, res, db) => {
    const { email, reference } = req.body;
    db('transactions').where('reference', '=', reference)
    .then(transactions => {
        if(transactions[0].sendfrom !== email && transactions[0].sendto !== email ) {
            return res.status(402).json('You are not authorized to view this')
        } else {
             res.json(transactions[0])
         }
    })
   
     

}


module.exports = {
    sendMoney,
    withdraw,
    getTransactions,
    viewTransaction
}