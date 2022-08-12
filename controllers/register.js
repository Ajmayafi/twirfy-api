const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password, phonenumber } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission');
  }

  if(email && name && password && phonenumber) {
    db('users')
    .where('email', '=', email)
    .then(user => {
      if(user.length >=1) {
        return res.status(400).json('User already exist')
      } else {
          
  const hash = bcrypt.hashSync(password);
  db.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email 
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      return trx('users')
        .returning('*')
        .insert({
          // If you are using knex.js version 1.0.0 or higher this now returns an array of objects. Therefore, the code goes from:
          // loginEmail[0] --> this used to return the email
          // TO
          // loginEmail[0].email --> this now returns the email
          email: loginEmail[0].email,
          name: name,
          country: 'Nigeria',
          phone_number: phonenumber,
          joined: new Date()
        })
        .then(user => {
          res.status(200).json(user[0]);
        })
    })
    .then(trx.commit)
    .catch(trx.rollback)
  })
  .catch(err => res.status(400).json('unable to register'))
      }
    })
  }


}

module.exports = {
  handleRegister: handleRegister
};


