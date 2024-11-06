import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      <SignUp />
    </div>
  );
}
