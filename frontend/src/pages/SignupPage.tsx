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
import { Link } from "react-router-dom";

export default function SignUpPage() {
  return (
    <>
      <div className="login fixed flex justify-end items-center nav-bar-box-model top-0 right-0">
        <Button>
          <Link to="/login">Login</Link>
        </Button>
      </div>
      <div className="h-full flex justify-center items-center p-10">
        <Card className="w-150">
          <CardHeader>
            <CardTitle className="flex-center text-2xl font-bold">
              Create an account
            </CardTitle>
            <CardDescription className="flex-center font-medium">
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
                <Link to="/login">Sign in</Link>
              </b>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
