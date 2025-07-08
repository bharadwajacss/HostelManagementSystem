import { Input } from "./Input";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Loader } from "../../Dashboards/Common/Loader";

export default function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loader, setLoader] = useState(false);

  const login = async (event) => {
    event.preventDefault();
    setLoader(true);

    try {
      const data = { email, password: pass };

      const response = await fetch("https://hostelmanagementbackend-2tc9.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        const { token, user } = result.data;
        localStorage.setItem("token", token);

        const studentResponse = await fetch("https://hostelmanagementbackend-2tc9.onrender.com/api/student/get-student", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isAdmin: user.isAdmin,
            token: token
          }),
        });

        const studentResult = await studentResponse.json();

        if (studentResult.success) {
          localStorage.setItem("student", JSON.stringify(studentResult.student));

          // ✅ Role-based redirect
          if (user.isAdmin) {
            navigate("/admin-dashboard");
          } else {
            navigate("/student-dashboard");
          }
        } else {
          toast.error("Failed to fetch user details", {
            position: "top-right",
            autoClose: 3000,
            theme: "dark",
          });
        }
      } else {
        toast.error(result.errors[0].msg || "Login failed", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
      }
    } catch (error) {
      toast.error("Network error, try again later", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
    } finally {
      setLoader(false);
    }
  };

  const iemail = {
    name: "email",
    type: "email",
    placeholder: "abc@gmail.com",
    req: true,
    onChange: (e) => setEmail(e.target.value),
  };

  const password = {
    name: "password",
    type: "password",
    placeholder: "••••••••",
    req: true,
    onChange: (e) => setPass(e.target.value),
  };

  return (
    <div className="w-full rounded-lg md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
          Sign in to your account
        </h1>
        <form className="space-y-4 md:space-y-6" onSubmit={login}>
          <Input field={iemail} />
          <Input field={password} />

          <div className="flex items-center justify-between">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 border rounded bg-gray-700 border-gray-600 focus:ring-blue-600 ring-offset-gray-800"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="remember" className="text-gray-300">
                  Remember me
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-800 text-center"
          >
            {loader ? (
              <>
                <Loader /> Verifying...
              </>
            ) : (
              <span>Sign in</span>
            )}
          </button>

          <ToastContainer />

          <p className="text-sm font-light text-gray-400">
            Don’t have an account yet?{" "}
            <Link
              to="/auth/request"
              className="font-medium text-blue-500 hover:underline"
            >
              Request an account.
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
