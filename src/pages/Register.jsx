import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";

const Register = () => {
  const { currentUser, logInPopUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signUp } = useAuth();

  const signIn = async () => {
    setLoading(true);
    setError(false);

    await logInPopUp().catch((error) => {
      setLoading(false);
      setError(error.message);
    });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    setError(false);
    e.preventDefault();

    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;

    await signUp(email, password, displayName)
      .then(async (res) => {
        await updateProfile(res.user, {
          displayName,
        });

        await setDoc(doc(db, "users", res.user.uid), {
          uid: res.user.uid,
          displayName,
          email,
        });
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
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
          Create Account
        </h1>
        {error && (
          <span className="bg-red-100 text-red-700 p-1 rounded border text-sm border-red-200 text-center">
            {/* show errors dynamically */}
            {error.split("/")[1].charAt(0).toUpperCase() +
              error.split("/")[1].replace(/()-/g, " ").slice(1, -2)}
            , Please try again.
          </span>
        )}
        <div>
          <label
            htmlFor="display-name"
            className="block text-sm font-medium text-gray-700"
          >
            Display Name
          </label>
          <div className="mt-1">
            <input
              name="display-name"
              type="text"
              autoComplete="display-name"
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
            htmlFor="password"
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
            Sign Up
          </button>
        </div>
        <div className="text-center mt-2">
          Already have an account?{" "}
          {
            <Link className="text-indigo-600 hover:text-und" to={"/login"}>
              Login
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

export default Register;
