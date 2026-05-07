import { useState, useEffect, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, Search as SearchIcon, X, LogIn } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import ListingCard from '../components/ListingCard';
import Footer from '../components/Footer';

const API = import.meta.env.VITE_API_URL || 'https://stayspg.onrender.com/api';

const Search = () => {
  const { user } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [gender, setGender] = useState(searchParams.get('gender') || '');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchListings = (q, cat, gen, mp) => {
    setLoading(true);
    const p = new URLSearchParams();
    if (q) p.set('search', q);
    if (cat) p.set('category', cat);
    if (gen) p.set('gender', gen);
    if (mp) p.set('maxPrice', mp);
    fetch(`${API}/listings?${p.toString()}`).then(r => r.json()).then(d => { setListings(d); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchListings(query, category, gender, ''); }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    setSearchParams({ q: query, category, gender });
    fetchListings(query, category, gender, maxPrice);
  };

  const clearFilters = () => {
    setQuery(''); setCategory(''); setGender(''); setMaxPrice(''); setSearchParams({});
    fetchListings('', '', '', '');
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
              Login to Explore Rooms
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
              Sign in to browse PGs, Flats & Mess listings in Bhubaneswar. It's free and takes just 10 seconds!
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/login" className="btn btn-primary btn-lg" style={{ flex: 1 }}>Login</Link>
              <Link to="/register" className="btn btn-outline btn-lg" style={{ flex: 1 }}>Sign Up Free</Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <div className="container section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div><h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>Find Your Stay</h1><p style={{ color: 'var(--text-muted)' }}>{loading ? 'Searching...' : `${listings.length} stays found in Bhubaneswar`}</p></div>
          {(query || category || gender || maxPrice) && <button onClick={clearFilters} className="btn btn-ghost btn-sm" style={{ gap: '0.4rem' }}><X size={16} /> Clear Filters</button>}
        </div>

        <div className="search-layout">
          <aside className="filter-panel" style={{ position: 'sticky', top: '5.5rem' }}>
            <h3 style={{ marginBottom: '1.25rem' }}><SlidersHorizontal size={18} style={{ verticalAlign: '-3px' }} /> Filters</h3>
            <form onSubmit={handleFilter}>
              <div className="input-group"><label>Area / Keyword</label><input type="text" className="input" value={query} onChange={e => setQuery(e.target.value)} placeholder="e.g. Patia" /></div>
              <div className="input-group"><label>Category</label><select className="input select-input" value={category} onChange={e => setCategory(e.target.value)}><option value="">All Categories</option><option value="PG">PG</option><option value="Flat">Flat</option><option value="Owner's House">Owner's House</option></select></div>
              <div className="input-group"><label>Who is it for?</label><select className="input select-input" value={gender} onChange={e => setGender(e.target.value)}><option value="">Any</option><option value="Boys">Boys</option><option value="Girls">Girls</option></select></div>
              <div className="input-group"><label>Max Rent (₹/mo)</label><input type="number" className="input" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="e.g. 8000" /></div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Search Rooms</button>
            </form>
          </aside>
          <main className="results-area">
            {loading ? <p>Searching...</p> : listings.length > 0 ? <div className="grid-3">{listings.map(l => <ListingCard key={l._id} listing={l} />)}</div> : <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}><h3>No rooms found</h3><p>Try resetting filters or searching another area.</p></div>}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Search;
