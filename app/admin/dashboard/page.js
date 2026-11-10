'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newProduct, setNewProduct] = useState({ title: '', price: '', old_price: '', image_url: '', description: '' });
  const router = useRouter();

  useEffect(() => {
    checkUser();
    fetchAdminData();
  }, []);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/admin/login');
    } else {
      setUser(session.user);
    }
  }

  async function fetchAdminData() {
    const { data: prodData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    const { data: ordData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (prodData) setProducts(prodData);
    if (ordData) setOrders(ordData);
  }

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('products').insert([
      { 
        title: newProduct.title, 
        price: parseFloat(newProduct.price), 
        old_price: newProduct.old_price ? parseFloat(newProduct.old_price) : null, 
        image_url: newProduct.image_url, 
        description: newProduct.description 
      }
    ]);

    if (!error) {
      alert('تم إضافة المنتج بنجاح!');
      setNewProduct({ title: '', price: '', old_price: '', image_url: '', description: '' });
      fetchAdminData();
    } else {
      alert('حدث خطأ: ' + error.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (confirm('هل أنت تأكد من حذف هذا المنتج؟')) {
      await supabase.from('products').delete().eq('id', id);
      fetchAdminData();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (!user) return <div className="p-8 text-center font-bold" dir="rtl">جاري التحقق من الصلاحيات...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-slate-900 text-white p-4 rounded-xl shadow">
          <div>
            <h1 className="text-xl font-bold">إدارة متجر pixvavo</h1>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
          <button onClick={handleLogout} className="bg-red-600 text-xs px-4 py-2 rounded font-bold hover:bg-red-700">
            تسجيل الخروج
          </button>
        </div>

        {/* Add Product Section */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-lg font-bold border-b pb-2">إضافة منتج جديد</h2>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder="اسم المنتج" className="p-2 border rounded text-sm" value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} />
            <input required placeholder="رابط الصورة (URL)" className="p-2 border rounded text-sm" value={newProduct.image_url} onChange={e => setNewProduct({...newProduct, image_url: e.target.value})} />
            <input required type="number" placeholder="السعر الحالي (د.ج)" className="p-2 border rounded text-sm" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
            <input type="number" placeholder="السعر القديم (اختياري)" className="p-2 border rounded text-sm" value={newProduct.old_price} onChange={e => setNewProduct({...newProduct, old_price: e.target.value})} />
            <textarea placeholder="وصف المنتج" className="md:col-span-2 p-2 border rounded text-sm" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})}></textarea>
            <button type="submit" className="md:col-span-2 bg-indigo-600 text-white py-2 rounded font-bold hover:bg-indigo-700">حفظ المنتج</button>
          </form>
        </div>

        {/* Manage Products Section */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-lg font-bold border-b pb-2">المنتجات الحالية ({products.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map(p => (
              <div key={p.id} className="border p-3 rounded-lg flex flex-col justify-between space-y-2">
                <img src={p.image_url} alt={p.title} className="w-full h-32 object-cover rounded" />
                <div>
                  <h3 className="font-bold text-sm">{p.title}</h3>
                  <p className="text-indigo-600 font-bold text-sm">{p.price} د.ج</p>
                </div>
                <button onClick={() => handleDeleteProduct(p.id)} className="w-full bg-red-100 text-red-600 py-1 rounded text-xs font-bold hover:bg-red-200">
                  حذف المنتج
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-lg font-bold border-b pb-2">الطلبيات الحديثة ({orders.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3">الزبون</th>
                  <th className="p-3">الهاتف</th>
                  <th className="p-3">الولاية/البلدية</th>
                  <th className="p-3">الإجمالي</th>
                  <th className="p-3">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map(o => (
                  <tr key={o.id}>
                    <td className="p-3 font-bold">{o.customer_name}</td>
                    <td className="p-3">{o.phone}</td>
                    <td className="p-3">{o.wilaya} - {o.commune}</td>
                    <td className="p-3 font-bold text-indigo-600">{o.total_price} د.ج</td>
                    <td className="p-3 text-xs text-gray-500">{new Date(o.created_at).toLocaleDateString('ar-DZ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}