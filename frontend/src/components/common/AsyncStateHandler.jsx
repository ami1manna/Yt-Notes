import Loading from '@/components/common/Loading';
import Error from '@/components/common/Error';

const AsyncStateHandler = ({ isLoading, error, children, loadingMessage = "Loading...", errorMessagePrefix = "Error:" }) => {
  if (isLoading) return <Loading>{loadingMessage}</Loading>;
  if (error) return <Error> {error}</Error>;
  return children;
};

export default AsyncStateHandler;
