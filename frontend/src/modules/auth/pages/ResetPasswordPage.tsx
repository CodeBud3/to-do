import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { applyTestAttributes } from "@/modules/auth/helpers/formHelper";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ResetPasswordForm } from "../components/ResetPasswordForm";
import { MoveLeft } from "lucide-react";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  if (!token) {
    navigate("/login");
    return;
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
              {...applyTestAttributes("signup", "card-title")}
              className="flex-center text-2xl font-bold"
            >
              Reset your password
            </CardTitle>
            <CardDescription
              {...applyTestAttributes("signup", "card-desc")}
              className="flex-center font-medium"
            >
              Go ahead and set a new password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResetPasswordForm token={token} />
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
