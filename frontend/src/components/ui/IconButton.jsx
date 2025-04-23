import { Loader } from "lucide-react";

 
const IconButton = ({ 
  type = "button", 
  className = "", 
  icon: Icon, 
  children, 
  iconPosition = "left", 
  isLoading = false,
  ...props 
}) => {
  return (
    <button
      type={type}
      className={`text-sm md:text-md lg:text-lg  flex items-center justify-center gap-2 p-2 lg:py-3 bg-orange-500 ${isLoading && "opacity-50 cursor-not-allowed"} text-white font-semibold rounded-lg hover:bg-orange-600 transition-all ${className} `}
      {...props}
      disabled={isLoading}
    >
      {iconPosition === "left" && Icon && <Icon className="w-5 h-4  lg:h-6 "  />}
      
      {isLoading ? <Loader /> : children}
      {iconPosition === "right" && Icon && <Icon className="w-5 h-4  lg:h-6" />}
    </button>
  );
};

 

export default IconButton;