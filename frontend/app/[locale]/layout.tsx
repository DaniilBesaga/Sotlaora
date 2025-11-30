import Header from "./components/layout/Header";
import "./globals.css";
import { Inter, Poppins } from "next/font/google";
import {NextIntlClientProvider} from 'next-intl';
import Footer from "./components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-sans",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-heading",
});

export const metadata = {
  title: "Your site",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

export default async function RootLayout({children, params}: Props) {

  const {locale} = await params

  const messages = (await import(`../../messages/${locale}.json`)).default

  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Header/>
            <main>
              {children}
            </main>
          <Footer/>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}