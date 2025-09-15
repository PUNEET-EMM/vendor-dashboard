import {
    FileText,
    Upload,
    X,
    Image,
} from 'lucide-react';
import { useRef, useState } from "react";

const FileUpload = ({
    onFileSelect,
    selectedFile,
    accept = 'image/*,.pdf',
    label = 'Invoice Upload',
}) => {
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/') || file.type === 'application/pdf') {
                onFileSelect(file);
            }
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) onFileSelect(file);
    };

    const handleRemoveFile = () => {
        onFileSelect(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div
                className={`
                    relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200
                    ${dragOver
                        ? 'border-blue-400 bg-blue-50'
                        : selectedFile
                            ? 'border-green-300 bg-green-50'
                            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {selectedFile ? (
                    <div className="space-y-3">
                        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            {selectedFile.type === 'application/pdf' ? (
                                <FileText className="h-6 w-6 text-green-600" />
                            ) : (
                                <Image className="h-6 w-6 text-green-600" />
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-800">{selectedFile.name}</p>
                            <p className="text-xs text-gray-500">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFile();
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-red-800 transition-colors"
                        >
                            <X className="h-4 w-4" />
                            Remove
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <Upload className="h-6 w-6 text-gray-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                Drop invoice here or click to browse
                            </p>
                            <p className="text-xs text-gray-500">PDF or Image files up to 10MB</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


export default FileUpload