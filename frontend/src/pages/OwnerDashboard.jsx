import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Home, MapPin, IndianRupee, Phone, CheckCircle, Upload, Image as ImageIcon, X } from 'lucide-react';
import Footer from '../components/Footer';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const AMENITIES = ['WiFi', 'AC', 'Food Facility', 'Power Backup', 'RO Water', 'Parking', 'CCTV', 'Washing Machine'];

const OwnerDashboard = () => {
  const { user, token, isOwner } = useContext(AuthContext);
  const navigate = useNavigate();
  const [myListings, setMyListings] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Simplified Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'PG',
    suitableFor: 'Any',
    location: '',
    landmark: '',
    rent: '',
    deposit: '',
    bhk: '',
    contact: '',
    amenities: [],
    images: []
  });

  useEffect(() => {
    if (!user || !isOwner) { navigate('/login'); return; }
    fetchMyListings();
    setFormData(prev => ({ ...prev, contact: user.phone || '' }));
  }, [user, isOwner]);

  const fetchMyListings = () => {
    fetch(`${API}/listings/my`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setMyListings(data); })
      .catch(console.error);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); setError('');

    if (!formData.title || !formData.location || !formData.rent || !formData.contact) {
      setError('Please fill in the required fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...formData, images: formData.images.filter(img => img.trim()) })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Listing published successfully! 🎉');
        setMyListings(prev => [...prev, data]);
        setFormData({
          title: '', category: 'PG', suitableFor: 'Any', location: '', landmark: '',
          rent: '', deposit: '', bhk: '', contact: user.phone || '',
          amenities: [], images: []
        });
      } else {
        setError(data.message || 'Failed to list property');
      }
    } catch { setError('Connection error'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      const res = await fetch(`${API}/listings/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setMyListings(prev => prev.filter(l => l.id !== id));
    } catch { setError('Failed to delete'); }
  };

  if (!user || !isOwner) return null;

  return (
    <div>
      <div className="container section">
        <h1 className="page-title">Owner Dashboard</h1>
        <p className="page-subtitle">Quickly list your property for room seekers in Bhubaneswar.</p>

        {message && <div className="success-msg">{message}</div>}
        {error && <div className="error-msg">{error}</div>}

        <div className="dashboard-layout">
          {/* Streamlined Form */}
          <div className="dashboard-form" style={{ padding: '2.5rem' }}>
            <h2 className="form-section-title"><Plus size={22} color="var(--primary)" /> List New Property</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
              <div className="input-group">
                <label>Property Title*</label>
                <input type="text" name="title" className="input" value={formData.title} onChange={handleInputChange} placeholder="e.g. Spacious 1BHK near KIIT" />
              </div>

              <div className="grid-2">
                <div className="input-group">
                  <label>Category*</label>
                  <select name="category" className="input select-input" value={formData.category} onChange={handleInputChange}>
                    <option value="PG">PG</option>
                    <option value="Flat">Flat</option>
                    <option value="Owner's House">Owner's House</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Suitable For</label>
                  <select name="suitableFor" className="input select-input" value={formData.suitableFor} onChange={handleInputChange}>
                    <option value="Any">Any</option>
                    <option value="Boys">Boys</option>
                    <option value="Girls">Girls</option>
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="input-group">
                  <label>Area in Bhubaneswar*</label>
                  <input type="text" name="location" className="input" value={formData.location} onChange={handleInputChange} placeholder="e.g. Patia" />
                </div>
                <div className="input-group">
                  <label>Nearby Landmark</label>
                  <input type="text" name="landmark" className="input" value={formData.landmark} onChange={handleInputChange} placeholder="e.g. Big Bazaar" />
                </div>
              </div>

              <div className="grid-2">
                <div className="input-group">
                  <label>Monthly Rent (₹)*</label>
                  <input type="number" name="rent" className="input" value={formData.rent} onChange={handleInputChange} placeholder="e.g. 5000" />
                </div>
                <div className="input-group">
                  <label>Security Deposit</label>
                  <input type="text" name="deposit" className="input" value={formData.deposit} onChange={handleInputChange} placeholder="e.g. 1 Month Rent" />
                </div>
              </div>

              {formData.category === 'Flat' && (
                <div className="input-group">
                  <label>BHK Type</label>
                  <select name="bhk" className="input select-input" value={formData.bhk} onChange={handleInputChange}>
                    <option value="">Select BHK</option>
                    <option value="RK">RK</option>
                    <option value="1 BHK">1 BHK</option>
                    <option value="2 BHK">2 BHK</option>
                    <option value="3 BHK">3 BHK</option>
                  </select>
                </div>
              )}

              <div className="input-group">
                <label>Key Amenities</label>
                <div className="chip-group">
                  {AMENITIES.map(a => (
                    <button type="button" key={a} className={`chip ${formData.amenities.includes(a) ? 'chip-active' : ''}`} onClick={() => toggleAmenity(a)}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <label>Property Images* <span className="label-hint">(Select from your device)</span></label>
                <div 
                  className="upload-zone" 
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  <Upload className="upload-icon" size={32} />
                  <p className="upload-text">Click to upload photos</p>
                  <p className="upload-hint">PNG, JPG or WEBP (Max 5MB)</p>
                  <input 
                    id="file-upload" 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    style={{ display: 'none' }} 
                  />
                </div>

                {formData.images.length > 0 && (
                  <div className="preview-grid">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="preview-item">
                        <img src={img} alt="Preview" className="preview-img" />
                        <button 
                          type="button" 
                          className="remove-btn" 
                          onClick={() => removeImage(idx)}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="input-group">
                <label>Contact Number*</label>
                <input type="tel" name="contact" className="input" value={formData.contact} onChange={handleInputChange} placeholder="10-digit number" maxLength={10} />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-lg" 
                style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    Publishing... <div className="spinner-sm" style={{ marginLeft: '0.75rem' }}></div>
                  </>
                ) : (
                  <>
                    Publish Listing <CheckCircle size={18} style={{ marginLeft: '0.5rem' }} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Manage Listings Sidebar */}
          <div className="dashboard-listings">
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              My Listings ({myListings.length})
            </h2>
            {myListings.length === 0 ? (
              <div className="empty-state">
                <Home size={40} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                <p>No listings yet. Post your first room!</p>
              </div>
            ) : (
              myListings.map(l => (
                <div key={l.id} className="my-listing-card">
                  <img src={l.images[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80'} alt="" className="my-listing-img" />
                  <div className="my-listing-body">
                    <span className={`card-badge ${l.category === 'PG' ? 'badge-pg' : l.category === 'Flat' ? 'badge-flat' : 'badge-owner-house'}`} style={{ position: 'static', display: 'inline-block', width: 'fit-content' }}>
                      {l.category}
                    </span>
                    <h4 style={{ margin: '0.4rem 0 0.1rem', fontSize: '0.95rem' }}>{l.title}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{l.location}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                      <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.9rem' }}>₹{l.rent}/mo</span>
                      <button onClick={() => handleDelete(l.id)} className="btn btn-danger btn-sm" style={{ padding: '0.4rem' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OwnerDashboard;
