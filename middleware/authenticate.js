const jwt = require('jsonwebtoken')


const authenticate = (req, res, next) => {

    try {
        const reqToken = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(reqToken, 'verySecretValue')
        
        req.user = decode
            next();
    } catch (error) {
        res.json({
            status: 401,
            message: 'You are not authorized for this request'
        })
    }

}
module.exports = authenticate