
const getUser = (req, res, db) => {
    const { email } = req.body;

    db.select('*').from('users')
    .where('email', '=', email)
    .then(user => {
        res.json(user[0])
    })


}


const deletealltransactions = (req, res, db) => {
    
    db.select('*').from('transactions')
    .del()
    .then(count => {
        if(count) {
            db.select('*').from('users')
            .update({
                balance: 0
            })
            .then(count => {
                if(count) {
                    res.json('All is done')
                }
            })
        }
    })
}

module.exports = {
    getUser,
    deletealltransactions
}