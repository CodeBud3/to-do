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

export default function LoginPage() {
  return (
    <>
      <div className="login fixed flex justify-end items-center nav-bar-box-model top-0 right-0">
        <Button>Sign Up</Button>
      </div>
      <div className="h-full flex justify-center items-center">
        <Card className="w-150">
          <CardHeader>
            <CardTitle className="flex-center">
              Sign in to your account
            </CardTitle>
            <CardDescription className="flex-center">
              Enter your credentials below to sign in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm></LoginForm>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </div>
    </>
  );
}
