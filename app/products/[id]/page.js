'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export default function DynamicProductLandingPage({ params }) {
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
  const [currentPrice, setCurrentPrice] = useState(3300);
  const [currentBundleName, setCurrentBundleName] = useState('عرض القطعتين (باك المطبخ والحمام)');
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
  const [isUserInTrackingMode, setIsUserInTrackingMode] = useState(false);
  const [currentActiveOrderId, setCurrentActiveOrderId] = useState('');

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [showOrderPromptModal, setShowOrderPromptModal] = useState(false);

  const [trackingDetails, setTrackingDetails] = useState({
    orderId: '',
    orderName: '',
    total: '',
    status: 'قيد التأكيد',
    trackingCode: '28-H8G9NDFX0V-ZR',
    customerName: ''
  });

  const [searchInput, setSearchInput] = useState('');
  const [lastOrderDetails, setLastOrderDetails] = useState(null);

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
    "وهران": { home: 700, stop: 450 },
    "البيض": { home: 900, stop: 600 },
    "إليزي": { home: 1700, stop: 1050 },
    "برج بوعريريج": { home: 600, stop: 400 },
    "بومرداس": { home: 600, stop: 400 },
    "الطارف": { home: 600, stop: 400 },
    "تندوف": { home: 1300, stop: 750 },
    "تيسمسيلت": { home: 600, stop: 450 },
    "الوادي": { home: 1000, stop: 600 },
    "خنشلة": { home: 600, stop: 400 },
    "سوق أهراس": { home: 600, stop: 400 },
    "تيبازة": { home: 600, stop: 400 },
    "ميلة": { home: 600, stop: 400 },
    "عين الدفلى": { home: 700, stop: 450 },
    "النعامة": { home: 900, stop: 600 },
    "عين تموشنت": { home: 700, stop: 400 },
    "غرداية": { home: 1000, stop: 600 },
    "غليزان": { home: 700, stop: 450 },
    "تيميمون": { home: 1300, stop: 800 },
    "برج باجي مختار": { home: 1300, stop: 1200 },
    "أولاد جلال": { home: 800, stop: 450 },
    "بني عباس": { home: 1300, stop: 1200 },
    "عين صالح": { home: 1300, stop: 1050 },
    "عين قزام": { home: 1300, stop: 1050 },
    "تقرت": { home: 1000, stop: 600 },
    "جانت": { home: 1300, stop: 1200 },
    "المغير": { home: 1000, stop: 600 },
    "المنيعة": { home: 1000, stop: 600 }
  };

  const wilayasData = [
    { code: "1", name: "01 - أدرار", communes: ["أدرار", "اقبلي", "أولف", "بودة", "فنوغيل", "إن زغمير", "أولاد أحمد تيمي", "رقان", "سالي", "السبع", "تامنطيط", "تامست", "تيمقتن", "تيت", "تسابيت", "زاوية كنتة"] },
    { code: "16", name: "16 - الجزائر العاصمة", communes: ["الجزائر الوسطى", "باب الوادي", "سيدي امحمد", "الأبيار", "حيدرة", "بن عكنون", "الشراقة", "دالي إبراهيم", "الدرارية", "بئر مراد رايس", "بئر خادم", "القبة", "الحراش", "باب الزوار", "الدار البيضاء", "الرويبة", "زرالدة", "عين البنيان", "الرغاية", "البرج الكيفان", "الكاليتوس", "براقي", "باش جراح", "المقرية", "المرادية", "بوزريعة", "بني المسوس", "السحاولة", "الخرايسية", "العاشور"] },
    { code: "19", name: "19 - سطيف", communes: ["سطيف", "العلمة", "عين أرنات", "عين أزال", "عين الكبيرة", "عين ولمان", "عموشة", "بوقاعة", "حمام السخنة", "صالح باي"] },
    { code: "31", name: "31 - وهران", communes: ["وهران", "بئر الجير", "السانية", "عين الترك", "أرزيو", "قديل", "مسرغين", "بوسفر"] },
    { code: "25", name: "25 - قسنطينة", communes: ["قسنطينة", "الخروب", "عين السمارة", "حامة بوزيان", "ديدوش مراد", "زيغود يوسف"] }
  ];

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
    else if (packId === 'pack2') setCurrentBundleName('عرض القطعتين (باك المطبخ والحمام)');
    else if (packId === 'pack4') setCurrentBundleName('العرض العائلي الفاخر (4 قطع)');
  };

  const scrollToSection = (sectionId) => {
    let targetId = sectionId === 'order-form' ? 'form-container' : sectionId;
    const section = document.getElementById(targetId);
    if (section) {
      const headerOffset = 95;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const handleHeaderOrderClick = () => {
    if (isUserInTrackingMode) {
      setShowNewOrderModal(true);
    } else {
      scrollToSection('order-form');
    }
  };

  const resetAndNewOrder = () => {
    setIsUserInTrackingMode(false);
    setShowNewOrderModal(false);
    setShowOrderPromptModal(false);
    setFormData({
      fullName: '',
      phone: '',
      wilaya: 'الجزائر العاصمة',
      commune: communesList[0] || '',
      shippingType: 'home'
    });
    scrollToSection('order-form');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.commune) return alert('يرجى اختيار البلدية');

    setIsSubmitting(true);
    const orderId = "ORD-" + Math.floor(Math.random() * 899999 + 100000);
    setCurrentActiveOrderId(orderId);

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
        `تكلفة التوصيل: ${currentShippingCost.toLocaleString()} دج\n` +
        `المبلغ الإجمالي: ${grandTotalText} (الدفع عند الاستلام)\n` +
        `العنوان: ${formData.wilaya} - ${formData.commune}\n` +
        `باش نبعثوها، أكّد الطلب بالزر لتحت.\n` +
        `لأي سؤال، كلّمنا على WhatsApp في الرقم 0798353165.\n` +
        `شكراً على ثقتك.`
      );

      setLastOrderDetails({
        orderId,
        bundleName: fullOrderDetails,
        total: grandTotalText,
        whatsappLink: `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${customWhatsAppMsg}`
      });

      setTrackingDetails({
        orderId,
        orderName: fullOrderDetails,
        total: grandTotalText,
        status: 'قيد التأكيد',
        trackingCode: '28-H8G9NDFX0V-ZR',
        customerName: formData.fullName
      });

      setShowSuccessModal(true);
    } else {
      alert('حدث خطأ أثناء حفظ الطلب: ' + error.message);
    }
    setIsSubmitting(false);
  };

  const closeModalToTracking = () => {
    setShowSuccessModal(false);
    setIsUserInTrackingMode(true);
    scrollToSection('tracking-container');
  };

  const searchExistingOrder = () => {
    if (!searchInput.trim()) return alert("يرجى إدخال رقم الطلب أولاً");
    setCurrentActiveOrderId(searchInput.trim());
    setTrackingDetails(prev => ({
      ...prev,
      orderId: searchInput.trim(),
      orderName: 'جاري جلب تفاصيل المنتج...',
      total: '---'
    }));
    setIsUserInTrackingMode(true);
    scrollToSection('tracking-container');
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
          <p className="text-gray-600 text-sm">عذراً، لم نتمكن من العثور على هذا المنتج.</p>
          <a href="/admin" className="inline-block bg-[#754b2d] text-white px-6 py-2.5 rounded-xl font-bold text-sm">العودة للوحة التحكم</a>
        </div>
      </div>
    );
  }

  const currentGallery = product.gallery && product.gallery.length > 0 ? product.gallery : defaultGallery;
  const primaryColor = product.primary_color || '#754b2d';

  const stages = ["قيد التأكيد", "التأكيد", "في شركة التوصيل", "التسليم"];
  const currentStageIndex = stages.indexOf(trackingDetails.status) !== -1 ? stages.indexOf(trackingDetails.status) : 0;

  const renderForm = () => (
    <section id="order-form" className="py-12 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* أداة البحث عن الطلب */}
        {!isUserInTrackingMode && (
          <div id="track-search-section" className="mb-10 bg-[#fdfbf7] rounded-2xl p-6 border border-[#faedcd] shadow-sm text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-[#432818] font-bold">
              <span>🔍 هل لديك طلب سابق وتريد تتبعه؟</span>
            </div>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="text"
                placeholder="مثال: ORD-123456"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none text-sm text-center font-bold"
              />
              <button
                onClick={searchExistingOrder}
                style={{ backgroundColor: primaryColor }}
                className="text-white px-5 py-3 rounded-xl font-bold text-sm shrink-0 transition"
              >
                بحث
              </button>
            </div>
          </div>
        )}

        {/* نموذج الطلب المباشر */}
        {!isUserInTrackingMode && (
          <div id="form-container" className="bg-[#fdfbf7] rounded-3xl p-6 sm:p-8 border-2 border-[#faedcd] shadow-xl">
            <div className="text-center mb-8">
              <span className="inline-block px-3 py-1 rounded-full bg-[#faedcd] text-[#432818] font-extrabold text-xs mb-2">الدفع عند الاستلام 100%</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#432818]">استمارة طلب المنتج</h2>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">يرجى ملء معلوماتك بدقة، وسيتصل بك فريقنا لتأكيد الطلب</p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">العرض المختار:</label>
                <select
                  value={selectedOffer}
                  onChange={e => {
                    const pack = e.target.value;
                    let price = Number(product.price_pack1 || 1900);
                    if (pack === 'pack2') price = Number(product.price_pack2 || 3300);
                    if (pack === 'pack4') price = Number(product.price_pack4 || 6200);
                    selectOffer(pack, price);
                  }}
                  className="w-full p-3.5 rounded-xl border-2 border-[#faedcd] focus:outline-none bg-white font-bold text-sm text-[#432818]"
                >
                  {product.price_pack1 && <option value="pack1">العرض العادي: قطعة واحدة - {Number(product.price_pack1).toLocaleString()} دج</option>}
                  {product.price_pack2 && <option value="pack2">عرض القطعتين: قطعتين - {Number(product.price_pack2).toLocaleString()} دج (الأكثر طلباً)</option>}
                  {product.price_pack4 && <option value="pack4">العرض العائلي الفاخر: 4 قطع - {Number(product.price_pack4).toLocaleString()} دج</option>}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">الاسم الكامل *</label>
                <input required type="text" placeholder="مثال: محمد الأمين" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} className="w-full p-3.5 rounded-xl border border-gray-300 bg-white text-sm" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">رقم الهاتف *</label>
                <input required type="tel" pattern="[0-9]{10}" placeholder="06XX XX XX XX" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full p-3.5 rounded-xl border border-gray-300 bg-white text-sm dir-ltr text-right" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">الولاية *</label>
                  <select value={formData.wilaya} onChange={e => handleWilayaChange(e.target.value)} className="w-full p-3.5 rounded-xl border border-gray-300 bg-white text-sm">
                    {wilayasData.map(w => <option key={w.code} value={w.name.replace(/^\d+\s*-\s*/, '').trim()}>{w.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">البلدية *</label>
                  <select value={formData.commune} onChange={e => setFormData({ ...formData, commune: e.target.value })} className="w-full p-3.5 rounded-xl border border-gray-300 bg-white text-sm">
                    {communesList.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">طريقة التوصيل *</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 p-3 rounded-xl border-2 border-[#faedcd] bg-white cursor-pointer">
                    <input type="radio" name="shipping-type" value="home" checked={formData.shippingType === 'home'} onChange={e => setFormData({ ...formData, shippingType: e.target.value })} />
                    <span className="text-xs font-bold text-[#432818]">توصيل للمنزل 🏠</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 rounded-xl border-2 border-[#faedcd] bg-white cursor-pointer">
                    <input type="radio" name="shipping-type" value="stop" checked={formData.shippingType === 'stop'} onChange={e => setFormData({ ...formData, shippingType: e.target.value })} />
                    <span className="text-xs font-bold text-[#432818]">مكتب الشحن (Stop Desk) 🏢</span>
                  </label>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#faedcd] space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-gray-600"><span>سعر المنتج/العرض:</span><span className="font-bold text-gray-800">{currentPrice.toLocaleString()} دج</span></div>
                <div className="flex justify-between text-gray-600"><span>مصاريف التوصيل:</span><span className="font-bold text-[#754b2d]">{currentShippingCost.toLocaleString()} دج</span></div>
                <div className="pt-2 border-t flex justify-between text-base font-extrabold text-[#432818]"><span>المجموع الكلي للدفع:</span><span className="text-xl" style={{ color: primaryColor }}>{(currentPrice + currentShippingCost).toLocaleString()} دج</span></div>
              </div>

              <button disabled={isSubmitting} type="submit" style={{ backgroundColor: primaryColor }} className="w-full py-4 px-6 rounded-xl text-white font-black text-xl shadow-xl transition-all cursor-pointer disabled:opacity-50">
                {isSubmitting ? 'جاري تأكيد طلبك...' : 'تأكيد الطلب الآن (الدفع عند الاستلام)'}
              </button>
            </form>
          </div>
        )}

        {/* قسم تتبع الطلب النشط */}
        {isUserInTrackingMode && (
          <div id="tracking-container" className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#faedcd] shadow-xl space-y-6">
            <div className="text-center space-y-2 border-b pb-6">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                ✓
              </div>
              <h2 className="text-2xl font-black text-gray-900">تفاصيل وتتبع طلبك</h2>
              <p className="text-xs text-gray-500">شكراً لثقتك بـ Bright DZ. يمكنك متابعة حالة طلبك أدناه</p>
            </div>

            <div className="bg-[#fdfbf7] p-4 rounded-2xl space-y-2 text-xs sm:text-sm border border-[#faedcd]">
              <div className="flex justify-between border-b pb-2"><span className="text-gray-500">رقم الطلب:</span><span className="font-bold text-[#754b2d]">{trackingDetails.orderId}</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-gray-500">المنتج / العرض:</span><span className="font-bold text-[#754b2d]">{trackingDetails.orderName}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">المبلغ الإجمالي:</span><span className="font-bold text-[#754b2d]">{trackingDetails.total}</span></div>
            </div>

            <div className="space-y-6 pt-4 px-2">
              <h3 className="font-bold text-gray-800 text-sm mb-4">مراحل سير الطلب:</h3>
              {stages.map((stg, idx) => {
                const isActive = idx <= currentStageIndex;
                return (
                  <div key={stg} className="flex items-start gap-4 relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 ${isActive ? 'bg-[#754b2d] text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm ${isActive ? 'text-[#432818]' : 'text-gray-400'}`}>{stg}</h4>
                      <p className="text-xs text-gray-500">
                        {idx === 0 && 'تم استلام طلبك وبانتظار اتصال فريق المبيعات لتأكيد البيانات.'}
                        {idx === 1 && 'تم تأكيد الطلب بنجاح وتحويله لتجهيز المنتجات.'}
                        {idx === 2 && 'الطلب في طريقه إليك مع شركة الشحن لعنوانك.'}
                        {idx === 3 && 'تم استلام طلبك ومعاينته ودفع ثمنه بنجاح.'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <a href={`https://wa.me/${STORE_WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="w-full py-3 bg-[#25D366] text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-md">
                تواصل معنا عبر واتساب لمتابعة الطلب 🟢
              </a>
            </div>

            <div className="pt-2">
              <button onClick={() => setShowOrderPromptModal(true)} className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm cursor-pointer">
                إجراء طلب جديد أو بحث آخر
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );

  const priceBox = (
    <div className="pt-2 p-3.5 rounded-2xl bg-gradient-to-r from-white to-[#faedcd] border border-[#faedcd] space-y-2.5">
      <div className="flex justify-between items-baseline">
        <span className="text-xs font-bold text-gray-600">السعر الحالي:</span>
        <span className="text-2xl font-black text-[#432818]">{currentPrice.toLocaleString()} دج</span>
      </div>
      <button onClick={() => scrollToSection('order-form')} style={{ backgroundColor: primaryColor }} className="w-full py-3 rounded-xl text-white font-extrabold text-base shadow-lg animate-pulse cursor-pointer">
        اضغط هنا لتأكيد الطلب والدفع عند الاستلام
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-gray-800 font-sans selection:bg-[#faedcd] selection:text-[#432818]" dir="rtl">
      {/* Top Bar */}
      <div className="text-[#f7f1e5] text-xs sm:text-sm py-2 px-4 text-center font-bold tracking-wide" style={{ backgroundColor: primaryColor }}>
        <span>توصيل سريع لكافة الـ 58 ولاية | الدفع بعد المعاينة والإستلام</span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#f7f1e5] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://img.sanishtech.com/u/bb314dd8f27c1767138139bbdc694d73.png" alt="Bright DZ Logo" className="h-10 w-auto object-contain" />
            <span className="font-black text-xl tracking-tight text-[#432818]">Bright<span style={{ color: primaryColor }}>DZ</span></span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => scrollToSection('order-form')} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg font-bold text-xs cursor-pointer">
              تتبع طلبك
            </button>
            <button onClick={handleHeaderOrderClick} style={{ backgroundColor: primaryColor }} className="text-white px-4 py-2 rounded-lg font-bold text-sm shadow cursor-pointer">
              أطلب الآن
            </button>
          </div>
        </div>
      </header>

      {/* إظهار النموذج في الأعلى عند اختياره */}
      {product.form_position === 'top' && renderForm()}

      {/* Hero Section */}
      <section id="offers-section" className="relative pt-6 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* Gallery */}
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white w-full h-[380px] sm:h-[450px]">
                <img src={mainImage} className="w-full h-full object-cover" alt={product.title} />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {currentGallery.map((imgUrl, idx) => (
                  <button key={idx} onClick={() => setMainImage(imgUrl)} className="rounded-xl overflow-hidden bg-white border-4 transition" style={{ borderColor: mainImage === imgUrl ? primaryColor : 'transparent' }}>
                    <img src={imgUrl} className="w-full h-16 object-cover" alt={`Thumbnail ${idx}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details & Interactive Offer Cards */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#432818]">
                {product.title} <span className="block sm:inline" style={{ color: primaryColor }}>{product.subtitle}</span>
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>

              {product.price_box_position === 'below_description' && priceBox}

              {/* بطاقات العروض التفاعلية */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-bold text-gray-700">اختر العرض المناسب لك:</label>
                
                {product.price_pack1 && (
                  <div onClick={() => selectOffer('pack1', Number(product.price_pack1))} className={`p-3 rounded-xl border-2 flex justify-between cursor-pointer ${selectedOffer === 'pack1' ? 'bg-[#f7f1e5]' : 'border-gray-200 bg-white'}`} style={{ borderColor: selectedOffer === 'pack1' ? primaryColor : '' }}>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-[#432818]">العرض العادي (قطعة واحدة)</h4>
                      <p className="text-[11px] text-gray-500">مناسب لحمام واحد أو مطبخ</p>
                    </div>
                    <span className="font-black text-[#432818] text-sm">{Number(product.price_pack1).toLocaleString()} دج</span>
                  </div>
                )}

                {product.price_pack2 && (
                  <div onClick={() => selectOffer('pack2', Number(product.price_pack2))} className={`p-3 rounded-xl border-2 flex justify-between cursor-pointer relative ${selectedOffer === 'pack2' ? 'bg-[#f7f1e5]' : 'border-gray-200 bg-white'}`} style={{ borderColor: selectedOffer === 'pack2' ? primaryColor : '' }}>
                    <span className="absolute top-0 left-0 bg-red-600 text-white text-[9px] px-2 py-0.5 rounded-br-lg font-bold">توفير رائع</span>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-[#432818]">عرض القطعتين (باك المطبخ والحمام) 🔥</h4>
                      <p className="text-[11px] text-gray-500">قطعتين لتغطية المنزل بالكامل</p>
                    </div>
                    <span className="font-black text-[#432818] text-sm">{Number(product.price_pack2).toLocaleString()} دج</span>
                  </div>
                )}

                {product.price_pack4 && (
                  <div onClick={() => selectOffer('pack4', Number(product.price_pack4))} className={`p-3 rounded-xl border-2 flex justify-between cursor-pointer ${selectedOffer === 'pack4' ? 'bg-[#f7f1e5]' : 'border-gray-200 bg-white'}`} style={{ borderColor: selectedOffer === 'pack4' ? primaryColor : '' }}>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-[#432818]">العرض العائلي الفاخر (4 قطع)</h4>
                      <p className="text-[11px] text-gray-500">أقصى توفير للعائلات الكبيرة</p>
                    </div>
                    <span className="font-black text-[#432818] text-sm">{Number(product.price_pack4).toLocaleString()} دج</span>
                  </div>
                )}
              </div>

              {product.price_box_position === 'above_offers' && priceBox}

            </div>

          </div>
        </div>
      </section>

      {/* إظهار النموذج في الأسفل بشكل افتراضي */}
      {(!product.form_position || product.form_position === 'bottom') && renderForm()}

      {/* Success Modal */}
      {showSuccessModal && lastOrderDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">✓</div>
            <h3 className="text-2xl font-black text-gray-800">تم تسجيل طلبك بنجاح!</h3>
            <div className="bg-gray-50 p-4 rounded-2xl text-right space-y-2 border border-gray-100 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">رقم الطلب:</span><span className="font-bold text-[#754b2d]">{lastOrderDetails.orderId}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">المنتج:</span><span className="font-bold text-[#754b2d]">{lastOrderDetails.bundleName}</span></div>
            </div>
            <a href={lastOrderDetails.whatsappLink} target="_blank" rel="noreferrer" className="block w-full py-3.5 bg-[#25D366] text-white font-extrabold rounded-xl">
              تأكيد الطلب الآن عبر واتساب 🟢
            </a>
            <button onClick={closeModalToTracking} className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm cursor-pointer">
              الانتقال لمتابعة مراحل التتبع
            </button>
          </div>
        </div>
      )}

      {/* New Order Modal */}
      {showNewOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 text-center space-y-4">
            <h3 className="text-lg font-black text-[#432818]">تأكيد طلب جديد</h3>
            <p className="text-sm text-gray-600">هل أنت متأكد من رغبتك في الانتقال لطلب منتج جديد؟</p>
            <div className="flex flex-col gap-2">
              <button onClick={resetAndNewOrder} style={{ backgroundColor: primaryColor }} className="w-full text-white py-2.5 rounded-xl font-bold text-sm cursor-pointer">
                الانتقال إلى صفحة الطلب
              </button>
              <button onClick={() => setShowNewOrderModal(false)} className="w-full text-gray-500 py-1.5 text-xs font-semibold cursor-pointer">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Prompt Modal */}
      {showOrderPromptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 text-center space-y-4">
            <h3 className="text-lg font-black text-[#432818]">معلومات طلبك الحالي</h3>
            <p className="text-xs text-gray-500">رقم الأوردر الخاص بك: <strong>{currentActiveOrderId}</strong></p>
            <div className="flex flex-col gap-2 pt-2">
              <button onClick={resetAndNewOrder} style={{ backgroundColor: primaryColor }} className="w-full text-white py-2.5 rounded-xl font-bold text-sm cursor-pointer">
                إجراء طلب جديد 🛒
              </button>
              <button onClick={() => setShowOrderPromptModal(false)} className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-xl font-bold text-sm cursor-pointer">
                البقاء على صفحة التتبع 📍
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}