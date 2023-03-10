import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { currentUser, logInPopUp, logIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const signIn = async () => {
    setLoading(true);
    setError(false);

    await logInPopUp().catch((error) => {
      setLoading(false);
      setError(error.code);
    });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    setError(false);
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;

    await logIn(email, password).catch((error) => {
      setLoading(false);
      setError(error.code);
    });
  };

  if (currentUser) {
    return <Navigate to="/" />;
  }
  return (
    <div className="bg-zinc-800 h-screen w-screen  flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        action=""
        className="flex flex-col gap-2 w-[360px] bg-gray-100 p-10 rounded"
      >
        <h1 className="text-center text-3xl font-semibold pb-6">
          Welcome Back
        </h1>
        {error && (
          <span className="bg-red-100 text-red-700 p-1 rounded border text-sm border-red-200 text-center">
            {/* show errors dynamically */}
            {error.split("/")[1].charAt(0).toUpperCase() +
              error.split("/")[1].replace(/()-/g, " ").slice(1)}
            , Please try again.
          </span>
        )}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <div className="mt-1">
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className="form-input"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="mt-1">
            <input
              name="password"
              type="password"
              autoComplete="password"
              required
              className="form-input"
            />
          </div>
        </div>
        <div>
          <button disabled={loading} type="submit" className="primary-btn">
            Sign in
          </button>
        </div>
        <div className="text-center mt-2">
          No account?{" "}
          {
            <Link className="text-indigo-600 hover:text-und" to={"/register"}>
              Register
            </Link>
          }
        </div>
        <div className="mt-2">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-100 px-2 text-gray-500">Or</span>
            </div>
          </div>

          <div className="mt-2">
            <div>
              <button
                disabled={loading}
                onClick={signIn}
                type="button"
                className="btn"
              >
                <span className="sr-only">Continue with Google</span>
                <img src="/google.svg" className="h-5 w-5 flex-2" />
                <span className="flex-1 text-center text-base">
                  Continue with Google
                </span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
