import { useAuth } from "@/modules/auth/contexts/AuthContext";
import { applyTestAttributes } from "@/modules/auth/helpers/formHelper";
import { formattedDate } from "@/utils/dateUtils";

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <>
      <h3
        className="font-semibold"
        {...applyTestAttributes("dashboard-header", "date")}
      >
        {formattedDate(new Date())}
      </h3>
      <h1
        className="font-bold text-2xl pt-4"
        {...applyTestAttributes("dashboard-header", "welcome")}
      >
        Hello, {user?.firstName}
      </h1>
      <h1 className="font-bold text-2xl pt-1 text-cyan-500">
        How can I help you today?
      </h1>
    </>
  );
}
