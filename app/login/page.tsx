import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/dashboard" });
        }}
        className="card w-full max-w-sm text-center space-y-4"
      >
        <h1 className="text-xl font-semibold">📅 Day Board</h1>
        <p className="text-sm text-gray-500">Your calendar, email and to-dos on one page.</p>
        <button className="w-full bg-accent text-white rounded-lg py-2 text-sm font-medium">
          Continue with Google
        </button>
      </form>
    </div>
  );
}
