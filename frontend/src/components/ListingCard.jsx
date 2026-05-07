import { MapPin, ArrowRight, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';

const badgeClass = {
  PG: 'badge-pg',
  Flat: 'badge-flat',
  "Owner's House": 'badge-owner-house'
};

const ListingCard = ({ listing }) => {
  const mainImage = listing.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';
  const rent = listing.rent || 0;

  return (
    <Link to={`/listing/${listing.id}`} className="card" id={`listing-card-${listing.id}`}>
      <div className="card-img-wrapper">
        <img
          src={mainImage}
          alt={listing.title}
          className="card-img"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'; }}
        />
        <span className={`card-badge ${badgeClass[listing.category] || 'badge-pg'}`}>
          {listing.category}
        </span>
        {listing.suitableFor && listing.suitableFor !== 'Any' && (
          <span className="card-gender">{listing.suitableFor}</span>
        )}
        <div className="card-arrow"><ArrowRight size={16} /></div>
      </div>

      <div className="card-body">
        <div className="card-price">
          ₹{Number(rent).toLocaleString('en-IN')}
          <span> /month</span>
        </div>
        <h3 className="card-title">{listing.title}</h3>
        <div className="card-location">
          <MapPin size={14} />
          {listing.location}
          {listing.landmark && <span> • {listing.landmark}</span>}
        </div>
        <div className="card-tags">
          {listing.bhk && <span className="tag">{listing.bhk}</span>}
          {listing.amenities?.slice(0, 3).map(a => <span className="tag" key={a}>{a}</span>)}
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
