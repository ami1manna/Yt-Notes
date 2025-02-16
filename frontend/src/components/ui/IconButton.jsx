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
      className={`flex items-center justify-center gap-2   py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all ${className} `}
      {...props}
      disabled={isLoading}
    >
      {iconPosition === "left" && Icon && <Icon className="w-15 h-15 "  />}
      
      {isLoading ? <Loader /> : children}
      {iconPosition === "right" && Icon && <Icon className="w-15 h-15" />}
    </button>
  );
};

 

export default IconButton;