import jwt from 'jsonwebtoken'

const isAuth = async (req, res, next) => {
    try{
        let token = req.cookies.token
        if(!token){
            return res.status(400).json({message:"user doesn't have token"})
        }
        let verified = await jwt.verify(token, process.env.JWT_SECRET)
        // token verify kar rha hai
        
        if(!verified){
            return res.status(400).json({message:"user doesn't have token"})
        }
        console.log("verified", verified);
        req.userId = verified.userId
        next()
    }
    catch(err){
        return res.status(500).json({message:"isAuth error"})
    }
};  
export default isAuth;