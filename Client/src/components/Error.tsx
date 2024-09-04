type ErrorProps = {
  message: string;
  statusCode?: number;
};

const Error: React.FC<ErrorProps> = ({ message, statusCode }) => {
  return (
    <div className="rounded bg-red-700 p-4 text-start">
      <h2 className="text-2xl">Error</h2>
      <p className="font-semibold">{statusCode}</p>
      <p>{message}</p>
    </div>
  );
};

export default Error;
