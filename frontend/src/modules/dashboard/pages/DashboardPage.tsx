import { useAuth } from "@/modules/auth/contexts/AuthContext";
import { formattedDate } from "@/utils/dateUtils";

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <>
      <h3 className="font-semibold">{formattedDate(new Date())}</h3>
      <h1 className="font-bold text-2xl pt-4">Hello, {user?.firstName}</h1>
      <h1 className="font-bold text-2xl pt-1 text-cyan-500">
        How can I help you today?
      </h1>
    </>
  );
}
