import Hero from "../components/Hero";
import { useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Helmet } from "react-helmet";

// import burgerImg from "../assets/aalotikiburge.jpeg";
// import kitkatImg from "../assets/kitkat shake.jpeg";
// import paneerImg from "../assets/Paneer tikka.jpeg";
// import virginMojitoImg from "../assets/Mojito.jpeg";
import concertImg from "../assets/Concert.jpeg";
import HppyBirthdayImg from "../assets/Happy Birthday.jpeg";
import partImg from "../assets/birthday party.jpeg";

// 3D images 
import pizza from "../assets/food/pizzaimage.webp";
import burger from "../assets/food/burger.webp";
import shake from "../assets/food/shake.webp";
import mojito from "../assets/food/mojito.webp";
import pasta from "../assets/food/pasta.webp";
import tea from "../assets/food/tea.webp";
import nachos from "../assets/food/nachos.webp";
import icecream from "../assets/food/icecream.webp";
import dessert from "../assets/food/dessert.webp";
import sandwich from "../assets/food/sandwich.webp";
import wraps from "../assets/food/wraps.webp";
import coffee from "../assets/food/coffee.webp";


export default function Home() {

  const scrollRef = useRef(null);



  const items = [
  { name: "Pizza", img: pizza },
  { name: "Burger", img: burger },
  { name: "Shake", img: shake },
  { name: "Mojito", img: mojito },
  { name: "Pasta", img: pasta },
  { name: "Tea", img: tea },
  { name: "Nachos", img: nachos },
  { name: "Ice Cream", img: icecream },
  { name: "Dessert", img: dessert },
  { name: "Sandwich", img: sandwich },
  { name: "Wraps", img: wraps },
  { name: "Coffee", img: coffee },
];

const scrollLeft = () =>
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });

  const scrollRight = () =>
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });

  return (
    <div className="animate-fadeIn">
     <Helmet>
  {/* ================= META TITLE & DESCRIPTION ================= */}
  <title>
    Shaina Café Rawatsar | Best Vegetarian Café on Ganganagar–Jaipur Highway
  </title>

  <meta
    name="description"
    content="Shaina Café Rawatsar is a family-friendly vegetarian café on the Ganganagar–Jaipur Highway near Bank of Baroda. Enjoy burgers, shakes, coffee, pizza, wraps, kid-friendly indoor games, party space, and free parking. Open daily 10 AM – 10 PM."
  />

  {/* ================= KEYWORDS ================= */}
  <meta
    name="keywords"
    content="Shaina Café Rawatsar, cafe near me, Rawatsar cafe, best cafe in Rawatsar, vegetarian cafe Rajasthan, highway cafe Ganganagar Jaipur, family cafe Rawatsar, kids friendly cafe, party cafe Rawatsar, coffee burgers shakes Rawatsar"
  />

  {/* ================= CANONICAL ================= */}
  <link
    rel="canonical"
    href="https://shainacafe-rawatsar.com/"
  />

  {/* ================= OPEN GRAPH (SOCIAL PREVIEW) ================= */}
  <meta
    property="og:title"
    content="Shaina Café Rawatsar – Best Vegetarian Café in Rawatsar"
  />
  <meta
    property="og:description"
    content="Premium vegetarian café on Ganganagar–Jaipur Highway with burgers, shakes, coffee, indoor games for kids, party bookings, and free parking."
  />
  <meta
    property="og:image"
    content="https://shainacafe-rawatsar.com/assets/cafeimg.jpg"
  />
  <meta
    property="og:url"
    content="https://shainacafe-rawatsar.com/"
  />
  <meta property="og:type" content="restaurant" />

  {/* ================= JSON-LD STRUCTURED DATA ================= */}
  <script type="application/ld+json">
    {`
      {
        "@context": "https://schema.org",
        "@type": "CafeOrCoffeeShop",
        "name": "Shaina Café Rawatsar",
        "url": "https://shainacafe-rawatsar.com/",
        "image": [
          "https://shainacafe-rawatsar.com/assets/cafeimg.jpg",
          "https://shainacafe-rawatsar.com/assets/gallery3.jpg",
          "https://shainacafe-rawatsar.com/assets/gallery4.jpg"
        ],
        "telephone": "+91-9253039964",
        "priceRange": "₹200–400",
        "openingHours": "Mo-Su 10:00-22:00",
        "servesCuisine": [
          "Vegetarian",
          "Cafe",
          "Coffee",
          "Burgers",
          "Pizza",
          "Shakes",
          "Snacks"
        ],
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Ganganagar–Jaipur Highway, near Bank of Baroda",
          "addressLocality": "Rawatsar",
          "addressRegion": "Rajasthan",
          "postalCode": "335524",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 29.2747,
          "longitude": 74.4029
        },
        "amenityFeature": [
          { "@type": "LocationFeatureSpecification", "name": "Parking Available", "value": true },
          { "@type": "LocationFeatureSpecification", "name": "Kid Friendly", "value": true },
          { "@type": "LocationFeatureSpecification", "name": "Indoor Games for Children", "value": true },
          { "@type": "LocationFeatureSpecification", "name": "Family Seating", "value": true },
          { "@type": "LocationFeatureSpecification", "name": "Party Friendly", "value": true }
        ],
        "description": "Shaina Café Rawatsar is a premium vegetarian café located on the Ganganagar–Jaipur Highway. Known for burgers, shakes, coffee, snacks, indoor games, family seating, party space, and quick service.",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "250"
        }
      }
    `}
  </script>
</Helmet>



      {/* HERO */}
      <Hero />

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-[#FFF7E6] text-amber-900">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Why Choose{" "}
            <span className="text-amber-700">Shaina Café Rawatsar</span>
          </h2>

          <p className="text-center max-w-3xl mx-auto text-gray-700 mb-12 text-lg">
  Shaina Café is one of the <strong>top-rated cafés in Rawatsar</strong>,
  located right on the <strong>Ganganagar–Jaipur Highway (NH-62)</strong>.
  We are known for our <strong>freshly prepared vegetarian snacks, premium shakes, 
  handcrafted coffee, and quick service</strong>.  
  Our café is a popular stop for <strong>travellers, families, bikers, students</strong> {" "}  
  and anyone looking for a clean, comfortable and relaxing place to eat on the highway.
</p>


          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: "🍔",
                title: "Premium Quality",
                text: "We use the freshest and high-quality ingredients to serve the best burgers, shakes and snacks in Rawatsar.",
              },
              {
                icon: "⚡",
                title: "Fast Service",
                text: "A perfect highway café stop — quick, hygienic and ideal for travellers looking for fresh and tasty food.",
              },
              {
                icon: "😊",
                title: "Comfort & Taste",
                text: "Experience a cozy café ambience with great taste, family-friendly seating and relaxing atmosphere.",
              },
            ].map((box, i) => (
              <div
                key={i}
                className="p-8 bg-white rounded-2xl shadow-lg text-center hover:shadow-xl hover:-translate-y-1 transition"
              >
                <span className="text-5xl">{box.icon}</span>
                <h3 className="font-bold text-xl mt-4">{box.title}</h3>
                <p className="text-gray-700 mt-2">{box.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR ITEMS */}
       <section className="py-14 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Title + arrows */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">
  Our Bestselling Food Options – Burgers, Shakes, Wraps & More
</h2>


          <div className="flex gap-3">
            <button
              onClick={scrollLeft}
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              <FiChevronLeft size={20} />
            </button>

            <button
              onClick={scrollRight}
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable row */}
        <div
          ref={scrollRef}
          className="flex gap-10 overflow-x-scroll no-scrollbar py-4"
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center cursor-pointer hover:scale-105 transition"
            >
              <img 
                loading="lazy"
                src={item.img}
                alt={item.name}
                className="w-40 h-40 object-contain min-w-40 min-h-40  !w-40 !h-40"
              />
              <p className="text-lg mt-2 font-medium">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

      {/* PARTY & EVENTS SECTION */}
      <section className="py-20 bg-[#FFF1D6] text-amber-900">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Host Your <span className="text-amber-700">Parties & Events</span>
          </h2>

          <p className="text-gray-700 max-w-3xl mx-auto mb-10 text-lg">
  Looking for the perfect place to celebrate <strong>birthday parties,
  anniversaries, kitty parties or group events in Rawatsar?.</strong> {" "}
  Shaina Café offers a beautifully decorated indoor space with 
  <strong>comfortable seating, premium food, customised arrangements and 
  dedicated service</strong>.  
  We are one of the most preferred <strong>family-friendly cafés and party venues 
  near Rawatsar</strong>.
</p>


          <div className="grid md:grid-cols-3 gap-8">
            <div
              className="rounded-2xl h-52 bg-cover bg-center shadow-lg"
              style={{ backgroundImage: `url(${concertImg})` }}
            ></div>
            <div
              className="rounded-2xl h-52 bg-cover bg-center shadow-lg"
              style={{ backgroundImage: `url(${HppyBirthdayImg})` }}
            ></div>
            <div
              className="rounded-2xl h-52 bg-cover bg-center shadow-lg"
              style={{ backgroundImage: `url(${partImg})` }}
            ></div>
          </div>

          <button
            onClick={() => (window.location.href = "/contact")}
            className="mt-10 px-8 py-3 bg-amber-700 text-white font-bold rounded-lg hover:bg-amber-800"
          >
            Contact Us for Bookings
          </button>
        </div>
      </section>

      {/* CTA BAR */}
      <section className="py-16 bg-amber-700 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Hungry? Order Your Favourite Dish Now!
        </h2>
        <p className="text-lg text-white/90 mb-4">
  Enjoy freshly prepared <strong>burgers, wraps, shakes, pizza, cold coffee 
  and more</strong> at Shaina Café Rawatsar — one of the {" "}
  <strong>best vegetarian cafés on the Ganganagar–Jaipur highway</strong>.
</p>

        <button
          onClick={() => (window.location.href = "/menu")}
          className="px-10 py-3 bg-white text-amber-700 font-bold rounded-lg hover:bg-gray-200"
        >
          Explore Menu
        </button>
      </section>
    </div>
  );
}
