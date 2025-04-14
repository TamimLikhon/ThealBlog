import "./globals.css";
import SessionWrapper from "./components/sessionWrapper";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>
          <Navbar />
        {children}
        <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}
