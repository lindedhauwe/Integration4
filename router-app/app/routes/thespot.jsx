import { useLoaderData, useNavigate } from "react-router";
import { supabase } from "../supabase";
import "./thespot.css";

export async function clientLoader({ request }) {
  const url = new URL(request.url);
  const cafeId = url.searchParams.get("cafe_id");

  if (!cafeId) return { cafe: null };

  const { data: cafe } = await supabase
    .from("cafés")
    .select("*")
    .eq("id", cafeId)
    .single();

  const { data: recs } = await supabase
    .from("recommendations")
    .select("*")
    .eq("cafe_id", cafeId)
    .limit(10);

  return { cafe: cafe || null, recs: recs || [] };
}
clientLoader.hydrate = true;

export default function TheSpot() {
  const { cafe, recs } = useLoaderData();
  const navigate = useNavigate();

  if (!cafe) {
    return (
      <div className="thespot-page">
        <button className="thespot-back" onClick={() => navigate(-1)}>← Back</button>
        <p className="thespot-notfound">Café not found.</p>
      </div>
    );
  }

  return (
    <div className="thespot-page">
      <button className="thespot-back" onClick={() => navigate(-1)}>← Back</button>

      <div className="thespot-hero">
        <h1 className="thespot-name">{cafe.name}</h1>
        {cafe.adress && (
          <p className="thespot-address">📍 {cafe.adress}</p>
        )}
      </div>

      {cafe.description && (
        <p className="thespot-description">{cafe.description}</p>
      )}

      {cafe.vibe_tags?.length > 0 && (
        <div className="thespot-tags">
          {cafe.vibe_tags.map((t) => (
            <span key={t} className="thespot-tag">#{t}</span>
          ))}
        </div>
      )}

      {recs.length > 0 && (
        <section className="thespot-recs">
          <h2 className="thespot-recs__title">What people say</h2>
          {recs.map((r) => (
            <div key={r.id} className="thespot-rec-card">
              {r.photo_url && (
                <img src={r.photo_url} alt="" className="thespot-rec-card__photo" />
              )}
              <div className="thespot-rec-card__body">
                <p className="thespot-rec-card__author">{r.name}, {r.age}</p>
                <p className="thespot-rec-card__text">{r.description}</p>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
