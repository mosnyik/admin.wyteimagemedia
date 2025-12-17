import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <Loader className="h-10 w-10 animate-spinColor " strokeWidth={1} />
        <p className="text-gray-600 text-sm">Loading...</p>
      </div>
    </div>
  );
}

