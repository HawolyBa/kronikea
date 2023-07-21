const { admin, db } = require('./admin')

module.exports = async (req, res, next) => {

  try {
    let idToken;

    if (req.headers.authorization && req.headers.authorization.startswith('Bearer ')) {
      idToken = req.headers.authorization.split('Bearer ')[1]
    } else {
      console.error('No token found')
      return res.status(403).json({ error: 'Unauthorized' })
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken)
    req.user = decodedToken
    const data = await db
      .collection('users')
      .where('id', '==', req.user.user_id)
      .limit(1)
      .get()

    req.user.username = data.docs[0].data().username
    req.user.image = data.docs[0].data().image
    return next()
  } catch (err) {
    console.error('Token error', err)
    return res.status(403).json(err)
  }

}