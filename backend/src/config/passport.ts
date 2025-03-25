import passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Request } from "express";
import { extractProfileFromGoogle, SESSION_KEY } from "../helpers/auth.helper";
import { IUser, User } from "../models/User";

// 🔹 Custom function to extract JWT from both Header and Cookies
const tokenExtractor = (req: Request): string | null => {
  // 1️⃣ Extract from Authorization header
  let token = null;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // 2️⃣ Extract from Cookies (if not found in Header)
  if (!token && req.cookies) {
    token = req.cookies[SESSION_KEY];
  }

  return token;
};

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: tokenExtractor,
      secretOrKey: process.env.JWT_SECRET as string,
    },
    async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload.userId);
        return user ? done(null, user) : done(null, false);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH2_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_OAUTH2_CLIENT_SECRET as string,
      callbackURL: `${process.env.HOST_URL}${process.env.GOOGLE_OAUTH2_REDIRECT_URI}`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const [id, firstName, lastName, email, provider] =
          extractProfileFromGoogle(profile);
        let user: IUser | null = await User.findOne({
          email: email,
        });
        if (user && !user.oAuthProfileId) {
          user.oAuthProfileId = id;
          user.provider = "google";
          await user.save();
        }
        if (!user) {
          // Create new user
          user = new User({
            oAuthProfileId: id,
            firstName,
            lastName,
            email,
            provider,
          });
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        console.error(error);
        return done(error, false);
      }
    }
  )
);

// Serialize and Deserialize User
passport.serializeUser((user: IUser, done) => {
  return done(null, user.id);
});
passport.deserializeUser(async (id: string, done) => {
  const user = await User.findById(id);
  done(null, user);
});

export default passport;
