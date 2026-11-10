'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function AdminDashboard() {
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    slug: '',
    image_url: '',
    price_pack1: '',
    price_pack2: '',
    price_pack4: '',
    galleryText: ''
  });

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProductsList(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleTitleChange = (val) => {
    // توليد slug تلقائي من العنوان
    const generatedSlug = val
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    setFormData(prev => ({
      ...prev,
      title: val,
      slug: prev.slug || generatedSlug || 'product-' + Math.floor(Math.random() * 1000)
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.slug) return alert('يرجى ملء اسم المنتج والرابط الفريد (slug)');

    setSaving(true);

    // تحويل نص المعرض إلى مصفوفة روابط
    const galleryArray = formData.galleryText
      ? formData.galleryText.split('\n').map(item => item.trim()).filter(Boolean)
      : [formData.image_url];

    const payload = {
      title: formData.title,
      subtitle: formData.subtitle,
      description: formData.description,
      slug: formData.slug.toLowerCase().replace(/\s+/g, '-'),
      image_url: formData.image_url,
      price_pack1: formData.price_pack1 ? Number(formData.price_pack1) : null,
      price_pack2: formData.price_pack2 ? Number(formData.price_pack2) : null,
      price_pack4: formData.price_pack4 ? Number(formData.price_pack4) : null,
      gallery: galleryArray
    };

    const { error } = await supabase.from('products').insert([payload]);

    if (!error) {
      alert('تمت إضافة المنتج وسيتولد له رابط صفحة هبوط فوراً!');
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        slug: '',
        image_url: '',
        price_pack1: '',
        price_pack2: '',
        price_pack4: '',
        galleryText: ''
      });
      fetchProducts();
    } else {
      alert('حدث خطأ أثناء حفظ المنتج: ' + error.message);
    }
    setSaving(false);
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      fetchProducts();
    } else {
      alert('خطأ في الحذف: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-4 sm:p-8" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-[#432818]">لوحة تحكم المنتجات الصفحات الديناميكية</h1>
            <p className="text-xs text-gray-500 mt-1">أضف منتجاً جديداً ليصبح له رابط صفحة هبوط مستقلة تلقائياً</p>
          </div>
          <span className="bg-[#faedcd] text-[#432818] text-xs font-bold px-3 py-1.5 rounded-full">
            إجمالي المنتجات: {productsList.length}
          </span>
        </div>

        {/* Add Product Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
          <h2 className="text-lg font-bold text-gray-800 border-b pb-3">إضافة منتج جديد</h2>
          
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">عنوان المنتج الرئيسي *</label>
                <input
                  required
                  type="text"
                  placeholder="مثال: حامل المناشف الخشبي"
                  value={formData.title}
                  onChange={e => handleTitleChange(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#754b2d]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">العنوان الفرعي (Subtitle)</label>
                <input
                  type="text"
                  placeholder="مثال: بنظام القفل بالجاذبية"
                  value={formData.subtitle}
                  onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#754b2d]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">رابط الصفحة (Slug) *</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-mono bg-gray-100 p-3 rounded-xl">/products/</span>
                <input
                  required
                  type="text"
                  placeholder="towel-holder"
                  value={formData.slug}
                  onChange={e => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-300 text-sm font-mono focus:outline-none focus:border-[#754b2d]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">وصف المنتج</label>
              <textarea
                rows="3"
                placeholder="تفاصيل ومميزات المنتج..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#754b2d]"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">سعر العرض الأول (Pack 1)</label>
                <input
                  type="number"
                  placeholder="1900"
                  value={formData.price_pack1}
                  onChange={e => setFormData({ ...formData, price_pack1: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">سعر العرض الثاني (Pack 2)</label>
                <input
                  type="number"
                  placeholder="3300"
                  value={formData.price_pack2}
                  onChange={e => setFormData({ ...formData, price_pack2: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">سعر العرض الثالث (Pack 4)</label>
                <input
                  type="number"
                  placeholder="6200"
                  value={formData.price_pack4}
                  onChange={e => setFormData({ ...formData, price_pack4: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-300 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">رابط الصورة الرئيسية (Image URL)</label>
              <input
                type="url"
                placeholder="https://..."
                value={formData.image_url}
                onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">روابط صور المعرض الفرعية (ضع كل رابط في سطر)</label>
              <textarea
                rows="3"
                placeholder="https://image1.jpg&#10;https://image2.jpg"
                value={formData.galleryText}
                onChange={e => setFormData({ ...formData, galleryText: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-300 text-sm font-mono"
              ></textarea>
            </div>

            <button
              disabled={saving}
              type="submit"
              className="w-full py-3.5 bg-[#754b2d] hover:bg-[#432818] text-white font-bold rounded-xl transition shadow-md cursor-pointer disabled:opacity-50"
            >
              {saving ? 'جاري التنسيق والإضافة...' : 'إضافة المنتج وإنشاء صفحة الهبوط فوراً 🚀'}
            </button>
          </form>
        </div>

        {/* Existing Products List */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
          <h2 className="text-lg font-bold text-gray-800 border-b pb-3">قائمة المنتجات وصفحات الهبوط الحالية</h2>
          
          {loading ? (
            <p className="text-sm text-gray-500 text-center py-4">جاري جلب المنتجات...</p>
          ) : (
            <div className="divide-y">
              {productsList.map(prod => (
                <div key={prod.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={prod.image_url || 'https://via.placeholder.com/60'} className="w-14 h-14 rounded-lg object-cover border" alt={prod.title} />
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{prod.title}</h4>
                      <a
                        href={`/products/${prod.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#754b2d] hover:underline font-mono block mt-0.5"
                      >
                        /products/{prod.slug} ↗
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <a
                      href={`/products/${prod.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-2 rounded-lg"
                    >
                      معاينة الصفحة 👁️
                    </a>
                    <button
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-3 py-2 rounded-lg"
                    >
                      حذف 🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}