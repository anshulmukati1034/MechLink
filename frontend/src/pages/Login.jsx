import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import api from "../utils/api";

const Login = () => {
  const navigate = useNavigate();

  /* VALIDATION */
  const LoginSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  /*  SUBMIT  */
  const handleLogin = async (values, { setSubmitting, resetForm }) => {
    try {
      const res = await api.post("/user/login", {
        Email: values.email,
        Password: values.password,
      });

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }

      Swal.fire({
        icon: "success",
        title: "Login Successful 🎉",
        text: "Welcome back!",
      });

      resetForm();
      navigate("/");
    } catch (error) {
      const message =
        error.response?.data?.message || "Invalid email or password";

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-white">
        
        {/* Heading */}
        <h2 className="text-3xl font-semibold text-center mb-2">
          Welcome Back 👋
        </h2>
        <p className="text-center text-sm text-white/70 mb-8">
          Login to continue
        </p>

        {/* Form */}
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting, touched, errors }) => (
            <Form className="space-y-5">
              
              {/* Email */}
              <div>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className={`w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 outline-none
                    ${
                      touched.email && errors.email
                        ? "ring-2 ring-red-400"
                        : "focus:ring-2 focus:ring-blue-400"
                    }`}
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-400 text-sm mt-1"
                />
              </div>

              {/* Password */}
              <div>
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className={`w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 outline-none
                    ${
                      touched.password && errors.password
                        ? "ring-2 ring-red-400"
                        : "focus:ring-2 focus:ring-blue-400"
                    }`}
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-400 text-sm mt-1"
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition font-semibold disabled:opacity-50"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>

        {/* Signup Redirect */}
        <p className="text-center text-sm text-white/70 mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
