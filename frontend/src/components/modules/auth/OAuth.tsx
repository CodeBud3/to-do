import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/config/config";
import { applyTestAttributes } from "@/utils/formHelper";

export default function OauthProvider() {
  const handleOAuthLogin = (provider: string) => {
    window.open(`${API_BASE_URL}/api/auth/${provider}`, "_self");
  };
  return (
    <>
      <div className="w-full flex gap-4 flex-wrap align-middle justify-between">
        <Button
          className="flex-1"
          variant="outline"
          onClick={() => handleOAuthLogin("google")}
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
          onClick={() => handleOAuthLogin("microsoft")}
          {...applyTestAttributes("signin", "ms-auth")}
        >
          <img
            className="w-6 h-6"
            src="/icons/microsoft_logo.svg"
            alt="MS Logo"
          />
          <span>Microsoft</span>
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
