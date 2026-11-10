import './globals.css';

export const metadata = {
  title: 'pixvavo Store',
  description: 'متجر pixvavo الإلكتروني',
  icons: {
    icon: 'https://img.sanishtech.com/u/bb314dd8f27c1767138139bbdc694d73.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}