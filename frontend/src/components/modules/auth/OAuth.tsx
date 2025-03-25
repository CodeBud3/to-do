import { Button } from "@/components/ui/button";
import { applyTestAttributes } from "@/utils/formHelper";

export default function OauthProvider() {
  const handleGoogleLogin = () => {
    window.open(
      "https://to-do-test-cjnr.onrender.com/api/auth/google",
      "_self"
    );
  };
  const handleMSLogin = () => {};
  const handleAppleLogin = () => {};
  return (
    <>
      <div className="w-full flex gap-4 flex-wrap align-middle justify-between">
        <Button
          className="flex-1"
          variant="outline"
          onClick={handleGoogleLogin}
          {...applyTestAttributes("signin", "google-auth")}
        >
          <img
            className="w-6 h-6"
            src="/icons/google_logo.svg"
            alt="Google Logo"
          />
          <span>Google</span>
        </Button>
        <Button
          className="flex-1"
          variant="outline"
          onClick={handleMSLogin}
          {...applyTestAttributes("signin", "ms-auth")}
        >
          <img
            className="w-6 h-6"
            src="/icons/microsoft_logo.svg"
            alt="MS Logo"
          />
          <span>Microsoft</span>
        </Button>
        <Button
          className="flex-1"
          variant="outline"
          onClick={handleAppleLogin}
          {...applyTestAttributes("signin", "apple-auth")}
        >
          <img
            className="w-6 h-6"
            src="/icons/apple_logo.svg"
            alt="Apple Logo"
          />
          <span>Apple</span>
        </Button>
      </div>
      <div className="flex w-full my-6 text-gray-500 items-center justify-center gap-4">
        <hr className="flex-2"></hr>
        <span className="flex-1 text-center">OR CONTINUE WITH</span>
        <hr className="flex-2"></hr>
      </div>
    </>
  );
}
