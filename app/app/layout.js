import './globals.css';

export const metadata = {
  title: 'pixvavo Store',
  description: 'متجر pixvavo الإلكتروني',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}