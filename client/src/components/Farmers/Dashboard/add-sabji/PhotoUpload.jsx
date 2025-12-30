import React from 'react';

const PhotoUpload = () => {
  return (
    <div className="glass-panel p-6 rounded-2xl soft-shadow h-fit">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-slate-500">add_a_photo</span>
        <h3 className="text-lg font-bold text-slate-800">Sabji Photos</h3>
      </div>
      
      <div className="custom-file-upload border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center cursor-pointer transition-all bg-slate-50/50 group">
        <div className="mb-4 bg-white p-4 rounded-full inline-block shadow-sm group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-4xl text-green-500">cloud_upload</span>
        </div>
        <h4 className="text-slate-800 font-bold mb-1">Tap to upload photos</h4>
        <p className="text-xs text-slate-500 mb-4">or drag and drop here</p>
        <button className="bg-white border border-slate-200 text-slate-700 text-sm font-bold px-4 py-2 rounded-lg hover:bg-slate-50">Select Files</button>
        <input type="file" className="hidden" multiple />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="aspect-square bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center relative group overflow-hidden">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBq_PcKdHAV-xvZ5XxrpKXB3QRdK-M6z-VAKGf6Smqb3y0LHjZKlU_CEdYXtA2p2tYpbkT5Rb2YAhRF84D_0YJHVxFxyMf3m6MuJo3YCglXXWw1z-ccBOLQBW1O7Pj9OtLffmTxl6KjuTxq5uMFDXeQMnJ5H4ISM1z1r7B8IXU8NgkAHy4B6jKlyUk0w6uV6lYBLgKJEcaGvg7obf-_2adr2J33GvYupa6G9vm5D8-b54LcpJI6SCvIxKog8vzrDX2Tg2xBBawpe0c" alt="preview" className="w-full h-full object-cover" />
          <button className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-[12px]">close</span>
          </button>
        </div>
        <div className="aspect-square bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300">
          <span className="material-symbols-outlined">image</span>
        </div>
        <div className="aspect-square bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300">
          <span className="material-symbols-outlined">image</span>
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-3 text-center">Supported: JPG, PNG (Max 5MB)</p>
    </div>
  );
};

export default PhotoUpload;