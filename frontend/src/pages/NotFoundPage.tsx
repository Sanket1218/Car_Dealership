import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-7xl font-black text-blue-500">404</p>
      <h1 className="text-3xl font-black text-white">Page not found</h1>
      <Link
        to="/"
        className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white"
      >
        Return home
      </Link>
    </div>
  );
}
