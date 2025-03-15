import { Code } from "lucide-react";

export default function Navbar() {
  return (
    <div className="flex justify-between nav-bar-box-model bg-gray-100 border-b-1 border-b-gray-300 drop-shadow-md">
      <div className="flex items-center h-full justify-center logo">
        <div className="flex-center w-10 h-10 bg-black rounded-sm drop-shadow-lg">
          <Code color="white"></Code>
        </div>
        <div className="logo-text text-2xl pl-2">CodeBud</div>
      </div>
    </div>
  );
}
