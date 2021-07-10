const jwt = require('jsonwebtoken')
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const authUser = async (req,res,next) => {
    try{
        const token = req.headers.authorization.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
      
        prisma.user.findUnique({
            where: {
                id: parseInt(decoded.id),
            }
        }).then(result => {
            if (result) {
                req.user = result
                req.token = token
                next()
            } else {
                return res.status(401).send("Not authorized")
            }
        }).catch(err => {
            return res.status(401).send("Not authorized")
        })
    }catch(e){
        return res.status(401).send("Not authorized")
    }
}

module.exports = authUser