import Loading from '@/components/common/Loading';
import Error from '@/components/common/Error';

const AsyncStateHandler = ({ 
  isLoading, 
  error, 
  children, 
  loadingMessage = "Loading...", 
  errorMessagePrefix = "" 
}) => {
  if (isLoading) {
    return <Loading>{loadingMessage}</Loading>;
  }
  
  if (error) {
    const errorMessage = errorMessagePrefix ? `${errorMessagePrefix} ${error}` : error;
    return <Error>{errorMessage}</Error>;
  }
  
  return <>{children}</>;
};

export default AsyncStateHandler;
