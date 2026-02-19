import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import BasicInfo from '../../components/Farmers/Dashboard/add-sabji/BasicInfo';
import PhotoUpload from '../../components/Farmers/Dashboard/add-sabji/PhotoUpload';
import AdditionalDetails from '../../components/Farmers/Dashboard/add-sabji/AdditionalDetails';
import VisibilityCard from '../../components/Farmers/Dashboard/add-sabji/VisibilityCard';
import SubmissionSuccess from '../../components/Farmers/Dashboard/add-sabji/SubmissionSuccess';
import api from '../../api/axios';

const AddSabji = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    variety: '',
    category: 'vegetable',
    quantity: '',
    unit: 'kg',
    pricePerUnit: '',
    harvestDate: new Date().toISOString().split('T')[0],
    grade: 'A',
    isOrganic: false,

    // Additional
    minOrder: 1,
    pickupSlot: 'Morning (8 AM - 11 AM)',
    description: '',
    packaging: 'Jute Bags',
    shelfLife: '3-5 Days',
    isWashed: false,

    // Images
    images: [], // { url, file }

    // Visibility
    isVisible: true
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const potentialIncome = useMemo(() => {
    const q = Number(formData.quantity) || 0;
    const p = Number(formData.pricePerUnit) || 0;
    return q * p;
  }, [formData.quantity, formData.pricePerUnit]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.quantity || !formData.pricePerUnit) {
      toast.error("Please fill all required fields!");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();

      const productPayload = {
        name: formData.name,
        category: formData.category,
        variety: formData.variety,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        pricePerUnit: Number(formData.pricePerUnit),
        harvestDate: formData.harvestDate,
        qualityGrade: formData.grade,
        minimumOrder: Number(formData.minOrder),
        description: formData.description,
        packaging: formData.packaging,
        shelfLife: formData.shelfLife,
        isWashed: formData.isWashed,
        tags: [
          formData.pickupSlot,
          formData.isOrganic ? 'organic' : 'standard',
          formData.packaging,
          formData.isWashed ? 'washed' : 'unwashed'
        ],
        location: { coordinates: [0, 0] },
        status: formData.isVisible ? 'available' : 'hidden'
      };

      data.append('productData', JSON.stringify(productPayload));
      formData.images.forEach((img) => {
        if (img.file) data.append('images', img.file);
      });

      const response = await api.post('/farmers/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setIsSuccess(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to publish harvest");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 pb-28 lg:pb-12 relative z-10">
      {isSuccess && (
        <SubmissionSuccess
          productName={formData.name}
          onComplete={() => navigate('/farmer-dashboard')}
        />
      )}


      {/* Main Grid - Synced with Dashboard Spacing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Column (8/12) */}
        <div className="lg:col-span-8 space-y-6">
          <BasicInfo data={formData} onChange={handleChange} />
          <AdditionalDetails data={formData} onChange={handleChange} />
        </div>

        {/* Right Column (4/12) */}
        <div className="lg:col-span-4 space-y-6">
          <PhotoUpload data={formData} onChange={handleChange} />

          <div className="lg:sticky lg:top-24 space-y-6">
            <VisibilityCard data={formData} onChange={handleChange} income={potentialIncome} />

            {/* Desktop Action Buttons - Elite Style */}
            <div className="hidden lg:block space-y-3">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] flex items-center justify-center gap-2 group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                {loading ? <span className="material-symbols-outlined animate-spin">sync</span> : (
                  <>
                    <span className="material-symbols-outlined text-xl group-hover:scale-110 group-hover:rotate-12 transition-transform">rocket_launch</span>
                    Publish Now
                  </>
                )}
              </button>
              <button
                onClick={() => navigate('/farmer-dashboard')}
                className="w-full bg-white text-slate-500 py-3.5 rounded-2xl font-bold border border-slate-200 hover:bg-slate-50 hover:text-slate-700 transition-all active:scale-[0.98]"
              >
                Save for Later
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Global Action Button for Mobile (Inlined for consistency) */}
      <div className="lg:hidden mt-8">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black active:scale-[0.98] shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 text-sm"
        >
          {loading ? <span className="material-symbols-outlined animate-spin text-lg">sync</span> : (
            <>
              <span className="material-symbols-outlined text-base">publish</span>
              Publish Harvest
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddSabji;