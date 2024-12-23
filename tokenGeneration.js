const jwt = require("jsonwebtoken");
function TokenGeneretion (user,res){  //token generation 
    const accesstoken = jwt.sign(
        {
            user:{
                username :user.username,
                email : user.email,
                id : user.id,
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn :"1m"}
    );
    const refreshToken = jwt.sign(
        {
            user:{
                username :user.username,
                email : user.email,
                id : user.id,
            },                              
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn :"3m"}
    )
    res.cookie("Token",accesstoken,{
        httpOnly :true, // Ensures the cookie is only accessible by the web server
        secure : process.env.NODE_ENV === 'production',// Ensures the cookie is only used with HTTPS
        maxAge : 2 * 60 * 1000 // 20 mins 
    });
    res.cookie("RefreshToken",refreshToken, {   
        httpOnly :true, // Ensures the cookie is only accessible by the web server
        secure : process.env.NODE_ENV === 'production',// Ensures the cookie is only used with HTTPS
        maxAge : 3 * 60 * 1000  // 7 days 7 * 24 * 
    });
    return ;   
}
module.exports = TokenGeneretion;