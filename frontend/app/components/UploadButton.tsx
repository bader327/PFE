import { Loader2, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

interface UploadButtonProps {
  ligneId?: string;
  onUploadSuccess?: (data: any) => void;
  className?: string;
  date?: Date;
}

export default function UploadButton({
  ligneId,
  onUploadSuccess,
  date,
  className = "",
}: UploadButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    console.log(file);
    // Check if the file is an Excel file
    if (
      !file.name.endsWith(".xlsx") &&
      !file.name.endsWith(".xls") &&
      !file.name.endsWith(".csv")
    ) {
      setError("Veuillez sélectionner un fichier Excel (.xlsx, .xls) ou CSV.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      if (ligneId) {
        formData.append("ligneId", ligneId);
      }

      if (date) {
        console.log(date);
        const d = new Date();
        date.setHours(
          d.getHours(),
          d.getMinutes(),
          d.getSeconds(),
          d.getMilliseconds()
        );
        const dateStr = date.toUTCString();
        console.log(dateStr);
        formData.append("fileDate", dateStr);
      }

      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors du téléchargement");
      }

      const data = await response.json();

      // If a FPS is required based on detected conditions
      if (data.fpsRequired) {
        // Alert the user that a FPS has been automatically created
        alert(
          "Un FPS a été automatiquement créé suite à la détection de conditions nécessitant une analyse."
        );
      }

      // Call the success callback if provided
      if (onUploadSuccess) {
        onUploadSuccess(data);
      }

      // Refresh the current page
      // router.refresh();
    } catch (err) {
      console.error("Error uploading file:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors du téléchargement"
      );
    } finally {
      setLoading(false);
      if (inputRef && inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <label
        htmlFor="file-upload"
        className={`
          flex items-center justify-center space-x-2 px-4 py-2 rounded-md
          ${
            loading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
          } 
          text-white font-medium transition-colors
        `}
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Traitement...</span>
          </>
        ) : (
          <>
            <UploadCloud className="h-5 w-5" />
            <span>Télécharger un fichier Excel</span>
          </>
        )}
      </label>

      <input
        id="file-upload"
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={handleUpload}
        disabled={loading}
        ref={inputRef}
      />

      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  );
}
