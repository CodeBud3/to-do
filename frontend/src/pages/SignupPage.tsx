import { SignUpForm } from "@/components/modules/auth/SignUpForm";
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

export default function SignUpPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/");
      return;
    }
  }, [user, navigate]);
  return (
    <>
      <div className="login fixed flex justify-end items-center nav-bar-box-model top-0 right-0">
        <Button>
          <Link to="/login" {...applyTestAttributes("nav", "signin-link")}>
            Login
          </Link>
        </Button>
      </div>
      <div className="h-full flex justify-center items-center p-10">
        <Card className="w-150">
          <CardHeader>
            <CardTitle
              {...applyTestAttributes("signup", "card-title")}
              className="flex-center text-2xl font-bold"
            >
              Create an account
            </CardTitle>
            <CardDescription
              {...applyTestAttributes("signup", "card-desc")}
              className="flex-center font-medium"
            >
              Enter your details below to create your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignUpForm></SignUpForm>
          </CardContent>
          <CardFooter className="flex-center">
            <p>
              Already have an account?{" "}
              <b>
                <Link {...applyTestAttributes("signin", "link")} to="/login">
                  Sign in
                </Link>
              </b>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
