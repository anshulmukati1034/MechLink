import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import Swal from "sweetalert2";
import api from "../utils/api";

const Signup = () => {
  const navigate = useNavigate();

  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  /* ---------------- VALIDATION ---------------- */
  const SignupSchema = Yup.object({
    name: Yup.string().min(3, "Min 3 chars").required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    otp: otpSent
      ? Yup.string().length(6, "OTP must be 6 digits").required("OTP required")
      : Yup.string(),
    password: Yup.string()
      .min(6, "Min 6 chars")
      .required("Password is required"),
  });

  /* SEND OTP */
  const handleSendOtp = async (email) => {
    if (!email) {
      Swal.fire("Error", "Please enter email first", "warning");
      return;
    }

    try {
      setSendingOtp(true);

      await api.post("/user/send-otp", { Email: email });

      setOtpSent(true);

      Swal.fire({
        icon: "success",
        title: "OTP Sent 📧",
        text: "OTP sent to your email",
      });
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to send OTP",
        "error"
      );
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (email, otp) => {
    try {
      await api.post("/user/verify-otp", {
        Email: email,
        Otp: otp,
      });

      Swal.fire("Verified ✅", "Email verified successfully", "success");
      return true;
    } catch (error) {
      Swal.fire(
        "Invalid OTP",
        error.response?.data?.message || "OTP verification failed",
        "error"
      );
      return false;
    }
  };

  /*  SIGNUP */
  const handleSignup = async (values, { setSubmitting }) => {
    try {
      const verified = await handleVerifyOtp(values.email, values.otp);
      if (!verified) {
        setSubmitting(false);
        return;
      }

      const res = await api.post("/user/signup-with-otp", {
        Name: values.name,
        Email: values.email,
        Password: values.password,
      });

      localStorage.setItem("token", res.data.token);

      Swal.fire("Success 🎉", "Account created successfully", "success");
      navigate("/");
    } catch (error) {
      Swal.fire(
        "Signup Failed",
        error.response?.data?.message || "Signup failed",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md bg-white/10 rounded-2xl p-8 text-white">
        <h2 className="text-3xl font-semibold text-center mb-6">
          Create Account 🚀
        </h2>

        <Formik
          initialValues={{ name: "", email: "", otp: "", password: "" }}
          validationSchema={SignupSchema}
          onSubmit={handleSignup}
        >
          {({ values, isSubmitting }) => (
            <Form className="space-y-4">
              {/* Name */}
              <Field
                name="name"
                placeholder="Full Name"
                className="w-full px-4 py-3 rounded bg-white/20"
              />
              <ErrorMessage
                name="name"
                component="p"
                className="text-red-400 text-sm"
              />

              {/* Email + OTP */}
              <div className="flex gap-2">
                <Field
                  name="email"
                  type="email"
                  disabled={otpSent}
                  placeholder="Email Address"
                  className="flex-1 px-4 py-3 rounded bg-white/20 disabled:opacity-60"
                />
                <button
                  type="button"
                  disabled={sendingOtp || otpSent}
                  onClick={() => handleSendOtp(values.email)}
                  className="px-4 rounded bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
                >
                  {sendingOtp ? "Sending..." : otpSent ? "Sent" : "Send OTP"}
                </button>
              </div>
              <ErrorMessage
                name="email"
                component="p"
                className="text-red-400 text-sm"
              />

              {/* OTP */}
              {otpSent && (
                <>
                  <Field
                    name="otp"
                    placeholder="Enter OTP"
                    className="w-full px-4 py-3 rounded bg-white/20"
                  />
                  <ErrorMessage
                    name="otp"
                    component="p"
                    className="text-red-400 text-sm"
                  />
                </>
              )}

              {/* Password */}
              <Field
                type="password"
                name="password"
                placeholder="Password"
                className="w-full px-4 py-3 rounded bg-white/20"
              />
              <ErrorMessage
                name="password"
                component="p"
                className="text-red-400 text-sm"
              />

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || !otpSent}
                className="w-full py-3 bg-green-500 rounded hover:bg-green-600 disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : "Sign Up"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-400 cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
