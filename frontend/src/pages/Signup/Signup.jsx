import { useState, useContext } from "react";
import { useAuth } from "@/context/auth/AuthContextBase";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  const { signup } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      password: ""
    };

    // First name validation
    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
      valid = false;
    } else if (firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
      valid = false;
    }

    // Last name validation
    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
      valid = false;
    } else if (lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
      valid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
      valid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      valid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = "Password must include uppercase, lowercase, and numbers";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await signup((firstName + " " + lastName), email, password);
        navigate("/login");
      } catch (error) {
        // Handle signup error
        console.error("Signup failed:", error);
        setErrors({
          ...errors,
          general: "Signup failed. Please try again."
        });
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen bg-gray-100 dark:bg-gray-900 px-5">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6">
          Signup
        </h2>
        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {errors.general}
          </div>
        )}
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="flex gap-3">
            <div className="w-1/2">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className={`w-full px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.firstName ? "border-2 border-red-500" : ""
                }`}
              />
              {errors.firstName && (
                <p className="mt-1 text-red-500 text-xs">{errors.firstName}</p>
              )}
            </div>
            <div className="w-1/2">
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className={`w-full px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.lastName ? "border-2 border-red-500" : ""
                }`}
              />
              {errors.lastName && (
                <p className="mt-1 text-red-500 text-xs">{errors.lastName}</p>
              )}
            </div>
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`w-full px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.email ? "border-2 border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-red-500 text-xs">{errors.email}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`w-full px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.password ? "border-2 border-red-500" : ""
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-red-500 text-xs">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full mt-4 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all"
          >
            Signup
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-300 text-sm">
          Already have an account?{" "}
          <button onClick={() => navigate("/login")} className="text-orange-500 font-semibold">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;