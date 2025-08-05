import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import TextButton from '@/components/common/TextButton';
import { useAuth } from "../../context/auth/AuthContextBase";
 

const Login = () => {
  const { login, error, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await login(email, password);
      navigate("/"); // Redirect to home or another page on success
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen bg-gray-100 dark:bg-gray-900 px-5">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-500 text-center font-semibold">
              {error}
            </div>
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <TextButton type="submit" isLoading={isLoading}>
            Login
          </TextButton>
        </form>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-300 text-sm">
          Don't have an account?{" "}
          <button onClick={() => navigate('/signup')}  className="text-orange-500 font-semibold">
            Sign up
          </button>
         
        </p>
      </div>
    </div>
  );
};

export default Login;
