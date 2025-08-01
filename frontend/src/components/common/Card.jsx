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
    <p
      className={`${sizes[size]} text-gray-600 dark:text-gray-400 mt-1 leading-relaxed ${className}`}
      {...props}
    >
      {children}
    </p>
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

// Example usage component to demonstrate the enhanced features
const CardExamples = () => {
  return (
    <div className="space-y-6 p-6 bg-gray-100 dark:bg-gray-950 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Enhanced Card Components</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Default Card */}
        <Card>
          <Card.Header>
            <Card.Title>Default Card</Card.Title>
            <Card.Description>
              This is a standard card with default styling and shadow.
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <p className="text-gray-700 dark:text-gray-300">
              Content goes here with proper spacing and typography.
            </p>
          </Card.Content>
        </Card>

        {/* Elevated Card */}
        <Card variant="elevated">
          <Card.Header>
            <Card.Title>Elevated Card</Card.Title>
            <Card.Description>
              This card has more prominent shadow for emphasis.
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <p className="text-gray-700 dark:text-gray-300">
              Perfect for important content that needs to stand out.
            </p>
          </Card.Content>
        </Card>

        {/* Interactive Card */}
        <Card hover variant="gradient">
          <Card.Header>
            <Card.Title>Interactive Card</Card.Title>
            <Card.Description>
              This card responds to hover and focus with smooth animations.
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <p className="text-gray-700 dark:text-gray-300">
              Try hovering or focusing on this card!
            </p>
          </Card.Content>
        </Card>

        {/* Ghost Card */}
        <Card variant="ghost">
          <Card.Header noBorder>
            <Card.Title size="lg">Ghost Card</Card.Title>
            <Card.Description>
              Subtle background with no border for minimal design.
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <p className="text-gray-700 dark:text-gray-300">
              Great for clean, minimal interfaces.
            </p>
          </Card.Content>
        </Card>

        {/* Card with Footer */}
        <Card variant="outlined">
          <Card.Header>
            <Card.Title size="sm">Card with Footer</Card.Title>
            <Card.Description size="sm">
              This card demonstrates the footer component.
            </Card.Description>
          </Card.Header>
          <Card.Content size="sm">
            <p className="text-gray-700 dark:text-gray-300">
              Main content area with compact sizing.
            </p>
          </Card.Content>
          <Card.Footer>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Updated 2 hours ago</span>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View Details
              </button>
            </div>
          </Card.Footer>
        </Card>

        {/* Large Card */}
        <Card variant="elevated" hover>
          <Card.Header>
            <Card.Title size="xl" as="h2">Large Card</Card.Title>
            <Card.Description size="lg">
              This card uses larger sizing for headers and content.
            </Card.Description>
          </Card.Header>
          <Card.Content size="lg">
            <p className="text-gray-700 dark:text-gray-300">
              Perfect for feature cards or important announcements with more generous spacing.
            </p>
          </Card.Content>
          <Card.Footer>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              Get Started
            </button>
          </Card.Footer>
        </Card>
      </div>
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
export { CardExamples };