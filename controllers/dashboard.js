
const fetchTransactionsOverview = (req, res, db) => {
    const { email } = req.body;

    var infocontainer 
    var totalsend
    var totalrecieve
    var totalwithdraw


    db.sum('amount').from('transactions')
    .where('sendfrom', '=', email)
    .then(sum => {
        totalsend = sum[0]
        db.sum('amount').from('transactions')
        .where('sendto', '=', email)
        .then(amount => {
            totalrecieve = amount[0]
            db.sum('amount').from('withdrawals')
            .where('made_by', '=', email)
            .then(withdraw => {
                totalwithdraw = withdraw[0]
                infocontainer = [totalsend, totalrecieve, totalwithdraw]
                res.json(infocontainer)
            })
        })
    })

}


module.exports = {
    fetchTransactionsOverview
}