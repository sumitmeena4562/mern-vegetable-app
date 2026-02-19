import React from 'react';

const PhotoUpload = ({ data, onChange }) => {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      if (files.length + data.images.length > 3) {
        alert("Max 3 photos allowed.");
        return;
      }
      const newImages = files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      onChange('images', [...data.images, ...newImages]);
    }
  };

  const removeImage = (index) => {
    const newImages = data.images.filter((_, i) => i !== index);
    onChange('images', newImages);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl soft-shadow h-fit space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-200/40">
          <span className="material-symbols-outlined text-white text-xl">add_a_photo</span>
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800 leading-none">Harvest Photos</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Maximum 3</p>
        </div>
      </div>

      <div className="border-2 border-dashed border-slate-100 rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-50/50 hover:bg-white hover:border-amber-400 group/upload relative isolate overflow-hidden shadow-inner">
        <div className="mb-3 bg-white p-3 rounded-full inline-block shadow-md group-hover/upload:scale-110 group-hover/upload:rotate-6 transition-all ring-6 ring-slate-50">
          <span className="material-symbols-outlined text-3xl text-amber-600">cloud_upload</span>
        </div>
        <h4 className="text-slate-800 font-bold text-sm mb-0.5">Click to Upload</h4>
        <p className="text-[8px] text-slate-400 font-bold tracking-widest uppercase">JPG, PNG (Max 5MB)</p>

        <input
          multiple
          type="file"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleFileChange}
          disabled={data.images.length >= 3}
          accept="image/*"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {data.images.map((img, index) => (
          <div key={index} className="aspect-square bg-white rounded-xl border border-slate-100 flex items-center justify-center relative group overflow-hidden shadow-sm">
            <img
              src={img.preview}
              alt="preview"
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
            />
            <button
              onClick={(e) => { e.preventDefault(); removeImage(index); }}
              className="absolute top-1.5 right-1.5 bg-white/95 text-red-500 p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        ))}

        {[...Array(3 - data.images.length)].map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square bg-slate-50/50 rounded-xl border border-dashed border-slate-100 flex items-center justify-center text-slate-200">
            <span className="material-symbols-outlined text-xl opacity-10">image</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoUpload;