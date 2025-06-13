'use client';

interface SerialNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  serialNumbers: number[];
}

export default function SerialNumberModal({
  isOpen,
  onClose,
  title,
  serialNumbers,
}: SerialNumberModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="space-y-2">
          {serialNumbers.length > 0 ? (
            serialNumbers.map((serial) => (
              <div
                key={serial}
                className="p-3 bg-gray-100 rounded-md flex items-center justify-between hover:bg-gray-200 transition-colors"
              >
                <span className="font-mono text-lg">#{serial}</span>
                <span className="text-sm text-gray-500">
                  Numéro de série
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              Aucun numéro de série à afficher
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
