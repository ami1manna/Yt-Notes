 
const IconButton = ({ 
  type = "button", 
  className = "", 
  icon: Icon, 
  children, 
  iconPosition = "left", 
  ...props 
}) => {
  return (
    <button
      type={type}
      className={`flex items-center justify-center gap-2 w-full  py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all ${className}`}
      {...props}
    >
      {iconPosition === "left" && Icon && <img src={Icon} className="w-5 h-5" />}
      {children}
      {iconPosition === "right" && Icon && <img src={Icon} className="w-5 h-5" />}
    </button>
  );
};

 

export default IconButton;