import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";

function Signup() {
  const navigate = useNavigate();

  /* ---------------- VALIDATION SCHEMA ---------------- */
  const SignupSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  /* ---------------- SUBMIT HANDLER ---------------- */
  const handleSignup = async (values, { setSubmitting }) => {
    try {
      const res = await axios.post("http://localhost:3001/api/user/signup", {
        Name: values.name,
        Email: values.email,
        Password: values.password,
      });

      Swal.fire({
        icon: "success",
        title: "Signup Successful",
        text: "You have registered successfully!",
        showConfirmButton: true,
      });

      localStorage.setItem("token", res.data.token);

      navigate("/");
    } catch (error) {
      console.error(error.response?.data || error.message);

      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: error.response?.data?.message || "Something went wrong!",
        showConfirmButton: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      {/* Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-white">
        {/* Heading */}
        <h2 className="text-3xl font-semibold text-center mb-2">
          Create Account 🚀
        </h2>
        <p className="text-center text-sm text-white/70 mb-8">
          Sign up to get started
        </p>

        {/* Formik Form */}
        <Formik
          initialValues={{ name: "", email: "", password: "" }}
          validationSchema={SignupSchema}
          onSubmit={handleSignup}
        >
          {({ touched, errors, isSubmitting }) => (
            <Form className="space-y-5">
              {/* Name */}
              <div>
                <Field
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className={`w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 outline-none transition
                    ${
                      touched.name && errors.name
                        ? "ring-2 ring-red-400"
                        : "focus:ring-2 focus:ring-blue-400"
                    }`}
                />
                <ErrorMessage
                  name="name"
                  component="p"
                  className="text-red-400 text-sm mt-1"
                />
              </div>

              {/* Email */}
              <div>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className={`w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 outline-none transition
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
                  className={`w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 outline-none transition
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
                className="w-full py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition font-semibold shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? "Signing up..." : "Sign Up"}
              </button>
            </Form>
          )}
        </Formik>

        {/* Login Redirect */}
        <p className="text-center text-sm text-white/70 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
