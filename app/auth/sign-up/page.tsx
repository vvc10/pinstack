export default function SignUpPage() {
  return (
    <main className="min-h-dvh flex items-center justify-center px-4">
      <div className="w-full">
        <div className="mx-auto w-full max-w-sm text-center mb-8">
          <div className="inline-block h-8 w-8 rounded bg-primary" aria-hidden />
          <h1 className="mt-2 text-lg font-semibold">pinstack</h1>
        </div>
        {/* @ts-expect-error - file-local import below */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <AuthFormShim />
      </div>
    </main>
  )
}

function AuthFormShim() {
  const { AuthForm } = require("@/components/auth/auth-form")
  return <AuthForm mode="sign-up" />
}
