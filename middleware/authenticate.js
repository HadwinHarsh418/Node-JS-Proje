const jwt = require('jsonwebtoken')


const authenticate = (req, res, next) => {

    try {
        const reqToken = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(reqToken, process.env.ACCESS_JWT_TOKEN_KEY)
        
        req.user = decode
            next();
    } catch (error) {
        if(error.name == 'TokenExpiredError'){
            res.json({
                status: 401,
                message: 'Token Expired!'
            })
        }else
        res.json({
            status: 401,
            message: 'You are not authorized for this request'
        })
    }

}
module.exports = authenticate