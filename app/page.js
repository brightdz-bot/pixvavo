'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function StoreFront() {
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState({ store_name: 'pixvavo' });
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Checkout Form
  const [formData, setFormData] = useState({ name: '', phone: '', wilaya: '', commune: '' });
  const [shippingCost, setShippingCost] = useState(0);

  useEffect(() => {
    fetchStoreData();
  }, []);

  async function fetchStoreData() {
    const { data: prodData } = await supabase.from('products').select('*');
    const { data: setData } = await supabase.from('settings').select('*').single();
    
    if (prodData) setProducts(prodData);
    if (setData) {
      setSettings(setData);
      initMetaPixel(setData.pixel_id);
    }
  }

  function initMetaPixel(pixelId) {
    if (!pixelId || window.fbq) return;
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');
  }

  const addToCart = (product) => {
    const exist = cart.find(x => x.id === product.id);
    if (exist) {
      setCart(cart.map(x => x.id === product.id ? { ...exist, qty: exist.qty + 1 } : x));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    if (window.fbq) window.fbq('track', 'AddToCart', { content_name: product.title, value: product.price });
    setIsCartOpen(true);
  };

  const handleWilayaChange = (e) => {
    const wilaya = e.target.value;
    const cost = wilaya === 'الجزائر' ? 400 : wilaya ? 600 : 0;
    setShippingCost(cost);
    setFormData({ ...formData, wilaya });
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const total = subtotal + shippingCost;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert('السلة فارغة!');

    const orderPayload = {
      customer_name: formData.name,
      phone: formData.phone,
      wilaya: formData.wilaya,
      commune: formData.commune,
      cart_items: cart,
      total_price: total
    };

    const { error } = await supabase.from('orders').insert([orderPayload]);

    if (!error) {
      if (settings.webhook_url) {
        fetch(settings.webhook_url, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload)
        });
      }

      if (window.fbq) window.fbq('track', 'Purchase', { value: total, currency: 'DZD' });

      alert('تم إرسال طلبك بنجاح! سيتصل بك فريقنا لتأكيد الطلب.');
      setCart([]);
      setIsCartOpen(false);
    } else {
      alert('حدث خطأ أثناء إرسال الطلب، يرجى المحاولة لاحقاً.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans" dir="rtl">
      {/* Navbar */}
      <header className="bg-slate-900 text-white p-4 shadow-lg sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-indigo-400">{settings.store_name}</h1>
          <button onClick={() => setIsCartOpen(true)} className="relative bg-indigo-600 px-4 py-2 rounded-lg flex items-center gap-2">
            <span>🛒 السلة</span>
            <span className="bg-white text-indigo-600 font-bold text-xs px-2 py-0.5 rounded-full">
              {cart.reduce((a, c) => a + c.qty, 0)}
            </span>
          </button>
        </div>
      </header>

      {/* Store Front Products */}
      <main className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="bg-indigo-900 text-white p-8 rounded-2xl shadow-md">
          <h2 className="text-3xl font-bold">أهلاً بك في {settings.store_name}</h2>
          <p className="text-indigo-200 mt-2">تسوق أفضل المنتجات مع خدمة التوصيل والدفع عند الاستلام</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow border overflow-hidden flex flex-col justify-between">
              <img src={product.image_url} alt={product.title} className="w-full h-48 object-cover" />
              <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg">{product.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">{product.description}</p>
                </div>
                <div className="flex justify-between items-center border-t pt-3">
                  <span className="text-xl font-bold text-indigo-600">{product.price} د.ج</span>
                  <button onClick={() => addToCart(product)} className="bg-indigo-600 text-white text-xs px-4 py-2 rounded-lg font-bold">
                    أضف للسلة
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center border-b pb-4">
                <h3 className="text-lg font-bold">سلة الشراء</h3>
                <button onClick={() => setIsCartOpen(false)} className="text-xl">✕</button>
              </div>
              <div className="space-y-4 my-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <div className="font-bold text-sm">{item.title}</div>
                      <div className="text-xs text-indigo-600">{item.price} د.ج x {item.qty}</div>
                    </div>
                    <span className="font-bold">{item.price * item.qty} د.ج</span>
                  </div>
                ))}
              </div>

              {/* Checkout Form */}
              <form id="order-form" onSubmit={handleSubmitOrder} className="space-y-3 border-t pt-4">
                <h4 className="font-bold text-sm">بيانات الشحن (COD)</h4>
                <input required placeholder="الاسم الكامل" className="w-full p-2 border rounded text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <input required placeholder="رقم الهاتف" className="w-full p-2 border rounded text-sm" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                <select required className="w-full p-2 border rounded text-sm bg-white" onChange={handleWilayaChange}>
                  <option value="">اختر الولاية</option>
                  <option value="الجزائر">01. الجزائر (400 د.ج)</option>
                  <option value="وهران">31. وهران (600 د.ج)</option>
                  <option value="سطيف">19. سطيف (600 د.ج)</option>
                  <option value="ولايات أخرى">باقي الولايات (600 د.ج)</option>
                </select>
                <input required placeholder="البلدية والعنوان" className="w-full p-2 border rounded text-sm" value={formData.commune} onChange={e => setFormData({...formData, commune: e.target.value})} />
              </form>
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between font-bold text-lg">
                <span>الإجمالي:</span>
                <span className="text-indigo-600">{total} د.ج</span>
              </div>
              <button type="submit" form="order-form" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg">
                تأكيد الطلب الآن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}