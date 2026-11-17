import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import BackToTop from "../common/BackToTop.jsx";
import useScrollReveal from "../../hooks/useScrollReveal.js";

export default function Layout() {
  const { pathname } = useLocation();
  useScrollReveal();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}