const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth =  async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace("Bearer ","")
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        // console.log(decode)
        const user = await User.findOne({ _id : decode._id, 'tokens.token': token })
        req.token = token
        if(!user){
            throw new Error(`failed to find the user..`)
        }
        req.user = user
        next()
    } catch (err) {
        res.status(401).send({error: `please authenticate...!`})
    }
}



module.exports = auth