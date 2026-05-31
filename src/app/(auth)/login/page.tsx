import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      {params.error === "auth_callback_failed" && (
        <p className="mb-4 text-center text-sm text-destructive">
          Sign-in failed. Please try again.
        </p>
      )}
      <LoginForm next={params.next} />
    </>
  );
}
