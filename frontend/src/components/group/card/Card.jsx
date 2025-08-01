const Card = ({ children, className = "", hover = false, ...props }) => {
  const base =
    "bg-white dark:bg-gray-700 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-sm transition-all duration-200";
  const hoverClasses = hover
    ? "hover:shadow-md hover:scale-[1.01] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
    : "";

  return (
    <div
      className={`${base} ${hoverClasses} ${className} `}
      {...props}
      tabIndex={hover ? 0 : undefined} // makes focusable if interactive
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = "", ...props }) => (
  <div
    className={`px-6 py-4 border-b border-gray-200 dark:border-zinc-700 ${className}`}
    {...props}
  >
    {children}
  </div>
);

const CardContent = ({ children, className = "", ...props }) => (
  <div className={`px-6 py-4 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "", ...props }) => (
  <h3
    className={`text-lg font-semibold text-gray-900 dark:text-gray-100 ${className}`}
    {...props}
  >
    {children}
  </h3>
);

const CardDescription = ({ children, className = "", ...props }) => (
  <p
    className={`text-sm text-gray-500 dark:text-gray-400 mt-1 ${className}`}
    {...props}
  >
    {children}
  </p>
);

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Title = CardTitle;
Card.Description = CardDescription;

export default Card;
