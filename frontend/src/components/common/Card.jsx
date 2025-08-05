const Card = ({ 
  children, 
  className = "", 
  hover = false, 
  variant = "default",
  size = "default",
  ...props 
}) => {
  const baseClasses = "transition-all duration-200 rounded-xl border";
  
  const variants = {
    default: "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm",
    elevated: "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-md",
    outlined: "bg-transparent border-gray-300 dark:border-gray-600 shadow-none",
    ghost: "bg-gray-50 dark:bg-gray-800 border-transparent shadow-none",
    gradient: "bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700 shadow-sm"
  };

  const sizes = {
    sm: "text-sm",
    default: "",
    lg: "text-lg"
  };
  
  const hoverClasses = hover
    ? "hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 hover:-translate-y-0.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
    : "";

  return (
    <div
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${hoverClasses} ${className}`}
      {...props}
      tabIndex={hover ? 0 : undefined}
      role={hover ? "button" : undefined}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ 
  children, 
  className = "", 
  noBorder = false,
  ...props 
}) => {
  const borderClass = noBorder ? "" : "border-b border-gray-200 dark:border-gray-700";
  
  return (
    <div
      className={`px-6 py-4 ${borderClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardContent = ({ 
  children, 
  className = "", 
  size = "default",
  ...props 
}) => {
  const sizes = {
    sm: "px-4 py-3",
    default: "px-6 py-4",
    lg: "px-8 py-6",
    xl: "px-10 py-8"
  };

  return (
    <div className={`${sizes[size]} ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardTitle = ({ 
  children, 
  className = "", 
  size = "default",
  as: Component = "h3",
  ...props 
}) => {
  const sizes = {
    sm: "text-base font-medium",
    default: "text-lg font-semibold",
    lg: "text-xl font-semibold",
    xl: "text-2xl font-bold"
  };

  return (
    <Component
      className={`${sizes[size]} text-gray-900 dark:text-gray-100 leading-tight ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

const CardDescription = ({ 
  children, 
  className = "", 
  size = "default",
  ...props 
}) => {
  const sizes = {
    sm: "text-xs",
    default: "text-sm",
    lg: "text-base"
  };

  return (
    <div
      className={`${sizes[size]} text-gray-600 dark:text-gray-400 mt-1 leading-relaxed ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardFooter = ({ 
  children, 
  className = "", 
  noBorder = false,
  ...props 
}) => {
  const borderClass = noBorder ? "" : "border-t border-gray-200 dark:border-gray-700";
  
  return (
    <div
      className={`px-6 py-4 ${borderClass} bg-gray-50 dark:bg-gray-800/50 rounded-b-xl ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

 
// Attach subcomponents
Card.Header = CardHeader;
Card.Content = CardContent;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Footer = CardFooter;

export default Card;
