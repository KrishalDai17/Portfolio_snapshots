import LoginForm from "./login-form";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-serif text-2xl tracking-widest text-[#f5f0e6]">
            DR DSLR
          </h1>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mt-2">
            Admin
          </p>
        </div>

        {params.error === "not_authorized" && (
          <p className="text-sm text-red-400 mb-4 text-center">
            That account isn&apos;t authorized for admin access.
          </p>
        )}

        <LoginForm redirectTo={params.redirectTo ?? "/admin/dashboard"} />
      </div>
    </div>
  );
}
