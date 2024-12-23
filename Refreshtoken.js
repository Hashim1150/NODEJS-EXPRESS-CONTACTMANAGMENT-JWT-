const jwt = require('jsonwebtoken'); 
const asyncHandler = require('express-async-handler');

const refreshAccessToken =asyncHandler (async (req, res) => {
    const refreshToken = req.cookies.RefreshToken;
    if (!refreshToken) {
      res.status(401);
      throw new Error("Not authorized, no refresh token");
    }
   return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("Not authorized, refresh token failed");
      }
      const accessToken = jwt.sign(
        {
          user: {
            username: decoded.user.username,
            email: decoded.user.email,
            id: decoded.user.id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1m" }
      );
      // Set the new access token in a cookie
      res.cookie('Token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 2 * 60 * 1000 //  20 minutes
      });
      console.log("message: Access token refreshed successfully");
      resolve(accessToken) ;
    });
  });
});
module.exports = refreshAccessToken;