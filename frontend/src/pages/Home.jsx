import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search as SearchIcon, Building2, Home as HomeIcon, UtensilsCrossed, ArrowRight, Shield, MapPin, Phone } from 'lucide-react';
import ListingCard from '../components/ListingCard';
import Footer from '../components/Footer';

const API = import.meta.env.VITE_API_URL || 'https://stayspg.onrender.com/api';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/listings`).then(r => r.json()).then(setListings).catch(console.error);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${searchQuery}`);
  };

  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Perfect <em>Stay</em> in Bhubaneswar</h1>
          <p>PG, Flats & Mess — verified listings, direct owner contact, no broker.</p>
          <div className="search-bar-wrapper">
            <form className="search-bar" onSubmit={handleSearch}>
              <input type="text" placeholder="Search by area or landmark..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <button type="submit" className="btn btn-accent"><SearchIcon size={18} /> Search</button>
            </form>
          </div>
          <div className="category-pills">
            <Link to="/search?category=PG" className="pill"><Building2 size={18} /> PG</Link>
            <Link to="/search?category=Flat" className="pill"><HomeIcon size={18} /> Flat</Link>
            <Link to="/search?category=Mess" className="pill"><UtensilsCrossed size={18} /> Mess</Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><strong>●</strong> {listings.length}+ Listings</div>
            <div className="hero-stat"><strong>✦</strong> No Broker</div>
            <div className="hero-stat"><strong>●</strong> Free Booking</div>
          </div>
        </div>
      </section>

      {/* Featured */}
      {listings.length > 0 && (
        <section className="section container">
          <div className="section-header">
            <h2>Available Now</h2>
            <p>Latest listings from verified owners in Bhubaneswar</p>
          </div>
          <div className="grid-3">
            {listings.slice(0, 6).map(l => <ListingCard key={l.id} listing={l} />)}
          </div>
          {listings.length > 6 && (
            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <Link to="/search" className="btn btn-outline btn-lg">View All <ArrowRight size={18} /></Link>
            </div>
          )}
        </section>
      )}

      {/* How it works */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Simple steps to find your next stay</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            {[
              { icon: <SearchIcon size={28} />, title: 'Search', desc: 'Browse PGs, Flats & Mess by area, budget, and preferences' },
              { icon: <Shield size={28} />, title: 'Verified', desc: 'All listings verified with direct owner contact — no middleman' },
              { icon: <Phone size={28} />, title: 'Connect', desc: 'Call or WhatsApp the owner and move in hassle-free' }
            ].map(item => (
              <div key={item.title} style={{ padding: '2rem' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary-pale)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section container" style={{ textAlign: 'center' }}>
        <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', borderRadius: 'var(--radius-2xl)', padding: '4rem 2rem', color: 'white' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Own a PG, Flat or Mess?</h2>
          <p style={{ fontSize: '1.05rem', opacity: 0.9, maxWidth: '480px', margin: '0 auto 2rem' }}>
            List your property on BhubaneswarStay for free and reach thousands of room seekers.
          </p>
          <Link to="/register" className="btn btn-lg" style={{ background: 'white', color: 'var(--primary)', fontWeight: 700 }}>
            Register as Owner <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
