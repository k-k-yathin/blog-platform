interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
      <p className="text-sm font-medium text-red-800">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-3 text-sm font-semibold text-red-600 hover:text-red-700">
          Try again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
