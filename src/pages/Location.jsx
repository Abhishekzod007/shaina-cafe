import MapEmbed from "../components/MapEmbed";
import "../styles/components.css";

import map1 from "../assets/Location1.webp";
import map2 from "../assets/Location2.webp";
import map3 from "../assets/Location3.webp";
import roadmap from "../assets/Roadmap.webp";

export default function Location() {
  return (
    <div className="min-h-screen gradient-animated-bg px-6 py-14 text-amber-900">

      {/* MAIN HEADING */}
      <h1 className="text-5xl font-extrabold mb-4 text-center">
        Find Shaina Café Rawatsar
      </h1>

      <p className="text-lg text-center max-w-3xl mx-auto leading-relaxed mb-10">
        Shaina Café is located on the{" "}
        <strong>Ganganagar–Jaipur Highway (NH-62)</strong>, making it one of the most 
        convenient and popular stop points for travellers heading toward{" "}
        <strong>Jaipur, Delhi, Ganganagar, Hanumangarh, and Bikaner</strong>.  
        Our café is easy to spot from the roadside and offers{" "}
        <strong>ample parking, clean seating, kids’ play options, and a family-friendly environment</strong>.
      </p>

      {/* SEO BLOCK */}
      <section className="max-w-4xl mx-auto bg-white/50 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-14">
        <h2 className="text-3xl font-bold mb-3">
          Why Visit Shaina Café on the Highway?
        </h2>

        <ul className="list-disc pl-6 space-y-2 text-lg">
          <li><strong>Prime highway location</strong> — Perfect stop for travellers.</li>
          <li><strong>Family-friendly café</strong> with indoor games for kids.</li>
          <li><strong>Spacious parking area</strong> suitable for cars, bikes, and groups.</li>
          <li><strong>Comfortable seating</strong> for families, students, and corporate travellers.</li>
          <li><strong>All-vegetarian menu</strong> with snacks, wraps, burgers, shakes & coffee.</li>
          <li><strong>Ideal for birthday celebrations</strong> and small gatherings.</li>
          <li>Safe and clean rest stop for highway travellers.</li>
        </ul>
      </section>

      {/* LOCATION PHOTOS */}
      <h2 className="text-4xl font-semibold mb-4 text-center">
        Photos of Our Location
      </h2>

      <p className="text-center text-lg mb-8 max-w-2xl mx-auto">
        Here are some real photographs of our café from different angles,  
        showing the approach road and the outside environment.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16">
        {[map1, map2, map3].map((img, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl shadow-xl bg-white/40 backdrop-blur-md hover:shadow-2xl transition-all"
          >
            <img
              src={img}
               aria-hidden="true"
      loading="lazy"
              alt={`Shaina Café Rawatsar location ${i + 1}`}
              className="w-full h-56 object-cover hover:scale-110 transition-transform duration-500"
            />
          </div>
        ))}
      </div>

      {/* HIGHWAY ROUTE MAP */}
      <h2 className="text-4xl font-semibold mb-4 text-center">
        How to Reach Shaina Café
      </h2>

      <p className="text-center text-lg max-w-2xl mx-auto mb-8">
        The map below shows the clear route towards our café from the  {" "}
        <strong>Rawatsar city side and the national highway</strong>.  {" "}
        This helps travellers easily locate the café even during late evenings.
      </p>

      <div className="overflow-hidden rounded-2xl shadow-xl mb-16 bg-white/30 backdrop-blur-md">
        <img
          loading="lazy"
           aria-hidden="true"
          src={roadmap}
          alt="Shaina Café highway access photo"
          className="w-full max-h-[700px] object-cover hover:scale-105 transition-transform duration-700"
        />
      </div>

      {/* GOOGLE MAP LOCATION */}
      <h2 className="text-4xl font-semibold mb-4 text-center">
        Google Maps – Exact Location
      </h2>

      <p className="text-lg text-center mb-6 max-w-2xl mx-auto">
        You can follow the live Google Maps navigation below to reach us accurately  
        without missing the turn on the highway.
      </p>

      <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-white/20 backdrop-blur-md p-4">
        <MapEmbed />
      </div>
    </div>
  );
}
