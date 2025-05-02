import { useEffect, useState } from "react";
import { useController } from "react-hook-form";

interface FeatureImageProps {
  name: string;
  form: any;
}

export function FeatureImage({ name, form }: FeatureImageProps) {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name,
    control: form.control,
  });

  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (value && value.length > 0 && value[0] instanceof File) {
      const file = value[0];
      const url = URL.createObjectURL(file);
      setPreview(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = [files[0]];
      onChange(fileArray);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Feature Image
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 
                   file:mr-4 file:py-2 file:px-4 
                   file:rounded-md file:border-0 
                   file:text-sm file:font-semibold 
                   file:bg-blue-50 file:text-blue-700 
                   hover:file:bg-blue-100"
      />

      {error && (
        <p className="text-xs text-red-500 mt-1">{error.message}</p>
      )}

      {preview && (
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-1">Preview:</p>
          <img
            src={preview}
            alt="Selected"
            className="w-3/4  h-[300px] object-cover rounded-md border shadow-sm"
          />
        </div>
      )}
    </div>
  );
}
