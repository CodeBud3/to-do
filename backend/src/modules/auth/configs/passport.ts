import passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as MicrosoftStrategy } from "passport-microsoft";
import { Request } from "express";
import { handleAuthResponse, SESSION_KEY } from "../helpers/auth.helper";
import { User } from "../../user/models/User";
import { IUser } from "../../user/types/auth.types";

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
    async (_, __, profile, done) => {
      return handleAuthResponse(profile, "google", done);
    }
  )
);

passport.use(
  new MicrosoftStrategy(
    {
      clientID: process.env.MS_OAUTH2_CLIENT_ID!,
      clientSecret: process.env.MS_OAUTH2_CLIENT_SECRET!,
      callbackURL: `${process.env.HOST_URL}${process.env.MS_OAUTH2_REDIRECT_URL}`,
      scope: ["openid", "email", "profile", "User.Read"], // Read basic user profile info
      tenant: "common", // Supports multiple tenants
    },
    async (_: any, __: any, profile: any, done: any) => {
      return handleAuthResponse(profile, "microsoft", done);
    }
  )
);
// Serialize and Deserialize User
passport.serializeUser((user: IUser, done) => {
  return done(null, user._id);
});
passport.deserializeUser(async (id: string, done) => {
  const user = await User.findById(id);
  done(null, user);
});

export default passport;
