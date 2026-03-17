import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-columns">
          {/* Column 1: Brand */}
          <div className="footer-col footer-brand">
            <h3 className="footer-brand-title">SCYTOL CLX21</h3>
            <p className="footer-text">
              We're on a mission to redefine the way young individuals interact with technology. 
              Our accessories are designed to enhance performance and reflect your unique personality.
            </p>
            <p className="footer-text footer-email">
              Email: <a href="mailto:support@scytol.com">support@scytol.com</a>
            </p>
          </div>

          {/* Column 2: Company */}
          <div className="footer-col">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#buy">Where to Buy</a></li>
              <li><a href="#join">Join Us</a></li>
              <li><a href="#affiliates">Affiliates</a></li>
              <li><a href="#distributor">Become a Distributor</a></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="footer-col">
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-links">
              <li><a href="#manual">User Manual</a></li>
              <li><a href="#tracking">Order Tracking</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#return">Return Policy</a></li>
              <li><a href="#shipping">Shipping Policy</a></li>
              <li><a href="#terms">Terms Of Service</a></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="footer-col footer-newsletter">
            <h4 className="footer-heading newsletter-title">Sign up for new stories and personal offers</h4>
            <p className="footer-text">
              Want to get that exclusive VIP treatment?
            </p>
            <form className="footer-newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="E-mail" className="footer-input" />
              <button type="submit" className="footer-submit-btn">
                →
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-row">
            {/* Social Icons */}
            <div className="footer-social">
              <a href="#facebook" className="social-icon" aria-label="Facebook"><Facebook size={18} /></a>
              <a href="#twitter" className="social-icon" aria-label="X"><Twitter size={18} /></a>
              <a href="#instagram" className="social-icon" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="#youtube" className="social-icon" aria-label="YouTube"><Youtube size={18} /></a>
              <a href="#tiktok" className="social-icon" aria-label="TikTok">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
              </a>
              <a href="#linkedin" className="social-icon" aria-label="LinkedIn"><Linkedin size={18} /></a>
            </div>

            {/* Copyright */}
            <p className="footer-copy">
              © 2026, SCYTOL CLX21 Official. Powered by Antigravity.
            </p>

            {/* Payment Icons */}
            <div className="footer-payments">
              <span className="payment-icon">VISA</span>
              <span className="payment-icon">MASTERCARD</span>
              <span className="payment-icon">PAYPAL</span>
              <span className="payment-icon">AMEX</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
