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
import { MoveLeft } from "lucide-react";
import { ForgotPasswordForm } from "./forms/ForgotPasswordForm";

export default function ForgotPassword() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
      return;
    }
  }, [user, navigate]);

  if (user) {
    // return loading screen
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
              Forgot password?
            </CardTitle>
            <CardDescription
              className="flex-center font-medium"
              {...applyTestAttributes("signin", "card-desc")}
            >
              No worries, we'll send you reset instructions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ForgotPasswordForm />
          </CardContent>
          <CardFooter className="flex-center">
            <p>
              <Link
                className="flex gap-1 content-center align-center"
                to="/login"
                {...applyTestAttributes("login", "link")}
              >
                <MoveLeft className="w-4" /> Back to log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
