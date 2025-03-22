import { LoginForm } from "@/components/modules/auth/LoginForm";
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
  const { isUserLoggedIn } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isUserLoggedIn) {
      navigate("/");
      return;
    }
  }, [isUserLoggedIn, navigate]);
  return (
    <>
      <div className="login fixed flex justify-end items-center nav-bar-box-model top-0 right-0">
        <Button>
          <Link to="/signup" {...applyTestAttributes("nav", "signup-link")}>
            Sign up
          </Link>
        </Button>
      </div>
      <div className="h-full flex justify-center items-center px-10">
        <Card className="w-150">
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
