'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function StoreLandingPage() {
  const [selectedOffer, setSelectedOffer] = useState('pack2');
  const [currentPrice, setCurrentPrice] = useState(3300);
  const [currentBundleName, setCurrentBundleName] = useState('عرض القطعتين (باك المطبخ والحمام)');
  const [currentShippingCost, setCurrentShippingCost] = useState(600);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    wilaya: 'الجزائر العاصمة',
    commune: '',
    shippingType: 'home'
  });

  const [mainImage, setMainImage] = useState(
    'https://scontent.faae2-3.fna.fbcdn.net/v/t39.30808-6/891645324_2341177369970489_6005702391524640935_n.jpg?stp=dst-jpg_tt6&cstp=mx1254x1254&ctp=p526x296&_nc_cat=110&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHdhaOT53EvVVuN9NaumDPny-pDc-qqsNzL6kNz6qqw3P_mVw5CayByftgunnY2ckgD-i9wvTT-MReTbSfqTiyv&_nc_ohc=E8fC4sMyOfoQ7kNvwElkwPD&_nc_oc=AdobGh5OBUdUwbVuvv0dctISmPFkouHTdJ-rq3V-9B5K483gdr-5UKA9sIQWP_U7rSM&_nc_zt=23&_nc_ht=scontent.faae2-3.fna&_nc_gid=z5ug3hUCiW643YapprSaWA&_nc_ss=7b2a8&oh=00_AQRYCIm-Gtx5SbJvWycYJ1VdSQxtDEVkoyhdHUkCGsUkuw&oe=6AF573F7'
  );

  const [communesList, setCommunesList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastOrderDetails, setLastOrderDetails] = useState(null);

  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx_xl6iWvDlh2QDtLGgLQUz8fHh2ilJqyejT_18jm3gK_DGGPqg6olAyY3iZJVyu26a/exec';
  const STORE_WHATSAPP_NUMBER = '213798353165';

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
    { code: "2", name: "02 - الشلف", communes: ["أبو الحسن", "عين مران", "بنايرية", "بني بوعتاب", "بني حواء", "بني راشد", "بوقادير", "بوزغاية", "بريرة", "الشطية", "الشلف", "الظهرة", "الحجاج", "الكريمية", "المرسى", "حرشون", "الهرانفة", "الأبيض مجاجة", "مصدق", "وادي الفضة", "وادي قوسين", "وادي سلي", "أولاد عباس", "أولاد بن عبد القادر", "أولاد فارس", "أم الدروع", "سنجاس", "سيدي عبد الرحمن", "سيدي عكاشة", "الصبحة", "تاجنة", "تلعصة", "تاوقريت", "تنس", "الزبوجة"] },
    { code: "16", name: "16 - الجزائر العاصمة", communes: ["الجزائر الوسطى", "باب الوادي", "سيدي امحمد", "الأبيار", "حيدرة", "بن عكنون", "الشراقة", "دالي إبراهيم", "الدرارية", "بئر مراد رايس", "بئر خادم", "القبة", "الحراش", "باب الزوار", "الدار البيضاء", "الرويبة", "زرالدة", "عين البنيان", "الرغاية", "البرج الكيفان", "الكاليتوس", "براقي", "باش جراح", "المقرية", "المرادية", "بوزريعة", "بني المسوس", "السحاولة", "الخرايسية", "العاشور"] },
    { code: "19", name: "19 - سطيف", communes: ["سطيف", "العلمة", "عين أرنات", "عين ولمان", "عين الكبيرة", "بوعنداس", "بوقاعة"] },
    { code: "31", name: "31 - وهران", communes: ["وهران", "بئر الجير", "السانية", "عين الترك", "أرزيو", "قديل"] }
  ];

  useEffect(() => {
    handleWilayaChange('الجزائر العاصمة');
    initMetaPixel();
  }, []);

  function initMetaPixel() {
    if (window.fbq) return;
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', '1130382356394829');
    window.fbq('track', 'PageView');
  }

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
    calculateShipping(cleanWilaya, formData.shippingType);
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
    else if (packId === 'pack4') setCurrentBundleName('العرض العائي الفاخر (4 قطع)');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.commune) return alert('يرجى اختيار البلدية');

    setIsSubmitting(true);
    const orderId = "ORD-" + Math.floor(Math.random() * 899999 + 100000);
    const grandTotal = currentPrice + currentShippingCost;
    const shippingTypeText = formData.shippingType === 'home' ? 'توصيل للمنزل 🏠' : 'مكتب الشحن Stop Desk 🏢';

    const orderPayload = {
      customer_name: formData.fullName,
      phone: formData.phone,
      wilaya: formData.wilaya,
      commune: formData.commune,
      cart_items: [{ title: currentBundleName, price: currentPrice, qty: selectedOffer === 'pack2' ? 2 : selectedOffer === 'pack4' ? 4 : 1 }],
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
        scriptData.append('order', currentBundleName);
        scriptData.append('status', 'قيد التأكيد');
        scriptData.append('totalPrice', `${grandTotal} دج`);

        fetch(GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: scriptData }).catch(() => {});
      }

      if (window.fbq) window.fbq('track', 'Purchase', { value: grandTotal, currency: 'DZD' });

      const customMsg = encodeURIComponent(
        `السلام عليكم ${formData.fullName}،\nتم إرسال طلبكم بخصوص: ${currentBundleName}\nالمبلغ الإجمالي: ${grandTotal} دج\nالعنوان: ${formData.wilaya} - ${formData.commune}`
      );

      setLastOrderDetails({
        orderId,
        bundleName: currentBundleName,
        total: grandTotal,
        whatsappLink: `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${customMsg}`
      });

      setShowSuccessModal(true);
    } else {
      alert('حدث خطأ أثناء حفظ الطلب: ' + error.message);
    }
    setIsSubmitting(false);
  };

  const totalAmount = currentPrice + currentShippingCost;

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-gray-800 font-sans" dir="rtl">
      {/* Top Bar */}
      <div className="bg-[#432818] text-[#f7f1e5] text-xs sm:text-sm py-2 px-4 text-center font-bold tracking-wide">
        توصيل سريع لكافة الـ 58 ولاية | الدفع بعد المعاينة والإستلام
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#f7f1e5] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://img.sanishtech.com/u/bb314dd8f27c1767138139bbdc694d73.png" alt="Bright DZ Logo" className="h-10 w-auto object-contain" />
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight text-[#432818] leading-none">Bright<span className="text-[#bc8a5f]">DZ</span></span>
              <span className="text-[10px] text-gray-500 font-semibold">متجر الجودة والديكور العصري</span>
            </div>
          </div>
          <a href="#checkout-form" className="bg-[#754b2d] hover:bg-[#432818] text-white px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-md">
            أطلب الآن
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-6 pb-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Images Gallery */}
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white h-[380px] sm:h-[450px]">
              <img src={mainImage} className="w-full h-full object-cover" alt="Main product" />
            </div>
          </div>

          {/* Offer Details */}
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#432818] leading-tight">
              حامل المناشف الخشبي الفاخر <span className="text-[#bc8a5f] block sm:inline">بنظام القفل بالجاذبية</span>
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              أضف لمسة جمالية وعصرية لحمامك أو مطبخك! مشبك تثبيت فريد مصنوع من الخشب الطبيعي المحمي ضد الرطوبة بدون ثقب الجدران.
            </p>

            {/* Offer Select Cards */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-bold text-gray-700">اختر العرض المناسب لك:</label>
              
              <div onClick={() => selectOffer('pack1', 1900)} className={`p-3 rounded-xl border-2 flex items-center justify-between cursor-pointer ${selectedOffer === 'pack1' ? 'border-[#754b2d] bg-[#f7f1e5]' : 'border-gray-200 bg-white'}`}>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#432818]">العرض العادي (قطعة واحدة)</h4>
                </div>
                <span className="font-black text-[#432818] text-sm">1,900 دج</span>
              </div>

              <div onClick={() => selectOffer('pack2', 3300)} className={`p-3 rounded-xl border-2 flex items-center justify-between cursor-pointer ${selectedOffer === 'pack2' ? 'border-[#754b2d] bg-[#f7f1e5]' : 'border-gray-200 bg-white'}`}>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#432818]">عرض القطعتين (باك المطبخ والحمام) 🔥</h4>
                </div>
                <span className="font-black text-[#432818] text-sm">3,300 دج</span>
              </div>

              <div onClick={() => selectOffer('pack4', 6200)} className={`p-3 rounded-xl border-2 flex items-center justify-between cursor-pointer ${selectedOffer === 'pack4' ? 'border-[#754b2d] bg-[#f7f1e5]' : 'border-gray-200 bg-white'}`}>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#432818]">العرض العائلي الفاخر (4 قطع)</h4>
                </div>
                <span className="font-black text-[#432818] text-sm">6,200 دج</span>
              </div>
            </div>

            {/* Selected Price */}
            <div className="pt-2 p-4 rounded-2xl bg-[#faedcd] border border-[#d4a373]">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold text-gray-600">السعر المختار الآن:</span>
                <span className="text-2xl font-black text-[#432818]">{currentPrice.toLocaleString()} دج</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Checkout Form Section */}
      <section id="checkout-form" className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-[#fdfbf7] rounded-3xl p-6 sm:p-8 border-2 border-[#faedcd] shadow-xl">
            <div className="text-center mb-8">
              <span className="inline-block px-3 py-1 rounded-full bg-[#faedcd] text-[#432818] font-extrabold text-xs mb-2">الدفع عند الاستلام 100%</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#432818]">استمارة طلب المنتج</h2>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">الاسم الكامل *</label>
                <input required type="text" placeholder="مثال: محمد الأمين" className="w-full p-3.5 rounded-xl border border-gray-300 focus:outline-none bg-white text-sm" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">رقم الهاتف *</label>
                <input required type="tel" placeholder="06XX XX XX XX" className="w-full p-3.5 rounded-xl border border-gray-300 focus:outline-none bg-white text-sm" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">الولاية *</label>
                  <select required className="w-full p-3.5 rounded-xl border border-gray-300 bg-white text-sm" value={formData.wilaya} onChange={e => handleWilayaChange(e.target.value)}>
                    {wilayasData.map(w => (
                      <option key={w.code} value={w.name.replace(/^\d+\s*-\s*/, '').trim()}>{w.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">البلدية *</label>
                  <select required className="w-full p-3.5 rounded-xl border border-gray-300 bg-white text-sm" value={formData.commune} onChange={e => setFormData({ ...formData, commune: e.target.value })}>
                    {communesList.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">طريقة التوصيل *</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center gap-2 p-3 rounded-xl border-2 bg-white cursor-pointer ${formData.shippingType === 'home' ? 'border-[#754b2d]' : 'border-gray-200'}`}>
                    <input type="radio" name="shipping-type" value="home" checked={formData.shippingType === 'home'} onChange={() => { setFormData({ ...formData, shippingType: 'home' }); calculateShipping(formData.wilaya, 'home'); }} />
                    <span className="text-xs font-bold">توصيل للمنزل 🏠</span>
                  </label>
                  <label className={`flex items-center gap-2 p-3 rounded-xl border-2 bg-white cursor-pointer ${formData.shippingType === 'stop' ? 'border-[#754b2d]' : 'border-gray-200'}`}>
                    <input type="radio" name="shipping-type" value="stop" checked={formData.shippingType === 'stop'} onChange={() => { setFormData({ ...formData, shippingType: 'stop' }); calculateShipping(formData.wilaya, 'stop'); }} />
                    <span className="text-xs font-bold">مكتب الشحن Stop Desk 🏢</span>
                  </label>
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-white p-4 rounded-xl border border-[#faedcd] space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>سعر العرض:</span><span className="font-bold text-gray-800">{currentPrice.toLocaleString()} دج</span></div>
                <div className="flex justify-between text-gray-600"><span>مصاريف التوصيل:</span><span className="font-bold text-[#754b2d]">{currentShippingCost.toLocaleString()} دج</span></div>
                <div className="pt-2 border-t flex justify-between text-base font-extrabold text-[#432818]"><span>المجموع الكلي:</span><span className="text-xl text-[#754b2d]">{totalAmount.toLocaleString()} دج</span></div>
              </div>

              <button disabled={isSubmitting} type="submit" className="w-full py-4 px-6 rounded-xl bg-[#754b2d] hover:bg-[#432818] text-white font-black text-xl shadow-xl transition-all">
                {isSubmitting ? 'جاري تأكيد الطلب...' : 'تأكيد الطلب الآن (الدفع عند الاستلام)'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Success Modal */}
      {showSuccessModal && lastOrderDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
            <h3 className="text-2xl font-black text-gray-800">تم تسجيل طلبك بنجاح!</h3>
            <div className="bg-gray-50 p-4 rounded-2xl text-right space-y-2 text-sm border">
              <div className="flex justify-between"><span>رقم الطلب:</span><span className="font-bold text-[#754b2d]">{lastOrderDetails.orderId}</span></div>
              <div className="flex justify-between"><span>المنتج:</span><span className="font-bold text-[#754b2d]">{lastOrderDetails.bundleName}</span></div>
            </div>
            <a href={lastOrderDetails.whatsappLink} target="_blank" rel="noreferrer" className="w-full py-3.5 bg-[#25D366] text-white font-extrabold rounded-xl flex items-center justify-center gap-2">
              تأكيد الطلب الآن عبر واتساب 🟢
            </a>
            <button onClick={() => setShowSuccessModal(false)} className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl">
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}