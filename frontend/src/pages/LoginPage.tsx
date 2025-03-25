import { LoginForm } from "@/components/modules/auth/LoginForm";
import OauthProvider from "@/components/modules/auth/OAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { applyTestAttributes } from "@/utils/formHelper";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
      return;
    }
  }, [user, navigate]);

  if (user) {
    return <></>;
  }
  return (
    <>
      <div className="login fixed flex justify-end items-center nav-bar-box-model top-0 right-0">
        <Button className="p-0" {...applyTestAttributes("nav", "signup-link")}>
          <Link className="px-4 py-3" to="/signup">
            Sign up
          </Link>
        </Button>
      </div>
      <div className="h-full flex justify-center content-center p-10">
        <Card className="w-150 self-center">
          <CardHeader>
            <CardTitle
              className="flex-center text-2xl font-bold"
              {...applyTestAttributes("signin", "card-title")}
            >
              Sign in to your account
            </CardTitle>
            <CardDescription
              className="flex-center font-medium"
              {...applyTestAttributes("signin", "card-desc")}
            >
              Enter your credentials below to sign in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OauthProvider></OauthProvider>
            <LoginForm></LoginForm>
          </CardContent>
          <CardFooter className="flex-center">
            <p>
              Don't have an account?{" "}
              <b>
                <Link to="/signup" {...applyTestAttributes("signup", "link")}>
                  Sign up
                </Link>
              </b>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
