'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export default function DynamicProductLandingPage({ params }) {
  // قراءة الـ slug بطريقة آمنة تمنع Client-side Exception
  const [slugId, setSlugId] = useState('');

  useEffect(() => {
    Promise.resolve(params).then((resolvedParams) => {
      if (resolvedParams && resolvedParams.id) {
        setSlugId(resolvedParams.id);
      }
    });
  }, [params]);

  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx_xl6iWvDlh2QDtLGgLQUz8fHh2ilJqyejT_18jm3gK_DGGPqg6olAyY3iZJVyu26a/exec';
  const STORE_WHATSAPP_NUMBER = '213798353165';

  const defaultGallery = [
    "https://scontent.faae2-3.fna.fbcdn.net/v/t39.30808-6/891645324_2341177369970489_6005702391524640935_n.jpg",
    "https://scontent.faae2-2.fna.fbcdn.net/v/t39.30808-6/893107494_2341154819972744_6609817046607056108_n.webp",
    "https://scontent.faae2-3.fna.fbcdn.net/v/t39.30808-6/891511582_2341173329970893_4980705526116754681_n.jpg",
    "https://scontent.faae2-3.fna.fbcdn.net/v/t39.30808-6/893766167_2341182689969957_8414253250875486210_n.jpg"
  ];

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedOffer, setSelectedOffer] = useState('pack2');
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentBundleName, setCurrentBundleName] = useState('عرض القطعتين');
  const [currentShippingCost, setCurrentShippingCost] = useState(600);
  const [mainImage, setMainImage] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    wilaya: 'الجزائر العاصمة',
    commune: '',
    shippingType: 'home'
  });

  const [communesList, setCommunesList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastOrderDetails, setLastOrderDetails] = useState(null);

  // جلب المنتج المحدد من Supabase بناءً على slug
  useEffect(() => {
    async function fetchProduct() {
      if (!slugId) return;
      setLoading(true);

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slugId)
        .single();

      if (data && !error) {
        setProduct(data);
        setMainImage(data.image_url || (data.gallery && data.gallery[0]) || defaultGallery[0]);
        setCurrentPrice(Number(data.price_pack2 || data.price_pack1 || 3300));
      } else {
        // البحث عن أول منتج احتياطياً في حال عدم مطابقة الـ slug
        const { data: fallbackData } = await supabase.from('products').select('*').limit(1).single();
        if (fallbackData) {
          setProduct(fallbackData);
          setMainImage(fallbackData.image_url || defaultGallery[0]);
          setCurrentPrice(Number(fallbackData.price_pack2 || 3300));
        }
      }
      setLoading(false);
    }

    fetchProduct();
  }, [slugId]);

  const shippingRates = {
    "أدرار": { home: 1400, stop: 750 },
    "الشلف": { home: 600, stop: 400 },
    "الأغواط": { home: 900, stop: 500 },
    "أم البواقي": { home: 900, stop: 500 },
    "باتنة": { home: 800, stop: 400 },
    "بجاية": { home: 700, stop: 400 },
    "بسكرة": { home: 700, stop: 400 },
    "بشار": { home: 1300, stop: 550 },
    "البليدة": { home: 600, stop: 400 },
    "البويرة": { home: 600, stop: 400 },
    "تمنراست": { home: 1700, stop: 1050 },
    "تبسة": { home: 700, stop: 450 },
    "تلمسان": { home: 700, stop: 400 },
    "تيارت": { home: 700, stop: 400 },
    "تيزي وزو": { home: 600, stop: 400 },
    "الجزائر": { home: 600, stop: 400 },
    "الجزائر العاصمة": { home: 600, stop: 400 },
    "الجلفة": { home: 600, stop: 400 },
    "جيجل": { home: 600, stop: 400 },
    "سطيف": { home: 600, stop: 400 },
    "سعيدة": { home: 700, stop: 450 },
    "سكيكدة": { home: 600, stop: 400 },
    "سيدي بلعباس": { home: 600, stop: 400 },
    "عنابة": { home: 600, stop: 400 },
    "قالمة": { home: 600, stop: 400 },
    "قسنطينة": { home: 600, stop: 400 },
    "المدية": { home: 600, stop: 400 },
    "مستغانم": { home: 700, stop: 450 },
    "المسيلة": { home: 600, stop: 400 },
    "معسكر": { home: 700, stop: 450 },
    "ورقلة": { home: 1000, stop: 600 },
    "وهران": { home: 700, stop: 450 }
  };

  const wilayasData = [
    { code: "1", name: "01 - أدرار", communes: ["أدرار", "أولف", "رقان", "تيمقتن"] },
    { code: "16", name: "16 - الجزائر العاصمة", communes: ["الجزائر الوسطى", "باب الوادي", "سيدي امحمد", "الشراقة", "دالي إبراهيم", "القبة", "الحراش", "باب الزوار", "الدار البيضاء", "الرويبة", "زرالدة"] },
    { code: "19", name: "19 - سطيف", communes: ["سطيف", "العلمة", "عين أرنات", "عين الكبيرة", "عين ولمان", "بوقاعة"] },
    { code: "31", name: "31 - وهران", communes: ["وهران", "بئر الجير", "السانية", "عين الترك", "أرزيو"] },
    { code: "25", name: "25 - قسنطينة", communes: ["قسنطينة", "الخروب", "عين السمارة", "حامة بوزيان"] }
  ];

  useEffect(() => {
    handleWilayaChange('الجزائر العاصمة');
  }, []);

  useEffect(() => {
    calculateShipping(formData.wilaya, formData.shippingType);
  }, [formData.wilaya, formData.shippingType]);

  const handleWilayaChange = (selectedWilaya) => {
    let cleanWilaya = selectedWilaya.replace(/^\d+\s*-\s*/, '').trim();
    const foundWilaya = wilayasData.find(w => w.name.includes(cleanWilaya));
    if (foundWilaya && foundWilaya.communes) {
      setCommunesList(foundWilaya.communes);
      setFormData(prev => ({ ...prev, wilaya: cleanWilaya, commune: foundWilaya.communes[0] || '' }));
    } else {
      setCommunesList([]);
      setFormData(prev => ({ ...prev, wilaya: cleanWilaya, commune: '' }));
    }
  };

  const calculateShipping = (wilaya, shippingType) => {
    let cleanWilaya = wilaya.replace(/^\d+\s*-\s*/, '').trim();
    if (cleanWilaya.startsWith('الجزائر')) cleanWilaya = 'الجزائر العاصمة';

    let cost = 600;
    if (shippingRates[cleanWilaya]) {
      cost = shippingRates[cleanWilaya][shippingType] || (shippingType === 'home' ? 600 : 400);
    } else {
      cost = shippingType === 'home' ? 800 : 500;
    }
    setCurrentShippingCost(cost);
  };

  const selectOffer = (packId, price) => {
    setSelectedOffer(packId);
    setCurrentPrice(price);
    if (packId === 'pack1') setCurrentBundleName('العرض العادي (قطعة واحدة)');
    else if (packId === 'pack2') setCurrentBundleName('عرض القطعتين');
    else if (packId === 'pack4') setCurrentBundleName('العرض العائلي (4 قطع)');
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.commune) return alert('يرجى اختيار البلدية');

    setIsSubmitting(true);
    const orderId = "ORD-" + Math.floor(Math.random() * 899999 + 100000);

    const grandTotal = currentPrice + currentShippingCost;
    const grandTotalText = `${grandTotal.toLocaleString()} دج`;
    const shippingTypeText = formData.shippingType === 'home' ? 'توصيل للمنزل 🏠' : 'مكتب الشحن Stop Desk 🏢';
    const quantity = selectedOffer === 'pack2' ? 2 : selectedOffer === 'pack4' ? 4 : 1;
    const fullOrderDetails = `${product?.title || 'منتج'} - ${currentBundleName} (الكمية: ${quantity})`;

    const orderPayload = {
      customer_name: formData.fullName,
      phone: formData.phone,
      wilaya: formData.wilaya,
      commune: formData.commune,
      cart_items: [{ title: fullOrderDetails, price: currentPrice, qty: quantity }],
      total_price: grandTotal
    };

    const { error } = await supabase.from('orders').insert([orderPayload]);

    if (!error) {
      if (GOOGLE_SCRIPT_URL) {
        const scriptData = new URLSearchParams();
        scriptData.append('orderId', orderId);
        scriptData.append('fullName', formData.fullName);
        scriptData.append('phone', formData.phone);
        scriptData.append('wilaya', formData.wilaya);
        scriptData.append('commune', formData.commune);
        scriptData.append('shippingType', shippingTypeText);
        scriptData.append('order', fullOrderDetails);
        scriptData.append('status', 'قيد التأكيد');
        scriptData.append('shippingCost', currentShippingCost.toString());
        scriptData.append('productPrice', currentPrice.toString());
        scriptData.append('totalPrice', grandTotalText);

        fetch(GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: scriptData }).catch(() => {});
      }

      const customWhatsAppMsg = encodeURIComponent(
        `السلام ${formData.fullName}،\n` +
        `وصلتنا طلبيتك من متجر Bright DZ.\n` +
        `المنتج: ${fullOrderDetails}\n` +
        `طريقة التوصيل: ${shippingTypeText}\n` +
        `المبلغ الإجمالي: ${grandTotalText}\n` +
        `العنوان: ${formData.wilaya} - ${formData.commune}`
      );

      setLastOrderDetails({
        orderId,
        bundleName: fullOrderDetails,
        total: grandTotalText,
        whatsappLink: `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${customWhatsAppMsg}`
      });

      setShowSuccessModal(true);
    } else {
      alert('حدث خطأ أثناء حفظ الطلب: ' + error.message);
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center" dir="rtl">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-[#754b2d] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-bold text-[#432818] text-sm">جاري تحميل صفحة المنتج...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center p-4" dir="rtl">
        <div className="text-center space-y-4 max-w-md bg-white p-8 rounded-3xl border shadow-lg">
          <h2 className="text-2xl font-black text-red-600">المنتج غير موجود</h2>
          <p className="text-gray-600 text-sm">عذراً، لم نتمكن من العثور على هذا المنتج أو ربما تم حذفه.</p>
          <a href="/admin" className="inline-block bg-[#754b2d] text-white px-6 py-2.5 rounded-xl font-bold text-sm">العودة للوحة التحكم</a>
        </div>
      </div>
    );
  }

  const currentGallery = product.gallery && product.gallery.length > 0 ? product.gallery : defaultGallery;

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-gray-800 font-sans selection:bg-[#faedcd] selection:text-[#432818]" dir="rtl">
      {/* Top Bar */}
      <div className="bg-[#432818] text-[#f7f1e5] text-xs sm:text-sm py-2 px-4 text-center font-bold tracking-wide">
        <span>توصيل سريع لكافة الـ 58 ولاية | الدفع بعد المعاينة والإستلام</span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#f7f1e5] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://img.sanishtech.com/u/bb314dd8f27c1767138139bbdc694d73.png" alt="Bright DZ Logo" className="h-10 w-auto object-contain" />
            <span className="font-black text-xl tracking-tight text-[#432818]">Bright<span className="text-[#bc8a5f]">DZ</span></span>
          </div>
          <button onClick={() => scrollToSection('order-form')} className="bg-[#754b2d] hover:bg-[#432818] text-white px-4 py-2 rounded-lg font-bold text-sm shadow cursor-pointer">
            أطلب الآن
          </button>
        </div>
      </header>

      {/* Hero Showcase */}
      <section className="relative pt-6 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* Gallery */}
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white w-full h-[380px] sm:h-[450px]">
                <img src={mainImage} className="w-full h-full object-cover" alt={product.title} />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {currentGallery.map((imgUrl, idx) => (
                  <button key={idx} onClick={() => setMainImage(imgUrl)} className={`rounded-xl overflow-hidden bg-white border-4 transition ${mainImage === imgUrl ? 'border-[#754b2d]' : 'border-transparent'}`}>
                    <img src={imgUrl} className="w-full h-16 object-cover" alt={`Thumbnail ${idx}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#432818]">
                {product.title} <span className="text-[#bc8a5f] block sm:inline">{product.subtitle}</span>
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>

              {/* Offers */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-bold text-gray-700">اختر العرض المناسب:</label>
                
                {product.price_pack1 && (
                  <div onClick={() => selectOffer('pack1', Number(product.price_pack1))} className={`p-3 rounded-xl border-2 flex justify-between cursor-pointer ${selectedOffer === 'pack1' ? 'border-[#754b2d] bg-[#f7f1e5]' : 'border-gray-200 bg-white'}`}>
                    <span className="font-bold text-xs sm:text-sm text-[#432818]">العرض العادي (قطعة واحدة)</span>
                    <span className="font-black text-[#432818] text-sm">{Number(product.price_pack1).toLocaleString()} دج</span>
                  </div>
                )}

                {product.price_pack2 && (
                  <div onClick={() => selectOffer('pack2', Number(product.price_pack2))} className={`p-3 rounded-xl border-2 flex justify-between cursor-pointer ${selectedOffer === 'pack2' ? 'border-[#754b2d] bg-[#f7f1e5]' : 'border-gray-200 bg-white'}`}>
                    <span className="font-bold text-xs sm:text-sm text-[#432818]">عرض القطعتين 🔥</span>
                    <span className="font-black text-[#432818] text-sm">{Number(product.price_pack2).toLocaleString()} دج</span>
                  </div>
                )}

                {product.price_pack4 && (
                  <div onClick={() => selectOffer('pack4', Number(product.price_pack4))} className={`p-3 rounded-xl border-2 flex justify-between cursor-pointer ${selectedOffer === 'pack4' ? 'border-[#754b2d] bg-[#f7f1e5]' : 'border-gray-200 bg-white'}`}>
                    <span className="font-bold text-xs sm:text-sm text-[#432818]">العرض العائلي (4 قطع)</span>
                    <span className="font-black text-[#432818] text-sm">{Number(product.price_pack4).toLocaleString()} دج</span>
                  </div>
                )}
              </div>

              <div className="pt-2 p-3.5 rounded-2xl bg-gradient-to-r from-white to-[#faedcd] border border-[#faedcd] space-y-2.5">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-gray-600">السعر الحالي:</span>
                  <span className="text-2xl font-black text-[#432818]">{currentPrice.toLocaleString()} دج</span>
                </div>
                <button onClick={() => scrollToSection('order-form')} className="w-full py-3 rounded-xl bg-[#754b2d] text-white font-extrabold text-base shadow-lg animate-pulse cursor-pointer">
                  تأكيد الطلب والدفع عند الاستلام
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Form */}
      <section id="order-form" className="py-12 bg-white">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-[#fdfbf7] rounded-3xl p-6 sm:p-8 border-2 border-[#faedcd] shadow-xl">
            <h2 className="text-2xl font-black text-[#432818] text-center mb-6">استمارة الطلب المباشر</h2>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">الاسم الكامل *</label>
                <input required type="text" placeholder="الاسم واللقب" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} className="w-full p-3.5 rounded-xl border bg-white text-sm" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">رقم الهاتف *</label>
                <input required type="tel" pattern="[0-9]{10}" placeholder="06XX XX XX XX" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full p-3.5 rounded-xl border bg-white text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">الولاية *</label>
                  <select value={formData.wilaya} onChange={e => handleWilayaChange(e.target.value)} className="w-full p-3.5 rounded-xl border bg-white text-sm">
                    {wilayasData.map(w => <option key={w.code} value={w.name.replace(/^\d+\s*-\s*/, '').trim()}>{w.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">البلدية *</label>
                  <select value={formData.commune} onChange={e => setFormData({ ...formData, commune: e.target.value })} className="w-full p-3.5 rounded-xl border bg-white text-sm">
                    {communesList.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border space-y-2 text-sm">
                <div className="flex justify-between"><span>السعر:</span><span className="font-bold">{currentPrice.toLocaleString()} دج</span></div>
                <div className="flex justify-between"><span>التوصيل:</span><span className="font-bold text-[#754b2d]">{currentShippingCost.toLocaleString()} دج</span></div>
                <div className="pt-2 border-t font-black text-lg flex justify-between"><span>المجموع:</span><span className="text-[#754b2d]">{(currentPrice + currentShippingCost).toLocaleString()} دج</span></div>
              </div>

              <button disabled={isSubmitting} type="submit" className="w-full py-4 rounded-xl bg-[#754b2d] text-white font-black text-lg shadow-xl cursor-pointer disabled:opacity-50">
                {isSubmitting ? 'جاري الحفظ...' : 'تأكيد الطلب الآن'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Success Modal */}
      {showSuccessModal && lastOrderDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl">
            <h3 className="text-2xl font-black text-gray-800">تم تسجيل طلبك بنجاح!</h3>
            <p className="text-sm text-gray-600">رقم الطلب: <strong>{lastOrderDetails.orderId}</strong></p>
            <a href={lastOrderDetails.whatsappLink} target="_blank" rel="noreferrer" className="block w-full py-3.5 bg-[#25D366] text-white font-extrabold rounded-xl">
              تأكيد عبر واتساب 🟢
            </a>
            <button onClick={() => setShowSuccessModal(false)} className="w-full py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs cursor-pointer">
              إغلاق
            </button>
          </div>
        </div>
      )}

    </div>
  );
}