interface OverlayProps {
    message: string;
    type?: 'loading' | 'success' | 'error';
}

function Overlay({ message, type = 'loading' }: OverlayProps) {
    const bgColor = type === 'error' ? 'bg-red-50' : 'bg-white';
    const textColor = type === 'error' ? 'text-red-800' : 'text-gray-800';
    const spinnerColor = type === 'error' ? 'border-red-600' : 'border-indigo-600';

    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className={`flex gap-2 ${bgColor} p-5 rounded-lg shadow-lg`}>
          {type === 'loading' && (
            <div className={`animate-spin rounded-full h-5 w-5 border-b-2 ${spinnerColor}`}></div>
          )}
          <p className={`text-m font-semibold ${textColor}`}>{message}</p>
        </div>
      </div>
    );
  }

export default Overlay;