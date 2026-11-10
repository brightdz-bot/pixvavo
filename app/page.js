'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function StoreLandingPage() {
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
    { code: "2", name: "02 - الشلف", communes: ["أبو الحسن", "عين مران", "بنايرية", "بني بوعتاب", "بني حواء", "بني راشد", "بوقادير", "بوزغاية", "بريرة", "الشطية", "الشلف", "الظهرة", "الحجاج", "الكريمية", "المرسى", "حرشون", "الهرانفة", "الأبيض مجاجة", "مصدق", "وادي الفضة", "وادي قوسين", "وادي سلي", "أولاد عباس", "أولاد بن عبد القادر", "أولاد فارس", "أم الدروع", "سنجاس", "سيدي عبد الرحمن", "سيدي عكاشة", "الصبحة", "تاجنة", "تلعصة", "تاوقريت", "تنس", "الزبوجة"] },
    { code: "3", name: "03 - الأغواط", communes: ["أفلو", "عين ماضي", "عين سيدي علي", "بن ناصر بن شهرة", "بريدة", "العسافية", "البيضاء", "الغيشة", "الحويطة", "قلتة سيدي سعد", "الحاج مشري", "حاسي الدلاعة", "حاسي الرمل", "الخنق", "قصر الحيران", "الأغواط", "وادي مزي", "وادي مرة", "سبقاق", "سيدي بوزيد", "سيدي مخلوف", "تاجموت", "تاجرونة", "تاويالة"] },
    { code: "4", name: "04 - أم البواقي", communes: ["عين ببوش", "عين البيضاء", "عين الديس", "عين فكرون", "عين كرشة", "عين مليلة", "عين الزيتون", "بحير الشرقي", "بريش", "بئر الشهداء", "الضلعة", "العامرية", "البلالة", "الجازية", "الفجوج بوغرارة سعودي", "الحرملية", "فكيرينة", "هنشير تومغني", "قصر الصباحي", "مسكيانة", "وادي نيني", "أولاد قاسم", "أولاد حملة", "أولاد زواي", "أم البواقي", "الرحية", "سيقوس", "سوق نعمان", "الزرق"] },
    { code: "5", name: "05 - باتنة", communes: ["عين جاسر", "عين التوتة", "عين ياقوت", "أريس", "عزيل عبد القادر", "بريكة", "باتنة", "بني فضالة الحقانية", "بيطام", "بولهيلات", "بومقر", "بومية", "بوزينة", "الشمرة", "شير", "جرمة", "الجزار", "الحاسي", "المعذر", "فسديس", "فم الطوب", "غسيرة", "القصبات", "القيقبة", "حيدوسة", "إشمول", "إينوغيسن", "كيمل", "قصر بلزمة", "لارباع", "لازرو", "لمسان", "إمدوكل", "معافة", "منعة", "مروانة", "نقاوس", "وادي الشعبة", "وادي الماء", "وادي الطاقة", "أولاد عمار", "أولاد عوف", "أولاد فاضل", "أولاد سلام", "أولاد سي سليمان", "عيون العصافير", "الرحبات", "رأس العيون", "سفيان", "سقانة", "سريانة", "تكوت", "تالخمت", "تاكسلانت", "تازولت", "ثنية العابد", "تيغانمين", "تغرغار", "تيلاطو", "تيمقاد", "زانة البيضاء"] },
    { code: "6", name: "06 - بجاية", communes: ["أدكار", "أيت رزين", "أيت إسماعيل", "أقبو", "أكفادو", "أمالو", "أميزور", "أوقاس", "برباشة", "بجاية", "بني جليل", "بني كسيلة", "بني مليكش", "بني معوش", "بو جليل", "بوحمزة", "بوخليفة", "شلاطة", "شميني", "درقينة", "ذراع القايد", "القصر", "فناية الماثن", "فرعون", "إغيل علي", "اغرم", "كنديرة", "خراطة", "الفلاي", "مسيسنة", "مالبو", "وادي غير", "أوزلاقن", "صدوق", "سيدي عياد", "سيدي عيش", "سمعون", "سوق لإثنين", "سوق اوفلا", "تالة حمزة", "تامقرة", "تامريجت", "تاوريرت إغيل", "تاسكريوت", "تازمالت", "طيبان", "تيشي", "تيفرة", "تيمزريت", "تينبدار", "تيزي نبربر", "توجة"] },
    { code: "7", name: "07 - بسكرة", communes: ["عين الناقة", "عين زعطوط", "بسكرة", "برج بن عزوز", "بوشقرون", "برانيس", "شتمة", "جمورة", "الفيض", "الغروس", "الحاجب", "الحوش", "القنطرة", "الوطاية", "فوغالة", "خنقة سيدي ناجي", "ليشانة", "ليوة", "مشونش", "مليلي", "مخادمة", "المزيرعة", "أوماش", "أورلال", "سيدي عقبة", "طولقة", "زريبة الوادي"] },
    { code: "8", name: "08 - بشار", communes: ["العبادلة", "بشار", "بني ونيف", "بوكايس", "عرق فراج", "القنادسة", "لحمر", "مشرع هواري بومدين", "المريجة", "موغل", "تاغيت"] },
    { code: "9", name: "09 - البليدة", communes: ["عين الرمانة", "بني مراد", "بني تامو", "بن خليل", "البليدة", "بوعرفة", "بوفاريك", "بوقرة", "بوعينان", "الشبلي", "الشفة", "الشريعة", "جبابرة", "العفرون", "قرواو", "حمام ملوان", "الأربعاء", "مفتاح", "موزاية", "وادي جر", "وادي العلايق", "اولاد سلامة", "أولاد يعيش", "صوحان", "الصومعة"] },
    { code: "10", name: "10 - البويرة", communes: ["أغبالو", "أهل القصر", "عين الحجر", "عين العلوي", "عين الترك", "عين بسام", "أيت لعزيز", "أعمر", "آث منصور", "بشلول", "بئر غبالو", "برج أوخريص", "بودربالة", "البويرة", "بوكرم", "شرفة", "الدشمية", "ديرة", "جباحية", "العجيبة", "الأسنام", "الهاشمية", "الخبوزية", "الحاكمية", "المقراني", "قرومة", "الحجرة الزرقاء", "حيزر", "حنيف", "قادرية", "الأخضرية", "أمشدالة", "معلة", "المعمورة", "مزدور", "وادي البردي", "أولاد راشد", "روراوة", "ريدان", "سحاريج", "سوق الخميس", "سور الغزلان", "تاغزوت", "تاقديت", "زبربر"] },
    { code: "11", name: "11 - تمنراست", communes: ["ابلسة", "عين امقل", "أدلس", "تمنراست", "تاظروك"] },
    { code: "12", name: "12 - تبسة", communes: ["عين الزرقاء", "بجن", "بكارية", "بئر الذهب", "بئر مقدم", "بئر العاتر", "بوخضرة", "بولحاف الدير", "الشريعة", "الكويف", "الماء الابيض", "المريج", "المزرعة", "العقلة", "العقلة المالحة", "العوينات", "الحويجبات", "فركان", "قريقر", "الحمامات", "مرسط", "نقرين", "الونزة", "أم علي", "صفصاف الوسرى", "سطح قنطيس", "تبسة", "ثليجان"] },
    { code: "13", name: "13 - تلمسان", communes: ["عين فتاح", "عين فزة", "عين غرابة", "عين الكبيرة", "عين النحالة", "عين تالوت", "عين يوسف", "عمير", "العزايل", "باب العسة", "بني بهدل", "بني بوسعيد", "بني خلاد", "بني مستر", "بني وارسوس", "بني صميل", "بني سنوس", "بن سكران", "بوحلو", "البويهي", "شتوان", "دار يغمراسن", "جبالة", "العريشة", "الفحول", "القور", "فلاوسن", "الغزوات", "حمام بوغرارة", "الحناية", "هنين", "مغنية", "منصورة", "مرسى بن مهيدي", "مسيردة الفواقة", "ندرومة", "وادي الخضر", "أولاد ميمون", "أولاد رياح", "الرمشي", "صبرة", "سبعة شيوخ", "سبدو", "سيدي العبدلي", "سيدي الجيلالي", "سيدي مجاهد", "السواحلية", "السواني", "سوق الثلاثاء", "تيرني بني هديل", "تيانت", "تلمسان", "زناتة"] },
    { code: "14", name: "14 - تيارت", communes: ["عين بوشقيف", "عين الذهب", "عين دزاريت", "عين الحديد", "عين كرمس", "بوقرة", "شحيمة", "دحموني", "جبيلات الرصفاء", "جيلالي بن عمار", "الفايجة", "فرندة", "قرطوفة", "حمادية", "قصر الشلالة", "مادنة", "مهدية", "مشرع الصفا", "مدريسة", "مدروسة", "مغيلة", "ملاكو", "الناظورة", "النعيمة", "وادي ليلي", "الرحوية", "الرشايقة", "السبعين", "السبت", "سرغين", "سي عبد الغني", "سيدي عبد الرحمن", "سيدي علي ملال", "سيدي بختي", "سيدي حسني", "السوقر", "تاقدمت", "تخمرت", "تيارت", "تيدة", "توسنينة", "زمالة الأمير عبد القادر"] },
    { code: "15", name: "15 - تيزي وزو", communes: ["أبي يوسف", "أغريب", "أقني قغران", "عين الحمام", "عين الزاوية", "أيت عقـواشة", "أيت بــوادو", "أيت بومهدي", "أيت خليلي", "أيت يحي موسى", "أيت عيسى ميمون", "أيت شافع", "أيت محمود", "أيت أومالو", "أيت تودرت", "أيت يحيى", "اقبيل", "أقرو", "أسي يوسف", "عزازقة", "أزفون", "بنــــي زمنزار", "بني عيسي", "بني دوالة", "بني يني", "بني زيكــي", "بوغني", "بوجيمة", "بونوح", "بوزقــن", "ذراع بن خدة", "ذراع الميزان", "فريحة", "فريقات", "إبودرارن", "إيجــار", "إفــرحــونان", "إيفيغاء", "إفليـــسن", "إيلـيــلتـن", "إيلولة أومـــالو", "إمســوحال", "إيرجـــن", "الأربعــاء ناث إيراثن", "مكيرة", "معـــاتقة", "ماكودة", "مشطراس", "مقــلع", "ميزرانـــة", "واسيف", "واضية", "واقنون", "سيدي نعمان", "صوامـــع", "سوق الإثنين", "تادمايت", "تيقـزيرت", "تيمـيزار", "تيرمتين", "تيزي نثلاثة", "تيزي غنيف", "تيزي وزو", "تيزي راشد", "إعــكورن", "يطــافن", "زكري"] },
    { code: "16", name: "16 - الجزائر العاصمة", communes: ["الجزائر الوسطى", "باب الوادي", "سيدي امحمد", "الأبيار", "حيدرة", "بن عكنون", "الشراقة", "دالي إبراهيم", "الدرارية", "بئر مراد رايس", "بئر خادم", "القبة", "الحراش", "باب الزوار", "الدار البيضاء", "الرويبة", "زرالدة", "عين البنيان", "الرغاية", "البرج الكيفان", "الكاليتوس", "براقي", "باش جراح", "المقرية", "المرادية", "بوزريعة", "بني المسوس", "السحاولة", "الخرايسية", "العاشور"] },
    { code: "17", name: "17 - الجلفة", communes: ["عين الشهداء", "عين الإبل", "عين فقه", "عين معبد", "عين وسارة", "عمورة", "بنهار", "بن يعقوب", "بيرين", "بويرة الأحداب", "الشارف", "دار الشيوخ", "دلدول", "الجلفة", "دويس", "القديد", "الادريسية", "الخميس", "فيض البطمة", "قرنيني", "قطارة", "حد الصحاري", "حاسي بحبح", "حاسي العش", "حاسي فدول", "مليليحة", "مسعد", "مجبارة", "أم العظام", "سد الرحال", "سلمانة", "سيدي بايزيد", "سيدي لعجال", "تعظميت", "زعفران", "زكار"] },
    { code: "18", name: "18 - جيجل", communes: ["برج الطهر", "بودريعة بني ياجيس", "بوراوي بلهادف", "بوسيف أولاد عسكر", "الشحنة", "الشقفة", "الجمعة بني حبيبي", "جيملة", "العنصر", "العوانة", "القنار نشفي", "الميلية", "الامير عبد القادر", "أراقن سويسي", "غبالة", "جيجل", "قاوس", "خيري واد عجول", "وجانة", "أولاد رابح", "أولاد يحيى خدروش", "سلمى بن زيادة", "السطارة", "سيدي عبد العزيز", "سيدي معروف", "الطاهير", "تاكسنة", "زيامة منصورية"] },
    { code: "19", name: "19 - سطيف", communes: ["عين عباسة", "عين أرنات", "عين أزال", "عين الكبيرة", "عين الحجر", "عين ولمان", "عين لقراج", "عين الروى", "عين السبت", "أيت نوال مزادة", "ايت تيزي", "عموشة", "بابور", "بازر سكرة", "بيضاء برج", "بلاعة", "بني شبانة", "بني فودة", "بني ورتيلان", "بني وسين", "بني عزيز", "بني موحلي", "بئر حدادة", "بئر العرش", "بوعنداس", "بوقاعة", "بوسلام", "بوطالب", "الدهامشة", "جميلة", "ذراع قبيلة", "العلمة", "أوريسيا", "الولجة", "قلال", "قلتة زرقاء", "قنزات", "قجال", "حمام السخنة", "الحامة", "حمام قرقور", "حربيل", "قصر الابطال", "معاوية", "ماوكلان", "مزلوق", "واد البارد", "أولاد عدوان", "أولاد صابر", "أولاد سي أحمد", "أولاد تبان", "الرصفة", "صالح باي", "سرج الغول", "سطيف", "تاشودة", "تالة إيفاسن", "الطاية", "التلة", "تيزي نبشار"] },
    { code: "20", name: "20 - سعيدة", communes: ["عين الحجر", "عين السخونة", "عين السلطان", "دوي ثابت", "الحساسنة", "هونت", "المعمورة", "مولاي العربي", "أولاد إبراهيم", "أولاد خالد", "سعيدة", "سيدي احمد", "سيدي عمر", "سيدي بوبكر", "تيرسين", "يوب"] },
    { code: "21", name: "21 - سكيكدة", communes: ["عين بوزيان", "عين شرشار", "عين قشرة", "عين زويت", "عزابة", "بكوش لخضر", "بن عزوز", "بني بشير", "بني ولبان", "بني زيد", "بين الويدان", "بوشطاطة", "الشرايع", "القل", "جندل سعدي محمد", "الحروش", "الغدير", "الحدائق", "المرسى", "مجاز الدشيش", "السبت", "فلفلة", "حمادي كرومة", "قنواع", "الكركرة", "خناق مايو", "وادي الزهور", "الولجة بولبلوط", "أولاد عطية", "أولاد حبابة", "أم الطوب", "رمضان جمال", "صالح بو الشعور", "سيدي مزغيش", "سكيكدة", "تمالوس", "زردازة", "الزيتونة"] },
    { code: "22", name: "22 - سيدي بلعباس", communes: ["عين البرد", "عين قادة", "عين الثريد", "عين تندمين", "عين أدن", "العمارنة", "بضرابين المقراني", "بلعربي", "بن باديس", "بن عشيبة شلية", "بئر الحمام", "بوجبهة البرج", "بوخنفيس", "شيطوان البلايلة", "الضاية", "الحصيبة", "حاسي دحو", "حاسي زهانة", "لمطار", "مسيد", "مكدرة", "مرحوم", "مرين", "مزاورو", "مصطفى بن ابراهيم", "مولاي سليسن", "وادي السبع", "وادي سفيون", "وادي تاوريرة", "راس الماء", "رجم دموش", "السهالة الثورة", "سفيزف", "سيدي علي بن يوب", "سيدي علي بوسيدي", "سيدي بلعباس", "سيدي ابراهيم", "سيدي شعيب", "سيدي دحو الزاير", "سيدي حمادوش", "سيدي خالد", "سيدي لحسن", "سيدي يعقوب", "طابية", "تاودموت", "تفسور", "تغاليمت", "تلاغ", "تنيرة", "تسالة", "تلموني", "زروالة"] },
    { code: "23", name: "23 - عنابة", communes: ["عين الباردة", "عنابة", "برحال", "شطايبي", "الشرفة", "البوني", "العلمة", "الحجار", "واد العنب", "سرايدي", "سيدي عمار", "التريعات"] },
    { code: "24", name: "24 - قالمة", communes: ["عين بن بيضاء", "عين العربي", "عين مخلوف", "عين رقادة", "عين صندل", "بلخير", "بن جراح", "بني مزلين", "برج صباط", "بوحشانة", "بوحمدان", "بوعاتي محمود", "بوشقوف", "بومهرة أحمد", "الدهوارة", "جبالة الخميسي", "الفجوج", "قلعة بوصبع", "قالمة", "حمام دباغ", "حمام النبايل", "هيليوبوليس", "هواري بومدين", "لخزارة", "مجاز عمار", "مجازالصفاء", "نشماية", "وادي الشحم", "وادي فراغة", "وادي الزناتي", "رأس العقبة", "الركنية", "سلاوة عنونة", "تاملوكة"] },
    { code: "25", name: "25 - قسنطينة", communes: ["عين عبيد", "عين السمارة", "أبن باديس الهرية", "بني حميدان", "قسنطينة", "ديدوش مراد", "الخروب", "حامة بوزيان", "ابن زياد", "بوجريو مسعود", "أولاد رحمون", "زيغود يوسف"] },
    { code: "26", name: "26 - المدية", communes: ["عين بوسيف", "عين اقصير", "العيساوية", "عزيز", "بعطة", "بن شكاو", "بني سليمان", "البرواقية", "بئر بن عابد", "بوغار", "بوعيش", "بوعيشون", "بوشراحيل", "بوغزول", "بوسكن", "الشهبونية", "شلالة العذاورة", "شنيقل", "دراق", "جواب", "ذراع السمار", "العزيزية", "القلب الكبير", "الحمدانية", "الحوضان", "العمارية", "العوينات", "حناشة", "الكاف الاخضر", "خمس جوامع", "قصر البخاري", "مفاتحة", "مغراوة", "المدية", "مجبر", "مزغنة", "ميهوب", "عوامري", "وادي حربيل", "أولاد عنتر", "أولاد بوعشرة", "أولاد إبراهيم", "أولاد دايد", "أولاد امعرف", "أولاد هلال", "أم الجليل", "وزرة", "الربعية", "السانق", "سدراية", "سغوان", "سي المحجوب", "سيدي دامد", "سيدي نعمان", "سيدي الربيع", "سيدي زهار", "سيدي زيان", "السواقي", "تابلاط", "تفراوت", "تمسقيدة", "تيزي مهدي", "ثلاث دوائر", "الزبيرية"] },
    { code: "27", name: "27 - مستغانم", communes: ["عشعاشة", "عين بودينار", "عين نويسي", "عين سيدي الشريف", "عين تادلس", "بن عبد المالك رمضان", "بوقيراط", "فرناقة", "حجاج", "حاسي ماماش", "الحسيان (بني ياحي)", "خضرة", "خير الدين", "منصورة", "مزغران", "ماسرة", "مستغانم", "نكمارية", "وادي الخير", "أولاد بوغالم", "أولاد مع الله", "صفصاف", "صيادة", "سيدي علي", "سيدي بلعطار", "سيدي لخضر", "سيرات", "السوافلية", "سور", "ستيدية", "تزقايت", "الطواهرية"] },
    { code: "28", name: "28 - المسيلة", communes: ["عين الحجل", "عين الملح", "عين فارس", "عين الخضراء", "عين الريش", "بلعايبة", "بن سرور", "بني يلمان", "بن زوه", "برهوم", "بئر فضة", "بوسعادة", "بوطي السايح", "شلال", "دهاهنة", "جبل مساعد", "الهامل", "الحوامد", "حمام الضلعة", "خطوطي سد الجير", "خبانة", "مسيف", "المسيلة", "المطارفة", "المعاضيد", "معاريف", "مقرة", "امجدل", "مناعة", "محمد بوضياف", "ونوغة", "أولاد عدي لقبالة", "أولاد دراج", "أولاد ماضي", "أولاد منصور", "أولاد سيدي ابراهيم", "أولاد سليمان", "ولتام", "سيدي عيسى", "سيدي عامر", "سيدي هجرس", "سيدي امحمد", "سليم", "السوامع", "تامسة", "تارمونت", "زرزور"] },
    { code: "29", name: "29 - معسكر", communes: ["عين فارس", "عين فكان", "عين فراح", "عين أفرص", "العلايمية", "عوف", "بنيان", "بوهني", "بوحنيفية", "الشرفاء", "البرج", "القعدة", "الغمري", "القطنة", "الحشم", "القرط", "المأمونية", "المنور", "فراقيق", "فروحة", "غروس", "غريس", "قرجوم", "حسين", "خلوية", "ماقضة", "ماوسة", "معسكر", "المطمور", "مقطع الدوز", "المحمدية", "نسمط", "عقاز", "وادي الأبطال", "وادي التاغية", "رأس عين عميروش", "سجرارة", "السهايلية", "سيدي عبد الجبار", "سيدي عبد المومن", "سيدي بوسعيد", "سيدي قادة", "سيق", "تيغنيف", "تيزي", "زهانة", "زلامطة"] },
    { code: "30", name: "30 - ورقلة", communes: ["عين البيضاء", "البرمة", "حاسي بن عبد الله", "حاسي مسعود", "انقوسة", "ورقلة", "الرويسات", "سيدي خويلد"] },
    { code: "31", name: "31 - وهران", communes: ["عين البية", "عين الكرمة", "عين الترك", "أرزيو", "بن فريحة", "بطيوة", "بئر الجير", "بوفاتيس", "بوسفر", "بوتليليس", "العنصر", "البراية", "الكرمة", "السانية", "قديل", "حاسي بن عقبة", "حاسي بونيف", "حاسي مفسوخ", "مرسى الحجاج", "المرسى الكبير", "مسرغين", "وهران", "وادي تليلات", "سيدي بن يبقى", "سيدي الشحمي", "طفراوي"] },
    { code: "32", name: "32 - البيض", communes: ["عين العراك", "اربوات", "بوعلام", "بوقطب", "بوسمغون", "بريزينة", "الشقيق", "شلالة", "البيض", "البنود", "الخيثر", "المحرة", "الغاسول", "الكاف الأحمر", "كراكدة", "الأبيض سيدي الشيخ", "رقاصة", "سيدي عامر", "سيدي سليمان", "سيدي طيفور", "ستيتن", "توسمولين"] },
    { code: "33", name: "33 - إليزي", communes: ["برج عمر إدريس", "دبداب", "إيليزي", "إن أمناس"] },
    { code: "34", name: "34 - برج بوعريريج", communes: ["عين تاغروت", "عين تسرة", "برج بوعريريج", "بليمور", "بن داود", "بئر قاصد علي", "برج الغدير", "برج زمورة", "القلة", "جعافرة", "الياشير", "العناصر", "العش", "المهير", "الماين", "الحمادية", "غيلاسة", "حرازة", "حسناوة", "خليل", "القصور", "المنصورة", "مجانة", "أولاد أبراهم", "أولاد دحمان", "أولاد سيدي ابراهيم", "الرابطة", "رأس الوادي", "سيدي أمبارك", "تقلعيت", "تسامرت", "تفرق", "ثنية النصر", "تيكستار"] },
    { code: "35", name: "35 - بومرداس", communes: ["أعفير", "عمال", "بغلية", "بن شود", "بني عمران", "برج منايل", "بودواو", "بودواو البحري", "بومرداس", "بوزقزة قدارة", "شعبة العامر", "قورصو", "دلس", "جنات", "الخروبة", "حمادي", "يسر", "خميس الخشنة", "الاربعطاش", "لقاطة", "الناصرية", "أولاد عيسى", "أولاد هداج", "أولاد موسى", "سي مصطفى", "سيدي داود", "سوق الحد", "تاورقة", "الثنية", "تيجلابين", "تيمزريت", "زموري"] },
    { code: "36", name: "36 - الطارف", communes: ["عين العسل", "عين الكرمة", "عصفور", "بن مهيدي", "بريحان", "البسباس", "بوقوس", "بوحجار", "بوثلجة", "شبيطة مختار", "الشافية", "شحاني", "الذرعـان", "الشط", "العيون", "القالة", "الطارف", "حمام بني صالح", "بحيرة الطيور", "وادي الزيتون", "رمل السوق", "السوارخ", "زريزر", "الزيتونة"] },
    { code: "37", name: "37 - تندوف", communes: ["أم العسل", "تندوف"] },
    { code: "38", name: "38 - تسمسيلت", communes: ["عماري", "بني شعيب", "بني لحسن", "برج بونعامة", "برج الأمير عبد القادر", "بوقائد", "خميستي", "الأربعاء", "لرجام", "العيون", "الأزهرية", "المعاصم", "الملعب", "أولاد بسام", "سيدي عابد", "سيدي بوتوشنت", "سيدي العنتري", "سيدي سليمان", "تملاحت", "ثنية الاحد", "تيسمسيلت", "اليوسفية"] },
    { code: "39", name: "39 - الوادي", communes: ["البياضة", "بن قشة", "الدبيلة", "دوار الماء", "العقلة", "الوادي", "قمار", "الحمراية", "حساني عبد الكريم", "حاسي خليفة", "كوينين", "المقرن", "اميه وانسة", "النخلة", "وادي العلندة", "ورماس", "الرقيبة", "الرباح", "سيدي عون", "تغزوت", "الطالب العربي", "الطريفاوي"] },
    { code: "40", name: "40 - خنشلة", communes: ["عين الطويلة", "بابار", "بغاي", "بوحمامة", "ششار", "شلية", "جلال", "الحامة", "المحمل", "الولجة", "انسيغة", "قايس", "خنشلة", "خيران", "مصارة", "متوسة", "أولاد رشاش", "الرميلة", "طامزة", "تاوزيانت", "يابوس"] },
    { code: "41", name: "41 - سوق أهراس", communes: ["عين سلطان", "عين الزانة", "بئر بوحوش", "الدريعة", "الحدادة", "الحنانشة", "الخضارة", "خميسة", "مداوروش", "المشروحة", "المراهنة", "وادي الكبريت", "ويلان", "أولاد إدريس", "أولاد مومن", "أم العظايم", "الراقوبة", "سافل الويدان", "سدراتة", "سيدي فرج", "سوق أهراس", "تاورة", "ترقالت", "تيفاش", "الزعرورية", "الزوابي"] },
    { code: "42", name: "42 - تيبازة", communes: ["أغبال", "أحمر العين", "عين تاقورايت", "الحطاطبة", "بني ميلك", "بوهارون", "بواسماعيل", "بوريقة", "الشعيبة", "شرشال", "الداموس", "دواودة", "فوكة", "قوراية", "حجوط", "حجرة النص", "خميستي", "القليعة", "الأرهاط", "مناصر", "مراد", "مسلمون", "الناظور", "سيدي غيلاس", "سيدي راشد", "سيدي سميان", "سيدي عامر", "تيبازة"] },
    { code: "43", name: "43 - ميلة", communes: ["أحمد راشدي", "عين البيضاء أحريش", "عين الملوك", "عين التين", "اعميرة اراس", "بن يحي عبد الرحمن", "بوحاتم", "شلغوم العيد", "الشيقارة", "دراحي بوصلاح", "العياضي برباس", "مشيرة", "فرجيوة", "القرارم قوقة", "حمالة", "ميلة", "مينار زارزة", "وادي العثمانية", "وادي النجاء", "وادي سقان", "أولاد اخلوف", "الرواشد", "سيدي خليفة", "سيدي مروان", "تاجنانت", "تسدان حدادة", "تسالة لمطاعي", "التلاغمة", "ترعي باينان", "تيبرقنت", "يحي بني قشة", "زغاية"] },
    { code: "44", name: "44 - عين الدفلى", communes: ["عين البنيان", "عين بويحيى", "عين الدفلى", "عين الاشياخ", "عين السلطان", "عين التركي", "عريب", "بطحية", "بلعاص", "بن علال", "بئر ولد خليفة", "بربوش", "برج الأمير خالد", "بومدفع", "بوراشد", "جليدة", "جمعة أولاد الشيخ", "جندل", "العبادية", "العامرة", "العطاف", "الماين", "حمام ريغة", "الحسانية", "الحسينية", "خميس مليانة", "المخاطرية", "مليانة", "وادي الشرفاء", "واد الجمعة", "الروينة", "سيدي الأخضر", "تاشتة زقاغة", "طارق بن زياد", "تبركانين", "زدين"] },
    { code: "45", name: "45 - النعامة", communes: ["عين بن خليل", "عين الصفراء", "عسلة", "جنين بورزق", "البيوض", "القصدير", "مكمن بن عمار", "المشرية", "مغرار", "النعامة", "سفيسيفة", "تيوت"] },
    { code: "46", name: "46 - عين تموشنت", communes: ["أغلال", "عين الأربعاء", "عين الكيحل", "عين تموشنت", "عين الطلبة", "عقب الليل", "بني صاف", "بوزجار", "شعبة اللحم", "شنتوف", "العامرية", "المالح", "المساعيد", "الأمير عبد القادر", "حمام بوحجر", "الحساسنة", "حاسي الغلة", "وادي برقش", "وادي الصباح", "أولاد بوجمعة", "أولاد الكيحل", "ولهاصة الغرابة", "سيدي بن عدة", "سيدي بومدين", "سيدي ورياش", "سيدي صافي", "تامزورة", "تارقة"] },
    { code: "47", name: "47 - غرداية", communes: ["بريان", "بونورة", "ضاية بن ضحوة", "العطف", "القرارة", "غرداية", "المنصورة", "متليلي", "سبسب", "زلفانة"] },
    { code: "48", name: "48 - غليزان", communes: ["عين الرحمة", "عين طارق", "عمي موسى", "بلعسل بوزقزة", "بن داود", "بني درقن", "بني زنطيس", "دار بن عبد الله", "جديوية", "الحمادنة", "الحاسي", "الولجة", "القطار", "المطمر", "حد الشكالة", "حمري", "القلعة", "لحلاف", "مازونة", "مديونة", "منداس", "مرجة سيدي عابد", "واريزان", "وادي الجمعة", "وادي السلام", "وادي رهيو", "أولاد يعيش", "أولاد سيدي الميهوب", "الرمكة", "غليزان", "سيدي خطاب", "سيدي لزرق", "سيدي أمحمد بن علي", "سيدي امحمد بن عودة", "سيدي سعادة", "سوق الحد", "يلل", "زمورة"] },
    { code: "49", name: "49 - تيميمون", communes: ["أوقروت", "شروين", "دلدول", "قصر قدور", "المطارفة", "أولاد عيسى", "أولاد السعيد", "طالمين", "تيميمون", "تنركوك"] },
    { code: "50", name: "50 - برج باجي مختار", communes: ["برج باجي مختار", "تيمياوين"] },
    { code: "51", name: "51 - أولاد جلال", communes: ["بسباس", "الشعيبة", "الدوسن", "أولاد جلال", "رأس الميعاد", "سيدي خالد"] },
    { code: "52", name: "52 - بني عباس", communes: ["بني عباس", "بن يخلف", "الواتة", "إقلي", "كرزاز", "القصابي", "أولاد خضير", "تبلبالة", "تامترت", "تيمودي"] },
    { code: "53", name: "53 - إن صالح", communes: ["عين صالح", "فقارة الزوى", "إينغر"] },
    { code: "54", name: "54 - إن قزام", communes: ["عين قزام", "تين زواتين"] },
    { code: "55", name: "55 - تقرت", communes: ["بن ناصر", "بلدة اعمر", "العالية", "الحجيرة", "المنقر", "المقارين", "النزلة", "سيدي سليمان", "الطيبات", "تبسبست", "تماسين", "تقرت", "الزاوية العابدية"] },
    { code: "56", name: "56 - جانت", communes: ["برج الحواس", "جانت"] },
    { code: "57", name: "57 - المغير", communes: ["جامعة", "المغير", "المرارة", "أم الطيور", "سيدي عمران", "سيدي خليل", "سطيل", "تندلة"] },
    { code: "58", name: "58 - المنيعة", communes: ["المنيعة", "حاسي الفحل", "حاسي القارة"] }
  ];

  const galleryImages = [
    "https://scontent.faae2-3.fna.fbcdn.net/v/t39.30808-6/891645324_2341177369970489_6005702391524640935_n.jpg?stp=dst-jpg_tt6&cstp=mx1254x1254&ctp=p526x296&_nc_cat=110&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHdhaOT53EvVVuN9NaumDPny-pDc-qqsNzL6kNz6qqw3P_mVw5CayByftgunnY2ckgD-i9wvTT-MReTbSfqTiyv&_nc_ohc=E8fC4sMyOfoQ7kNvwElkwPD&_nc_oc=AdobGh5OBUdUwbVuvv0dctISmPFkouHTdJ-rq3V-9B5K483gdr-5UKA9sIQWP_U7rSM&_nc_zt=23&_nc_ht=scontent.faae2-3.fna&_nc_gid=z5ug3hUCiW643YapprSaWA&_nc_ss=7b2a8&oh=00_AQRYCIm-Gtx5SbJvWycYJ1VdSQxtDEVkoyhdHUkCGsUkuw&oe=6AF573F7",
    "https://scontent.faae2-2.fna.fbcdn.net/v/t39.30808-6/893107494_2341154819972744_6609817046607056108_n.webp?stp=dst-jpg_tt6&cstp=mx713x713&ctp=p526x296&_nc_cat=108&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeEUiBgp__1VMfOytVLW3I42RlijLP_17dhGWKMs__Xt2HsepHgRurCBX99XkqAc6enDNV-T5BRehXfASxh7W0un&_nc_ohc=sMsTtlO2OGQQ7kNvwG7ndTi&_nc_oc=AdopCSR8mTp98fAQC0zUYOfXCUjayZEkYwLqxfqXs0a70wuuQLAVG5DMD1xbETktlsY&_nc_zt=23&_nc_ht=scontent.faae2-2.fna&_nc_gid=btZ0zcvrwe4psolAAlktIQ&_nc_ss=7b2a8&oh=00_AQRX1OrKwRVeVlz789DhryxEkN8zB0qQDzFFpcmMMhUGVA&oe=6AF55CA3",
    "https://scontent.faae2-3.fna.fbcdn.net/v/t39.30808-6/891511582_2341173329970893_4980705526116754681_n.jpg?stp=dst-jpg_tt6&cstp=mx1211x1299&ctp=p180x540&_nc_cat=101&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGS-CmRfRhdEQ1MjtxkDDsVHyV12QALE_sfJXXZAAsT-_2-buWGmNRbZepMtwQWHmjJ8bHkl4r3EdTEiIGkUPFj&_nc_ohc=H8rWNHxRZy4Q7kNvwEB1XB5&_nc_oc=AdruqhisUQCIqluc0te4nnskLMc_VCdOEl88fKrxoZ4S2S30g0xgjRoguLN50d4JIQg&_nc_zt=23&_nc_ht=scontent.faae2-3.fna&_nc_gid=wbVLmUNPmLHaxFvfdlWN4Q&_nc_ss=7b2a8&oh=00_AQQ3bg9wL1JfJB17c0sbgXutfF3e_J9YUzHO9WuDU0EDiw&oe=6AF587BB",
    "https://scontent.faae2-3.fna.fbcdn.net/v/t39.30808-6/893766167_2341182689969957_8414253250875486210_n.jpg?stp=dst-jpg_tt6&cstp=mx1199x1312&ctp=s565x565&_nc_cat=103&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGDRWNHamjkGGVkQVDK1LwhpvI8MQD3gFmm8jwxAPeAWVsjMkOIgho1CRs-uAEicyxHv0gTJpRfbvUQFY-i-Vt8&_nc_ohc=sb3jekYWP7sQ7kNvwHIxq4O&_nc_oc=AdppMqyzjbPbBh3oRKPM_v5iICI9LcxLTfpEkVNho7n0u1TDAbpRvqKFan24DLvSJjg&_nc_zt=23&_nc_ht=scontent.faae2-3.fna&_nc_gid=dyPyq3g1lRTlQPchcBXw4w&_nc_ss=7b2a8&oh=00_AQR1vU6OeLmZpLPpXoT4VsApoAevd82wQ2SiBkhSABPLkw&oe=6AF57889"
  ];

  const [selectedOffer, setSelectedOffer] = useState('pack2');
  const [currentPrice, setCurrentPrice] = useState(3300);
  const [currentBundleName, setCurrentBundleName] = useState('عرض القطعتين (باك المطبخ والحمام)');
  const [currentShippingCost, setCurrentShippingCost] = useState(600);
  const [mainImage, setMainImage] = useState(galleryImages[0]);

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

  useEffect(() => {
    handleWilayaChange('الجزائر العاصمة');
  }, []);

  useEffect(() => {
    calculateShipping(formData.wilaya, formData.shippingType);
  }, [formData.wilaya, formData.shippingType]);

  useEffect(() => {
    let interval;
    if (isUserInTrackingMode && currentActiveOrderId) {
      fetchOrderStatusJSONP(currentActiveOrderId);
      interval = setInterval(() => {
        fetchOrderStatusJSONP(currentActiveOrderId);
      }, 8000);
    }
    return () => clearInterval(interval);
  }, [isUserInTrackingMode, currentActiveOrderId]);
  // --- كود تحديث لوحة الأدمن تلقائياً ومباشرة من Supabase ---
  const fetchOrdersFromSupabase = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      // قم بتحديث المتغير الخاص بقائمة الطلبات في لوحة الأدمن
      setOrders(data); 
    }
  };

  useEffect(() => {
    // 1. جلب الطلبات عند فتح لوحة الأدمن
    fetchOrdersFromSupabase();

    // 2. الاستماع الفوري لأي تغييرات تحدث في جدول orders على Supabase
    const subscription = supabase
      .channel('admin-orders-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          // أول ما يتم تعديل حالة طلب أو إضافة طلب في سوبابيز/جوجل شيت يتم تحديث اللوحة فوراً
          fetchOrdersFromSupabase();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);
  // -------------------------------------------------------------

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
    const fullOrderDetails = `${currentBundleName} (الكمية: ${quantity})`;

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
    setIsUserInTrackingMode(true);
    setCurrentActiveOrderId(searchInput.trim());
    setTrackingDetails({
      orderId: searchInput.trim(),
      orderName: 'جاري جلب تفاصيل المنتج...',
      total: '---',
      status: 'قيد التأكيد',
      trackingCode: '28-H8G9NDFX0V-ZR',
      customerName: 'الزبون'
    });
    fetchOrderStatusJSONP(searchInput.trim());
  };

  const fetchOrderStatusJSONP = (orderId) => {
    if (!GOOGLE_SCRIPT_URL) return;
    const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
    window[callbackName] = (data) => {
      delete window[callbackName];
      if (data) {
        setTrackingDetails(prev => ({
          ...prev,
          status: data.status || prev.status,
          trackingCode: data.trackingCode || prev.trackingCode,
          orderName: (data.orderName && data.orderName !== "حامل المناشف الخشبي الفاخر") ? data.orderName : prev.orderName,
          total: (data.totalPrice && data.totalPrice !== "---") ? data.totalPrice : prev.total
        }));
      }
    };
    const scriptTag = document.createElement('script');
    scriptTag.src = `${GOOGLE_SCRIPT_URL}?orderId=${encodeURIComponent(orderId)}&callback=${callbackName}`;
    document.body.appendChild(scriptTag);
  };

  const copyPromptOrderId = () => {
    navigator.clipboard.writeText(currentActiveOrderId || 'ORD-XXXXXX').then(() => {
      alert('تم نسخ رقم الأوردر بنجاح: ' + (currentActiveOrderId || 'ORD-XXXXXX'));
    });
  };

  const grandTotal = currentPrice + currentShippingCost;
  const stages = ["قيد التأكيد", "التأكيد", "في شركة التوصيل", "التسليم"];
  const currentStatusIndex = Math.max(0, stages.indexOf(trackingDetails.status));

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-gray-800 font-sans selection:bg-[#faedcd] selection:text-[#432818]" dir="rtl">
      {/* Top Announcement Bar */}
      <div className="bg-[#432818] text-[#f7f1e5] text-xs sm:text-sm py-2 px-4 text-center font-bold tracking-wide flex items-center justify-center gap-2">
        <span>توصيل سريع لكافة الـ 58 ولاية | الدفع بعد المعاينة والإستلام</span>
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
          <div className="flex items-center gap-2">
            <button onClick={() => scrollToSection('track-search-section')} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer">
              <svg className="w-3.5 h-3.5 fill-[#a3714c]" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
              <span className="hidden sm:inline">تتبع طلبك</span>
            </button>
            <button onClick={handleHeaderOrderClick} className="bg-[#754b2d] hover:bg-[#432818] text-white px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
              <span>أطلب الآن</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="offers-section" className="relative pt-6 pb-12 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* Media Image Showcase */}
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white w-full h-[380px] sm:h-[450px]">
                <span className="absolute top-4 right-4 z-10 bg-[#e63946] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                  🔥 الأكثر طلباً
                </span>
                <img src={mainImage} className="w-full h-full object-cover" alt="Main product" />
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMainImage(imgUrl)}
                    className={`rounded-xl overflow-hidden bg-white shadow-sm focus:outline-none border-4 transition ${mainImage === imgUrl ? 'border-[#754b2d]' : 'border-transparent hover:border-[#d4a373]'}`}
                  >
                    <img src={imgUrl} className="w-full h-16 object-cover" alt={`Thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details & Interactive Cards */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-500 text-sm font-semibold">
                <div className="flex gap-1 text-amber-400">
                  ★★★★★
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#432818] leading-tight">
                حامل المناشف الخشبي الفاخر <span className="text-[#bc8a5f] block sm:inline">بنظام القفل بالجاذبية</span>
              </h1>

              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                أضف لمسة جمالية وعصرية لحمامك أو مطبخك! مشبك تثبيت فريد مصنوع من الخشب الطبيعي المحمي ضد الرطوبة بدون ثقب الجدران.
              </p>

              {/* Offer Cards */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-bold text-gray-700">اختر العرض المناسب لك:</label>
                
                <div
                  onClick={() => selectOffer('pack1', 1900)}
                  className={`p-3 rounded-xl border-2 flex items-center justify-between transition-all cursor-pointer ${selectedOffer === 'pack1' ? 'border-[#754b2d] bg-[#f7f1e5] shadow-md' : 'border-gray-200 bg-white'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border-2 border-[#754b2d] flex items-center justify-center">
                      <div className={`w-3 h-3 rounded-full ${selectedOffer === 'pack1' ? 'bg-[#754b2d]' : 'bg-transparent'}`}></div>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-[#432818]">العرض العادي (قطعة واحدة)</h4>
                      <p className="text-[11px] text-gray-500">مناسب لحمام واحد أو مطبخ</p>
                    </div>
                  </div>
                  <span className="font-black text-[#432818] text-sm">1,900 دج</span>
                </div>

                <div
                  onClick={() => selectOffer('pack2', 3300)}
                  className={`p-3 rounded-xl border-2 flex items-center justify-between transition-all cursor-pointer relative overflow-hidden ${selectedOffer === 'pack2' ? 'border-[#754b2d] bg-[#f7f1e5] shadow-md' : 'border-gray-200 bg-white'}`}
                >
                  <span className="absolute top-0 left-0 bg-[#e63946] text-white text-[9px] px-2 py-0.5 rounded-br-lg font-bold">توفير رائع</span>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border-2 border-[#754b2d] flex items-center justify-center">
                      <div className={`w-3 h-3 rounded-full ${selectedOffer === 'pack2' ? 'bg-[#754b2d]' : 'bg-transparent'}`}></div>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-[#432818]">عرض القطعتين (باك المطبخ والحمام) 🔥</h4>
                      <p className="text-[11px] text-gray-500">قطعتين لتغطية المنزل بالكامل</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="font-black text-[#432818] text-sm">3,300 دج</span>
                    <span className="text-[10px] text-gray-400 line-through block">3,800 دج</span>
                  </div>
                </div>

                <div
                  onClick={() => selectOffer('pack4', 6200)}
                  className={`p-3 rounded-xl border-2 flex items-center justify-between transition-all cursor-pointer ${selectedOffer === 'pack4' ? 'border-[#754b2d] bg-[#f7f1e5] shadow-md' : 'border-gray-200 bg-white'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border-2 border-[#754b2d] flex items-center justify-center">
                      <div className={`w-3 h-3 rounded-full ${selectedOffer === 'pack4' ? 'bg-[#754b2d]' : 'bg-transparent'}`}></div>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-[#432818]">العرض العائلي الفاخر (4 قطع)</h4>
                      <p className="text-[11px] text-gray-500">أقصى توفير للعائلات الكبيرة</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="font-black text-[#432818] text-sm">6,200 دج</span>
                    <span className="text-[10px] text-gray-400 line-through block">7,600 دج</span>
                  </div>
                </div>
              </div>

              {/* Price Summary Box */}
              <div className="pt-2 p-3.5 rounded-2xl bg-gradient-to-r from-white to-[#faedcd] border border-[#faedcd] space-y-2.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold text-gray-600">السعر المختار الآن:</span>
                  <span className="text-2xl font-black text-[#432818]">{currentPrice.toLocaleString()} دج</span>
                </div>
                <button
                  onClick={() => scrollToSection('order-form')}
                  className="w-full py-3 px-6 rounded-xl bg-[#754b2d] hover:bg-[#432818] text-white font-extrabold text-base text-center shadow-lg transition-all flex items-center justify-center gap-2 animate-pulse cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
                  <span>اضغط هنا لتأكيد الطلب والدفع عند الاستلام</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Order Form & Tracking Section */}
      <section id="order-form" className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          
          {/* Tracking Search Bar */}
          <div id="track-search-section" className={`mb-10 bg-[#fdfbf7] rounded-2xl p-6 border border-[#faedcd] shadow-sm text-center space-y-4 ${isUserInTrackingMode ? 'hidden' : ''}`}>
            <div className="flex items-center justify-center gap-2 text-[#432818] font-bold">
              <svg className="w-4 h-4 fill-[#a3714c]" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
              <span>هل لديك طلب سابق وتريد تتبعه؟</span>
            </div>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="text"
                placeholder="مثال: ORD-123456"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 focus:border-[#bc8a5f] focus:outline-none text-sm text-center font-bold"
              />
              <button onClick={searchExistingOrder} className="bg-[#754b2d] hover:bg-[#432818] text-white px-5 py-3 rounded-xl font-bold text-sm shrink-0 transition cursor-pointer">
                بحث
              </button>
            </div>
          </div>

          {/* Form Container */}
          <div id="form-container" className={`bg-[#fdfbf7] rounded-3xl p-6 sm:p-8 border-2 border-[#faedcd] shadow-xl ${isUserInTrackingMode ? 'hidden' : ''}`}>
            
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-black shadow-sm">
                ✓
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#faedcd] text-[#432818] font-extrabold text-xs mb-2">الدفع عند الاستلام 100%</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#432818]">استمارة طلب المنتج</h2>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">يرجى ملء معلوماتك بدقة، وسيتصل بك فريقنا لتأكيد الطلب</p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">العرض المختار:</label>
                <select
                  value={selectedOffer}
                  onChange={e => selectOffer(e.target.value, e.target.value === 'pack1' ? 1900 : e.target.value === 'pack2' ? 3300 : 6200)}
                  className="w-full p-3.5 rounded-xl border-2 border-[#faedcd] focus:border-[#bc8a5f] focus:outline-none bg-white font-bold text-sm text-[#432818]"
                >
                  <option value="pack1">العرض العادي: قطعة واحدة - 1,900 دج</option>
                  <option value="pack2">عرض القطعتين (باك المطبخ والحمام): قطعتين - 3,300 دج (الأكثر طلباً)</option>
                  <option value="pack4">العرض العائلي الفاخر: 4 قطع - 6,200 دج</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">الاسم الكامل <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    required
                    type="text"
                    placeholder="مثال: محمد الأمين"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full p-3.5 pr-10 rounded-xl border border-gray-300 focus:border-[#bc8a5f] focus:outline-none bg-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">رقم الهاتف <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    required
                    type="tel"
                    pattern="[0-9]{10}"
                    placeholder="06XX XX XX XX"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3.5 pr-10 rounded-xl border border-gray-300 focus:border-[#bc8a5f] focus:outline-none bg-white text-sm text-right"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">الولاية <span className="text-red-500">*</span></label>
                  <select
                    required
                    value={formData.wilaya}
                    onChange={e => handleWilayaChange(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-gray-300 focus:border-[#bc8a5f] focus:outline-none bg-white text-sm"
                  >
                    {wilayasData.map(w => (
                      <option key={w.code} value={w.name.replace(/^\d+\s*-\s*/, '').trim()}>{w.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">البلدية <span className="text-red-500">*</span></label>
                  <select
                    required
                    value={formData.commune}
                    onChange={e => setFormData({ ...formData, commune: e.target.value })}
                    className="w-full p-3.5 rounded-xl border border-gray-300 focus:border-[#bc8a5f] focus:outline-none bg-white text-sm"
                  >
                    {communesList.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">طريقة التوصيل <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center gap-2 p-3 rounded-xl border-2 bg-white cursor-pointer transition ${formData.shippingType === 'home' ? 'border-[#754b2d]' : 'border-gray-200'}`}>
                    <input type="radio" name="shipping-type" value="home" checked={formData.shippingType === 'home'} onChange={() => setFormData({ ...formData, shippingType: 'home' })} />
                    <span className="text-xs font-bold text-[#432818]">توصيل للمنزل 🏠</span>
                  </label>
                  <label className={`flex items-center gap-2 p-3 rounded-xl border-2 bg-white cursor-pointer transition ${formData.shippingType === 'stop' ? 'border-[#754b2d]' : 'border-gray-200'}`}>
                    <input type="radio" name="shipping-type" value="stop" checked={formData.shippingType === 'stop'} onChange={() => setFormData({ ...formData, shippingType: 'stop' })} />
                    <span className="text-xs font-bold text-[#432818]">مكتب الشحن Stop Desk 🏢</span>
                  </label>
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="bg-white p-4 rounded-xl border border-[#faedcd] space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>سعر المنتج/العرض:</span>
                  <span className="font-bold text-gray-800">{currentPrice.toLocaleString()} دج</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>مصاريف التوصيل:</span>
                  <span className="font-bold text-[#754b2d]">{currentShippingCost.toLocaleString()} دج</span>
                </div>
                <div className="pt-2 border-t border-gray-100 flex justify-between text-base font-extrabold text-[#432818]">
                  <span>المجموع الكلي للدفع:</span>
                  <span className="text-xl text-[#754b2d]">{grandTotal.toLocaleString()} دج</span>
                </div>
              </div>

              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full py-4 px-6 rounded-xl bg-[#754b2d] hover:bg-[#432818] text-white font-black text-xl shadow-xl transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'جاري تأكيد طلبك...' : 'تأكيد الطلب الآن (الدفع عند الاستلام)'}
              </button>
            </form>
          </div>

          {/* Tracking Section */}
          <div id="tracking-container" className={`bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#faedcd] shadow-xl space-y-6 ${!isUserInTrackingMode ? 'hidden' : ''}`}>
            <div className="text-center space-y-2 border-b pb-6">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
                ✓
              </div>
              <h2 className="text-2xl font-black text-gray-900">تفاصيل وتتبع طلبك</h2>
              <p className="text-xs text-gray-500">شكراً لثقتك بـ Bright DZ. يمكنك متابعة حالة طلبك أدناه</p>
            </div>

            <div className="bg-[#fdfbf7] p-4 rounded-2xl space-y-2 text-xs sm:text-sm border border-[#f7f1e5]">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">رقم الطلب:</span>
                <span className="font-bold text-[#754b2d]">{trackingDetails.orderId || '--'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">المنتج / العرض:</span>
                <span className="font-bold text-[#754b2d]">{trackingDetails.orderName || '--'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">المبلغ الإجمالي:</span>
                <span className="font-bold text-[#754b2d]">{trackingDetails.total || '--'}</span>
              </div>
            </div>

            {/* مراحل سير الطلب */}
            <div className="space-y-6 pt-4 px-2">
              <h3 className="font-bold text-gray-800 text-sm mb-4">مراحل سير الطلب:</h3>
              
              {stages.map((stg, idx) => {
                const isActive = idx <= currentStatusIndex;
                return (
                  <div key={idx} className="flex items-start gap-4 relative">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 z-10 ${isActive ? 'bg-[#754b2d] text-white shadow-md' : 'bg-gray-200 text-gray-400'}`}>
                      {idx === 0 && (
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 11h-4V7h2v4h3z"/></svg>
                      )}
                      {idx === 1 && "✓"}
                      {idx === 2 && (
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-1.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
                      )}
                      {idx === 3 && (
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6z"/></svg>
                      )}
                    </div>
                    <div className="space-y-1">
                      <h4 className={`font-bold text-sm ${isActive ? 'text-[#432818]' : 'text-gray-400'}`}>{stg}</h4>
                      <p className={`text-xs ${isActive ? 'text-gray-600' : 'text-gray-400'}`}>
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
              <a
                target="_blank"
                rel="noreferrer"
                href={`https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  trackingDetails.status === 'في شركة التوصيل'
                    ? `مرحباً ${trackingDetails.customerName || 'الزبون الكريم'}،\nطلبيتك من Bright DZ خرجت مع عامل التوصيل وراهي في الطريق ليك.\nالمنتج: ${trackingDetails.orderName}\nرمز الشحن: ${trackingDetails.trackingCode}\nحضّر المبلغ ${trackingDetails.total} وخلّي تيليفونك مفتوح.`
                    : 'مرحباً Bright DZ، أود الاستفسار ومتابعة حالة طلبي.'
                )}`}
                className="w-full py-3 bg-[#25D366] hover:bg-emerald-600 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-md"
              >
                <span>تواصل معنا عبر واتساب لمتابعة الطلب</span>
              </a>
            </div>

            <div className="pt-2">
              <button onClick={() => setShowOrderPromptModal(true)} className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition text-sm cursor-pointer">
                إجراء طلب جديد أو بحث آخر
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#432818] text-[#faedcd] py-8 border-t border-[#754b2d]">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <img src="https://img.sanishtech.com/u/bb314dd8f27c1767138139bbdc694d73.png" alt="Bright DZ Logo" className="h-8 w-auto object-contain" />
            <span className="font-black text-lg text-white">Bright DZ</span>
          </div>
          <p className="text-xs text-gray-400">جميع الحقوق محفوظة © 2026 - Bright DZ Store</p>
        </div>
      </footer>

      {/* Success Modal */}
      {showSuccessModal && lastOrderDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl font-black">
              ✓
            </div>
            <h3 className="text-2xl font-black text-gray-800">تم تسجيل طلبك بنجاح!</h3>
            
            <div className="bg-gray-50 p-4 rounded-2xl text-right space-y-2 border border-gray-100 text-sm">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-500 font-medium">رقم الطلب:</span>
                <span className="font-bold text-[#754b2d]">{lastOrderDetails.orderId}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-500 font-medium">المنتج / العرض:</span>
                <span className="font-bold text-[#754b2d]">{lastOrderDetails.bundleName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">حالة الطلب:</span>
                <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-xs font-bold">قيد التأكيد ⏳</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <a href={lastOrderDetails.whatsappLink} target="_blank" rel="noreferrer" className="w-full py-3.5 bg-[#25D366] hover:bg-emerald-600 text-white font-extrabold rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-md">
                <span>تأكيد الطلب الآن عبر واتساب 🟢</span>
              </a>
            </div>

            <button onClick={closeModalToTracking} className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition text-sm cursor-pointer">
              الانتقال لمتابعة مراحل التتبع
            </button>
          </div>
        </div>
      )}

      {/* New Order Modal */}
      {showNewOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl text-center space-y-4">
            <h3 className="text-lg font-black text-[#432818]">تأكيد طلب جديد</h3>
            <p className="text-sm text-gray-600">هل أنت متأكد من رغبتك في الانتقال لطلب منتج جديد وإضافته؟</p>
            <div className="flex flex-col gap-2.5">
              <button onClick={() => { setShowNewOrderModal(false); resetAndNewOrder(); }} className="w-full bg-[#754b2d] text-white py-2.5 rounded-xl font-bold text-sm">
                الانتقال إلى صفحة الطلب
              </button>
              <button onClick={() => setShowNewOrderModal(false)} className="w-full text-gray-500 py-1.5 text-xs font-semibold">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Prompt Modal */}
      {showOrderPromptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl text-center space-y-4">
            <h3 className="text-lg font-black text-[#432818]">معلومات طلبك الحالي</h3>
            <div className="bg-[#fdfbf7] p-3 rounded-xl border border-[#faedcd] flex items-center justify-between">
              <span className="font-black text-[#432818] text-base tracking-wider">{currentActiveOrderId || 'ORD-XXXXXX'}</span>
              <button onClick={copyPromptOrderId} className="bg-[#754b2d] text-white px-3 py-1.5 rounded-lg text-xs font-bold">
                نسخ الرقم
              </button>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button onClick={() => { setShowOrderPromptModal(false); resetAndNewOrder(); }} className="w-full bg-[#754b2d] text-white py-2.5 rounded-xl font-bold text-sm">
                إجراء طلب جديد 🛒
              </button>
              <button onClick={() => setShowOrderPromptModal(false)} className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-xl font-bold text-sm">
                تتبع طلبه (البقاء على صفحة التتبع) 📍
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}