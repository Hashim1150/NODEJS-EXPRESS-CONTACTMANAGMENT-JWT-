const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const refreshAccessToken = require("../middleware/Refreshtoken");
// asyncHandler
const validateToken = asyncHandler(async (req,res,next)=>{       //validate token func 
   // let token;
   const refreshToken = req.cookies.RefreshToken
   const accesstoken = req.cookies.Token;
   if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided, please log in again" });
   }
    if(! accesstoken){
        res.status(401).json({message :"token is missing..maybe the cookie got expired ...please log in again"})
        throw new Error("token is missing..maybe the cookie got expired")
    }
    // let authHeader = req.headers.Authorization ||req.headers.authorization
    // if (authHeader && authHeader.startsWith("Bearer")){
    //    token =authHeader.split(" ")[1];
        jwt.verify(accesstoken ,process.env.ACCESS_TOKEN_SECRET, async (err,decoded)=>{
           if (err){
            if (err.name === 'TokenExpiredError'){      
                try {
                    const newAccessToken = await refreshAccessToken(req, res);
                    req.user = jwt.verify(newAccessToken, process.env.ACCESS_TOKEN_SECRET).user;
                    return next();
                } catch (error) {
                    return res.status(401).json({ message: "Failed to refresh access token" });
                }
        }else { 
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
   }
   req.user =decoded.user // Attach user info to request
   next();
  });
   // } 
});
module.exports=validateToken;