import { useState } from "react";
import properties from "../../data/properties";

const css = `
  .wishlist-page {
    font-family: Arial, sans-serif;
    min-height: 100vh;
    padding: 32px;
    background: #fff;
  }

  .page {
    max-width: 1200px;
    margin: auto;
  }

  .page-title {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .page-sub {
    color: #717171;
    margin-bottom: 30px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
  }

  .card {
    border-radius: 16px;
    overflow: hidden;
    background: white;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.12);
  }

  .card-img {
    position: relative;
    height: 230px;
  }

  .property-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .heart-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    border: none;
    background: rgba(255,255,255,0.9);
    border-radius: 50%;
    width: 38px;
    height: 38px;
    cursor: pointer;
    font-size: 18px;
  }

  .rating {
    position: absolute;
    bottom: 12px;
    right: 12px;
    background: rgba(255,255,255,0.95);
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
  }

  .card-body {
    padding: 16px;
  }

  .property-title {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .property-type {
    color: #717171;
    font-size: 14px;
    margin-bottom: 6px;
  }

  .location {
    color: #555;
    margin-bottom: 4px;
  }

  .host {
    color: #555;
    font-size: 14px;
    margin-bottom: 10px;
  }

  .saved {
    font-size: 13px;
    color: #888;
    margin-bottom: 12px;
  }

  .price {
    font-size: 16px;
    margin-bottom: 12px;
  }

  .price strong {
    font-size: 18px;
  }

  .actions {
    display: flex;
    gap: 10px;
  }

  .details-btn {
    flex: 1;
    border: none;
    background: #ff385c;
    color: white;
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
  }

  .empty {
    text-align: center;
    padding: 80px 0;
  }

  .empty h3 {
    margin: 16px 0 8px;
  }

  .empty-btn {
    margin-top: 20px;
    background: #ff385c;
    color: white;
    border: none;
    padding: 12px 18px;
    border-radius: 8px;
    cursor: pointer;
  }
`;

export default function Wishlist() {
  const [items, setItems] = useState(properties.slice(0, 6));

  const removeProperty = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <>
      <style>{css}</style>

      <div className="wishlist-page">
        <div className="page">
          <div className="page-title">Wishlist</div>

          <div className="page-sub">
            {items.length} saved properties
          </div>

          {items.length === 0 ? (
            <div className="empty">
              <div style={{ fontSize: "60px" }}>🤍</div>

              <h3>No saved properties yet</h3>

              <p>
                Start exploring amazing stays and save your favorites.
              </p>

              <button className="empty-btn">
                Explore Homes
              </button>
            </div>
          ) : (
            <div className="grid">
              {items.map((property) => (
                <div className="card" key={property.id}>
                  <div className="card-img">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="property-image"
                    />

                    <button
                      className="heart-btn"
                      onClick={() => removeProperty(property.id)}
                    >
                      ❤️
                    </button>

                    <div className="rating">
                      ⭐ {property.rating}
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="property-title">
                      {property.title}
                    </div>

                    <div className="property-type">
                      {property.type || "Property"}
                    </div>

                    <div className="location">
                      📍 {property.location}
                    </div>

                    <div className="host">
                      👥 {property.guests || "N/A"} guests
                    </div>

                    <div className="saved">
                      🛏️ {property.bedrooms || "N/A"} bedrooms • 🚿{" "}
                      {property.bathrooms || "N/A"} bathrooms
                    </div>

                    <div className="price">
                      <strong>
                        ₹{property.price.toLocaleString("en-IN")}
                      </strong>{" "}
                      / night
                    </div>

                    <div className="actions">
                      <button className="details-btn">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}