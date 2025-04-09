import "./globals.css";
import SessionWrapper from "./components/sessionWrapper";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";
import TrackVisitor from "./components/visitor/trackvisitor";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>
        <TrackVisitor />
          <Navbar />
        {children}
        <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}
