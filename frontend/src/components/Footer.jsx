import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h4>BhubaneswarStay</h4>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.7, maxWidth: '350px' }}>
              Your one-stop platform to find PGs, Flats, and Mess services across Bhubaneswar.
              Connecting room seekers with verified room owners since 2026.
            </p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <Link to="/search?category=PG">Find PG</Link>
            <Link to="/search?category=Flat">Find Flat</Link>
            <Link to="/search?category=Owner's House">Find Owner's House</Link>
            <Link to="/register">List Your Property</Link>
          </div>
          <div>
            <h4>Popular Areas</h4>
            <Link to="/search?q=Patia">Patia</Link>
            <Link to="/search?q=Chandrasekharpur">Chandrasekharpur</Link>
            <Link to="/search?q=Saheed Nagar">Saheed Nagar</Link>
            <Link to="/search?q=Jaydev Vihar">Jaydev Vihar</Link>
            <Link to="/search?q=Nayapalli">Nayapalli</Link>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 BhubaneswarStay. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
