import "./globals.css";
import SessionWrapper from "./components/sessionWrapper";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "My Blog | Manage Your Posts",
  description: "View, edit, and manage your blog posts on My Blog.",
  openGraph: {
      title: "My Blog | Manage Your Posts",
      description: "View, edit, and manage your blog posts on My Blog.",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/myblog`,
      siteName: "My Blog",
      type: "website",
  },
  twitter: {
      card: "summary_large_image",
      title: "My Blog | Manage Your Posts",
      description: "View, edit, and manage your blog posts on My Blog.",
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>
          <Navbar />
        {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
