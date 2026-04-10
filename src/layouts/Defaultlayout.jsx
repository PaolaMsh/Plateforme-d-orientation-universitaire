// layouts/Defaultlayout.jsx
import React from 'react';
import HeaderParent from '../components/headerParent';  
import Footer from '../components/footer';  
import ScrollToTop from '../components/scrollToTop';
import '../styles/header.css';

const DefaultLayout = ({ children }) => {
    return (
        <>
            <ScrollToTop />
            <HeaderParent />
            <main>{children}</main>
            <Footer />
        </>
    );
};

export default DefaultLayout;