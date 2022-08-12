const handleProfileGet = (req, res, db) => {
  const { id } = req.params;
  db.select('*').from('users').where({id})
    .then(user => {
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('Not found')
      }
    })
    .catch(err => res.status(400).json('error getting user'))
}


const updateUser = (req, res, db) => {
  const { phonenumber, name, email } = req.body;

  db('users')
  .where('email', '=', email)
  .update({
    phone_number: phonenumber,
    name: name
  })
  .then(count => {
    if(count >= 1) {
      res.status(200).json('User updated')
    }else {
      res.status(400).json('Unable to update user')
    }
  })
}

const handleDeleteUser = (req, res, db) => {
  const { email } =  req.body;

  db('users')
  .where('email', '=', email)
  .del()
  .then(count => {
    if(count >=1) {
       db('login')
       .where('email', '=', email)
       .del()
       .then(count => {
        if(count >=1) {
          res.status(200).json('User is deleted')
        } else {
          res.status(400).json('Cant delete user')
        }
       })
    }
  })
}

module.exports = {
  handleProfileGet,
  updateUser,
  handleDeleteUser
}