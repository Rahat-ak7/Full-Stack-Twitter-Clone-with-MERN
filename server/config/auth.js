import jwt from "jsonwebtoken";
import dontenv from "dotenv";
dontenv.config({ path: "../config/.env" });

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "User not Authenticated ",
        success: false,
      });
    }

    const decode = await jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decode.userId;
    next();
  } catch (error) {
    console.log(error);
  }
};
export default isAuthenticated;
