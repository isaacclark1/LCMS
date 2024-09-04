type ErrorDialogProps = {
  message: string;
  statusCode: number | undefined;
  closeDialog: () => void;
};

const ErrorDialog: React.FC<ErrorDialogProps> = ({
  message,
  statusCode,
  closeDialog,
}) => {
  return (
    <div className="rounded bg-red-700 p-4 text-white">
      <button
        type="button"
        onClick={closeDialog}
        className="absolute right-0 top-0 rounded-bl rounded-tr border-b border-l border-white bg-black hover:bg-gray-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="36px"
          viewBox="0 -960 960 960"
          width="36px"
          fill="#b91c1c"
        >
          <path d="m291-240-51-51 189-189-189-189 51-51 189 189 189-189 51 51-189 189 189 189-51 51-189-189-189 189Z" />
        </svg>
      </button>
      <h2 className="text-2xl">Error</h2>
      <p className="font-semibold">{statusCode}</p>
      <p>{message}</p>
    </div>
  );
};

export default ErrorDialog;
