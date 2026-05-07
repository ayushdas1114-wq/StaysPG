import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  MapPin, ArrowLeft, Phone, User, Calendar, ShieldCheck, CheckCircle2, Info, ChevronLeft, ChevronRight, Share2, LogIn 
} from 'lucide-react';
import Footer from '../components/Footer';

const API = import.meta.env.VITE_API_URL || 'https://stayspg.onrender.com/api';
const badgeColor = { PG: '#E65100', Flat: '#2563eb', "Owner's House": '#d97706' };

const ListingDetail = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [checking, setChecking] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetch(`${API}/listings/${id}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => { 
        setListing(data); 
        setLoading(false);
        // Initialize map after listing data is available
        if (data && window.L && user) {
          setTimeout(() => {
            const map = window.L.map('listing-map').setView([data.lat || 20.2961, data.lng || 85.8245], 15);
            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap'
            }).addTo(map);
            window.L.marker([data.lat || 20.2961, data.lng || 85.8245]).addTo(map)
              .bindPopup(data.title)
              .openPopup();
          }, 500);
        }
      })
      .catch(() => setLoading(false));
  }, [id, user]);

  const handleCheckAvailability = () => {
    setChecking(true);
    // Simulate checking availability
    setTimeout(() => {
      setChecking(false);
      setShowContact(true);
    }, 1500);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If not logged in, show login prompt
  if (!user) {
    return (
      <div>
        <div className="container section" style={{ textAlign: 'center', padding: '6rem 0' }}>
          <div style={{ 
            maxWidth: '480px', margin: '0 auto', padding: '3rem', 
            background: 'white', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{ 
              width: '80px', height: '80px', borderRadius: '50%', 
              background: 'var(--primary-pale)', color: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem', fontSize: '2rem'
            }}>
              <LogIn size={36} />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
              Login to View Details
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
              Sign in to see full details, location on map, and contact the owner.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/login" className="btn btn-primary btn-lg" style={{ flex: 1 }}>Login</Link>
              <Link to="/register" className="btn btn-outline btn-lg" style={{ flex: 1 }}>Sign Up</Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) return <div className="container section" style={{ textAlign: 'center', padding: '6rem 0' }}>Loading details...</div>;
  if (!listing) return <div className="container section" style={{ textAlign: 'center', padding: '6rem 0' }}><h2>Stay Not Found</h2><Link to="/search" className="btn btn-primary">Browse All</Link></div>;

  const imgs = listing.images?.length > 0 ? listing.images : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'];
  const rent = listing.rent || 0;

  return (
    <div>
      <div className="container section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <Link to="/search" className="btn btn-ghost btn-sm" style={{ gap: '0.4rem', color: 'var(--text-muted)' }}><ArrowLeft size={18} /> Back</Link>
          <button onClick={handleShare} className="btn btn-ghost btn-sm" style={{ gap: '0.4rem' }}>{copied ? <CheckCircle2 size={16} color="var(--accent)" /> : <Share2 size={16} />} Share</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
          <div>
            <div style={{ position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
              <img src={imgs[imgIdx]} alt="" className="detail-hero-img" style={{ height: '450px' }} />
              {imgs.length > 1 && (
                <>
                  <button onClick={() => setImgIdx(i => (i - 1 + imgs.length) % imgs.length)} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft /></button>
                  <button onClick={() => setImgIdx(i => (i + 1) % imgs.length)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight /></button>
                </>
              )}
            </div>

            <div style={{ marginTop: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ padding: '0.35rem 1rem', borderRadius: 'var(--radius-full)', background: badgeColor[listing.category] || 'var(--primary)', color: 'white', fontSize: '0.8rem', fontWeight: 700 }}>{listing.category}</span>
                <span style={{ padding: '0.35rem 1rem', borderRadius: 'var(--radius-full)', background: 'var(--primary-pale)', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700 }}>{listing.suitableFor}</span>
              </div>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>{listing.title}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                <MapPin size={20} color="var(--primary)" /> {listing.location} {listing.landmark && <span>• Near {listing.landmark}</span>}
              </div>

              {/* Map Container */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontWeight: 800 }}>Location on Map</h3>
                <div id="listing-map" style={{ height: '300px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid #eee' }}></div>
              </div>

              <div style={{ padding: '2rem', background: 'white', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1.25rem', fontWeight: 800 }}>Stay Amenities</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {listing.amenities?.map(a => <span key={a} className="amenity-chip">✓ {a}</span>)}
                </div>
              </div>
            </div>
          </div>

          <div style={{ position: 'sticky', top: '5.5rem' }}>
            <div className="detail-card">
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>MONTHLY RENT</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>₹{Number(listing.rent).toLocaleString('en-IN')}</div>
                {listing.deposit && <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Deposit: {listing.deposit}</div>}
              </div>

              <div style={{ padding: '1.25rem', background: 'var(--background)', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ background: 'var(--primary)', color: 'white', width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={20} /></div>
                  <div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Posted by</div><div style={{ fontWeight: 800 }}>{listing.ownerName}</div></div>
                </div>
              </div>

              {!showContact ? (
                <button 
                  onClick={handleCheckAvailability} 
                  disabled={checking}
                  className="btn btn-primary btn-lg" 
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  {checking ? <><div className="spinner-sm"></div> Checking...</> : 'Check Availability'}
                </button>
              ) : (
                <>
                  {listing.isAvailable !== false ? (
                    <div style={{ marginBottom: '1rem', padding: '1rem', background: '#ecfdf5', borderRadius: 'var(--radius-md)', color: '#065f46', fontSize: '0.9rem', textAlign: 'center', fontWeight: 600 }}>
                      <ShieldCheck size={18} style={{ verticalAlign: '-4px', marginRight: '4px' }} /> This property is currently available!
                    </div>
                  ) : (
                    <div style={{ marginBottom: '1rem', padding: '1rem', background: '#fff7ed', borderRadius: 'var(--radius-md)', color: '#9a3412', fontSize: '0.9rem', textAlign: 'center', fontWeight: 600 }}>
                      <Info size={18} style={{ verticalAlign: '-4px', marginRight: '4px' }} /> Currently Occupied (Contact owner for next opening)
                    </div>
                  )}
                  <a href={`tel:${listing.contact}`} className="btn btn-primary btn-lg" style={{ width: '100%', marginBottom: '0.75rem' }}><Phone size={18} /> Call Owner</a>
                  <a href={`https://wa.me/91${listing.contact}?text=Hi, I found your "${listing.title}" on BhubaneswarStay.`} target="_blank" rel="noopener" className="btn btn-accent btn-lg" style={{ width: '100%' }}>💬 WhatsApp</a>
                </>
              )}
              
              <div style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}><Calendar size={14} style={{ verticalAlign: '-2px' }} /> Posted: {new Date(listing.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ListingDetail;
