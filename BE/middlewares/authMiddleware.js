const jwt = require("jsonwebtoken")
const authMiddleware = (req, res, next) => {
    try {
        const authHead = req.headers.authorization
        if (!authHead) return res.status(401).json({ message: "token required" })
        const token = authHead.split(" ")[1]

        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = payload.id
        req.userRole=payload.role
        next()

    } catch (error) {
        next(error)
    }
}
module.exports={authMiddleware}