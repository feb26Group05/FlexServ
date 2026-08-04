import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import {
  FaFan,
  FaBroom,
  FaBolt,
  FaTint,
  FaCut,
  FaPaintRoller,
  FaTools,
  FaChair,
  FaBug,
  FaCar,
  FaShieldAlt,
  FaLeaf,
  FaSun,
  FaTruck,
  FaSearch,
  FaArrowRight,
  FaStar,
  FaBoxes,
  FaCheckCircle,
  FaClock,
  FaRegHeart,
  FaHeart,
  FaUserCheck,
  FaStore
} from "react-icons/fa";

import "../../components/Categories/Categories.css";
import "../../components/Services/Services.css";
import "../../components/Hero/Hero.css";
import "./ServicesPage.css";

const CATEGORIES_DATA = [
  {
    id: "all",
    title: "All Categories",
    description: "Browse all available service providers",
    icon: <FaBoxes />
  },
  {
    id: "ac",
    title: "AC Repair & Service",
    description: "Fast cooling repair & gas refilling",
    icon: <FaFan />
  },
  {
    id: "cleaning",
    title: "Home Deep Cleaning",
    description: "Sanitization & full house cleaning",
    icon: <FaBroom />
  },
  {
    id: "electrician",
    title: "Electrician",
    description: "Wiring, switchboard & fan fixes",
    icon: <FaBolt />
  },
  {
    id: "plumbing",
    title: "Plumbing",
    description: "Leakage, taps & pipe fittings",
    icon: <FaTint />
  },
  {
    id: "salon",
    title: "Salon At Home",
    description: "Facials, massage & beauty packages",
    icon: <FaCut />
  },
  {
    id: "appliance",
    title: "Appliance Repair",
    description: "Fridge, washer & microwave repair",
    icon: <FaTools />
  },
  {
    id: "painting",
    title: "Painting & Waterproofing",
    description: "Wall painting & weather protection",
    icon: <FaPaintRoller />
  },
  {
    id: "pest",
    title: "Pest Control",
    description: "Odorless termite & cockroach treatment",
    icon: <FaBug />
  },
  {
    id: "carpentry",
    title: "Carpentry",
    description: "Door, bed & furniture assembly",
    icon: <FaChair />
  },
  {
    id: "carwash",
    title: "Car Wash & Detailing",
    description: "Doorstep foam wash & interior polish",
    icon: <FaCar />
  },
  {
    id: "security",
    title: "CCTV & Security",
    description: "Smart lock & camera installation",
    icon: <FaShieldAlt />
  },
  {
    id: "gardening",
    title: "Gardening & Lawn",
    description: "Lawn trimming & plant care",
    icon: <FaLeaf />
  },
  {
    id: "solar",
    title: "Solar & Inverter",
    description: "Rooftop solar & battery service",
    icon: <FaSun />
  },
  {
    id: "movers",
    title: "Packers & Movers",
    description: "Safe home shifting & transport",
    icon: <FaTruck />
  }
];

const SERVICES_DATA = [
  // --- AC REPAIR PROVIDERS ---
  {
    id: 101,
    title: "Split & Window AC Foam Jet Servicing",
    providerName: "CoolCare Express",
    providerRating: "4.9",
    categoryId: "ac",
    categoryName: "AC Repair & Service",
    rating: "4.9",
    reviews: "3.4k",
    price: "399",
    oldPrice: "699",
    badge: "Top Rated Partner",
    duration: "45 Mins",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&auto=format&fit=crop&q=80",
    description: "2x deeper foam jet wash, filter cleaning, drain tray flushing & gas pressure check.",
    features: ["Foam jet wash technology", "Gas leak check", "30-day warranty"],
    keywords: ["ac", "coolcare", "foam jet", "cooling", "gas refill", "split ac"]
  },
  {
    id: 102,
    title: "AC Gas Charging & Leakage Repair",
    providerName: "FrostBite HVAC Tech",
    providerRating: "4.8",
    categoryId: "ac",
    categoryName: "AC Repair & Service",
    rating: "4.8",
    reviews: "1.9k",
    price: "1299",
    oldPrice: "1899",
    badge: "Gas Specialist",
    duration: "60 Mins",
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800&auto=format&fit=crop&q=80",
    description: "Complete copper pipe leak repair, vacuuming, and 100% Freon/R32 gas refill.",
    features: ["Digital gas pressure gauge", "Nitrogen leak testing", "60-day gas warranty"],
    keywords: ["ac", "gas refill", "frostbite", "leakage", "cooling", "freon"]
  },
  {
    id: 103,
    title: "Master AC Installation & Uninstallation",
    providerName: "ClimateControl Pro Services",
    providerRating: "4.7",
    categoryId: "ac",
    categoryName: "AC Repair & Service",
    rating: "4.7",
    reviews: "1.2k",
    price: "799",
    oldPrice: "1299",
    badge: "Super Provider",
    duration: "90 Mins",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
    description: "Precision wall drilling, indoor/outdoor unit mounting & copper pipe insulation.",
    features: ["Core drilling tool", "Heavy outdoor stand included", "Zero wall damage guarantee"],
    keywords: ["ac", "installation", "uninstallation", "climatecontrol", "mounting"]
  },

  // --- HOME CLEANING PROVIDERS ---
  {
    id: 201,
    title: "Full House Deep Sanitization & Polish",
    providerName: "SparkleClean India",
    providerRating: "4.95",
    categoryId: "cleaning",
    categoryName: "Home Deep Cleaning",
    rating: "4.95",
    reviews: "4.2k",
    price: "1499",
    oldPrice: "2499",
    badge: "Bestseller Partner",
    duration: "4 - 5 Hours",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80",
    description: "Full house deep scrubbing, kitchen chimney degreasing, bathroom sanitization & floor buffing.",
    features: ["Industrial single-disc scrubber", "Taski german chemicals", "Team of 4 trained pros"],
    keywords: ["cleaning", "sparkleclean", "house", "deep clean", "sanitization", "mopping"]
  },
  {
    id: 202,
    title: "Bathroom Hard Stain & Tile Scrubbing",
    providerName: "ShineNation Hygiene",
    providerRating: "4.8",
    categoryId: "cleaning",
    categoryName: "Home Deep Cleaning",
    rating: "4.8",
    reviews: "2.1k",
    price: "499",
    oldPrice: "799",
    badge: "Stain Expert",
    duration: "60 Mins",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80",
    description: "Hard water scale removal from glass shower doors, tile grout cleaning & toilet disinfections.",
    features: ["Non-corrosive descalers", "Tile grout restoration", "High shine tap polish"],
    keywords: ["bathroom", "shinenation", "tile", "toilet", "washroom", "stain"]
  },
  {
    id: 203,
    title: "Sofa & Mattress Fabric Injection Shampooing",
    providerName: "EcoClean Upholstery Pros",
    providerRating: "4.9",
    categoryId: "cleaning",
    categoryName: "Home Deep Cleaning",
    rating: "4.9",
    reviews: "1.8k",
    price: "699",
    oldPrice: "1099",
    badge: "Premier Choice",
    duration: "90 Mins",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80",
    description: "Karcher vacuum extraction shampooing for fabric, suede & leather sofas.",
    features: ["Deep suction extraction", "Stain & odor removal", "Quick 2-hour dry time"],
    keywords: ["sofa", "upholstery", "ecoclean", "mattress", "shampoo", "couch"]
  },

  // --- ELECTRICIAN PROVIDERS ---
  {
    id: 301,
    title: "Switchboard & Short Circuit Troubleshooting",
    providerName: "VoltMaster Electricians",
    providerRating: "4.9",
    categoryId: "electrician",
    categoryName: "Electrician",
    rating: "4.9",
    reviews: "2.5k",
    price: "249",
    oldPrice: "399",
    badge: "Quick Arrival",
    duration: "30 Mins",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80",
    description: "Identify short circuits, replace MCB switches, socket repair & fuse replacement.",
    features: ["Digital multimeter diagnosis", "Certified electrician", "Safety insulated tools"],
    keywords: ["electrician", "voltmaster", "switchboard", "short circuit", "mcb", "wire"]
  },
  {
    id: 302,
    title: "Chandelier & Designer Light Installation",
    providerName: "CurrentCare Solutions",
    providerRating: "4.85",
    categoryId: "electrician",
    categoryName: "Electrician",
    rating: "4.85",
    reviews: "1.1k",
    price: "349",
    oldPrice: "599",
    badge: "Lighting Pro",
    duration: "45 Mins",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop&q=80",
    description: "Precision mounting for heavy crystal chandeliers, LED strip lights & ceiling fan assembly.",
    features: ["Heavy ceiling anchor bolts", "Concealed wiring setup", "Clean finish"],
    keywords: ["light", "chandelier", "currentcare", "fan", "mounting", "ceiling"]
  },
  {
    id: 303,
    title: "Complete Home Safety Rewiring & Inspection",
    providerName: "PowerSafe Electrical Co.",
    providerRating: "4.75",
    categoryId: "electrician",
    categoryName: "Electrician",
    rating: "4.75",
    reviews: "890",
    price: "1999",
    oldPrice: "2999",
    badge: "Master Electrician",
    duration: "3 - 4 Hours",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80",
    description: "Thermal imaging load audit, main meter board rewiring, earthing check & surge protector installation.",
    features: ["Havells & Finolex wiring", "Earthing load audit", "1-year safety certificate"],
    keywords: ["powersafe", "rewiring", "earthing", "inspection", "meter"]
  },

  // --- PLUMBING PROVIDERS ---
  {
    id: 401,
    title: "Pipe Leak Repair & Tap Replacement",
    providerName: "AquaFix Plumbing",
    providerRating: "4.88",
    categoryId: "plumbing",
    categoryName: "Plumbing",
    rating: "4.88",
    reviews: "3.1k",
    price: "299",
    oldPrice: "499",
    badge: "Popular Partner",
    duration: "40 Mins",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80",
    description: "Fix hidden pipe leakages, install mixer taps, basin waste pipes & shower heads.",
    features: ["Teflon pressure sealing", "Jaquar / Hindware fittings", "Instant leak fix"],
    keywords: ["plumbing", "aquafix", "leak", "tap", "pipe", "sink", "water"]
  },
  {
    id: 402,
    title: "Drain Unblocking & Sewer Line Cleaning",
    providerName: "DrainClear Specialists",
    providerRating: "4.8",
    categoryId: "plumbing",
    categoryName: "Plumbing",
    rating: "4.8",
    reviews: "1.7k",
    price: "499",
    oldPrice: "799",
    badge: "Blocked Pipe Pro",
    duration: "45 Mins",
    image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&auto=format&fit=crop&q=80",
    description: "Motorized drain snake clearing for clogged bathroom traps, kitchen sinks & main sewer lines.",
    features: ["Electric rotary cable snake", "Chemical-free unblocking", "Odor removal"],
    keywords: ["drain", "drainclear", "clog", "sink", "blockage", "sewer"]
  },
  {
    id: 403,
    title: "Water Tank Cleaning & Pressure Pump Repair",
    providerName: "HydroFlow Plumbing Experts",
    providerRating: "4.9",
    categoryId: "plumbing",
    categoryName: "Plumbing",
    rating: "4.9",
    reviews: "1.4k",
    price: "799",
    oldPrice: "1299",
    badge: "Top Rated",
    duration: "90 Mins",
    image: "https://images.unsplash.com/photo-1542013936693-884638332954?w=800&auto=format&fit=crop&q=80",
    description: "Overhead PVC/concrete water tank UV disinfections, sludge removal & automatic pressure pump repair.",
    features: ["Submersible sludge pump", "UV vacuum sanitization", "Clean drinking water test"],
    keywords: ["tank", "water tank", "hydroflow", "pressure pump", "cleaning"]
  },

  // --- SALON AT HOME PROVIDERS ---
  {
    id: 501,
    title: "Glow & Shine Facial + Rica Waxing Combo",
    providerName: "GlowUp Home Salon",
    providerRating: "4.95",
    categoryId: "salon",
    categoryName: "Salon At Home",
    rating: "4.95",
    reviews: "5.2k",
    price: "899",
    oldPrice: "1599",
    badge: "Bestseller Beauty",
    duration: "90 Mins",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80",
    description: "VLCC Diamond facial, painless Rica full arm & leg waxing, plus eyebrow threading.",
    features: ["100% disposable bedsheets & gowns", "Sealed single-use kits", "Top certified beauticians"],
    keywords: ["salon", "glowup", "facial", "waxing", "beauty", "women"]
  },
  {
    id: 502,
    title: "Relaxing Full Body Spa & Head Massage",
    providerName: "GlamourMist Wellness Spa",
    providerRating: "4.9",
    categoryId: "salon",
    categoryName: "Salon At Home",
    rating: "4.9",
    reviews: "2.8k",
    price: "1199",
    oldPrice: "1999",
    badge: "Luxury Spa",
    duration: "75 Mins",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80",
    description: "Aromatherapy warm oil full body massage, foot reflexology & hot towel therapy.",
    features: ["Aromatic essential oils", "Portable massage bed", "Stress relief therapy"],
    keywords: ["spa", "massage", "glamourmist", "head massage", "relax"]
  },
  {
    id: 503,
    title: "Pedicure & Manicure Spa Care",
    providerName: "StyleCraft Nails & Beauty",
    providerRating: "4.85",
    categoryId: "salon",
    categoryName: "Salon At Home",
    rating: "4.85",
    reviews: "1.6k",
    price: "599",
    oldPrice: "999",
    badge: "Nail Care Pro",
    duration: "60 Mins",
    image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=800&auto=format&fit=crop&q=80",
    description: "Dead skin scrubbing, nail shaping, cuticles oil treatment, massage cream & gel nail polish.",
    features: ["Autoclave sterilized tools", "O.P.I nail polishes", "Bubble foot bath"],
    keywords: ["pedicure", "manicure", "stylecraft", "nails", "foot spa"]
  },

  // --- APPLIANCE REPAIR PROVIDERS ---
  {
    id: 601,
    title: "Washing Machine Drum & Motor Repair",
    providerName: "FixIt Appliance Hub",
    providerRating: "4.8",
    categoryId: "appliance",
    categoryName: "Appliance Repair",
    rating: "4.8",
    reviews: "2.3k",
    price: "349",
    oldPrice: "699",
    badge: "Popular Tech",
    duration: "45 Mins",
    image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800&auto=format&fit=crop&q=80",
    description: "Fix front/top load noise, drum spin failure, water inlet valve & drain pump faults.",
    features: ["Original LG/Samsung spares", "Same day visit", "90-day parts warranty"],
    keywords: ["washing machine", "fixit", "drum", "motor", "appliance", "washer"]
  },
  {
    id: 602,
    title: "Double Door Refrigerator Gas & Thermostat Fix",
    providerName: "CoolZone Appliance Solutions",
    providerRating: "4.85",
    categoryId: "appliance",
    categoryName: "Appliance Repair",
    rating: "4.85",
    reviews: "1.9k",
    price: "399",
    oldPrice: "799",
    badge: "Fridge Expert",
    duration: "50 Mins",
    image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&auto=format&fit=crop&q=80",
    description: "Compressor relay replacement, cooling gas refill, defroster timer fix & gasket sealing.",
    features: ["Eco-friendly R600a gas", "Temperature calibration", "Immediate cooling guarantee"],
    keywords: ["refrigerator", "fridge", "coolzone", "cooling", "freezer", "appliance"]
  },
  {
    id: 603,
    title: "Microwave Oven & OTG Heating Repair",
    providerName: "ChefCare Kitchen Tech",
    providerRating: "4.75",
    categoryId: "appliance",
    categoryName: "Appliance Repair",
    rating: "4.75",
    reviews: "920",
    price: "299",
    oldPrice: "549",
    badge: "Kitchen Specialist",
    duration: "35 Mins",
    image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&auto=format&fit=crop&q=80",
    description: "Fix magnetron heating failure, touch panel repair, high voltage transformer & glass turntable replacement.",
    features: ["High voltage tester", "Genuine magnetron spares", "Safe radiation test"],
    keywords: ["microwave", "oven", "chefcare", "heating", "kitchen", "appliance"]
  },

  // --- PAINTING & WATERPROOFING PROVIDERS ---
  {
    id: 701,
    title: "Asian Paints Full Interior Wall Painting",
    providerName: "Asian Paints Certified Pros",
    providerRating: "4.95",
    categoryId: "painting",
    categoryName: "Painting & Waterproofing",
    rating: "4.95",
    reviews: "1.8k",
    price: "2499",
    oldPrice: "3999",
    badge: "Official Certified",
    duration: "2 - 3 Days",
    image: "https://images.unsplash.com/photo-1562259949-e8bd807712a5?w=800&auto=format&fit=crop&q=80",
    description: "Laser room measuring, Royale Luxury Emulsion, dust-free vacuum sanding & furniture masking.",
    features: ["Asian Paints washable paint", "Vacuum sander tool", "Post-paint deep cleaning"],
    keywords: ["painting", "paint", "asian paints", "wall", "color", "interior"]
  },
  {
    id: 702,
    title: "Roof & Terrace Seepage Waterproofing",
    providerName: "WaterShield Waterproofing Co.",
    providerRating: "4.85",
    categoryId: "painting",
    categoryName: "Painting & Waterproofing",
    rating: "4.85",
    reviews: "1.2k",
    price: "1899",
    oldPrice: "2999",
    badge: "Leakproof Warranty",
    duration: "1 - 2 Days",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80",
    description: "Elastomeric liquid membrane coating, crack filling, wall dampness injection & terrace sealing.",
    features: ["Dr. Fixit 3-coat system", "5-year leakproof warranty", "Thermal insulation"],
    keywords: ["waterproofing", "watershield", "seepage", "roof", "terrace", "dampness"]
  },
  {
    id: 703,
    title: "Accent Wall Texture & Designer Stencil",
    providerName: "ColorVibe Artist Painters",
    providerRating: "4.9",
    categoryId: "painting",
    categoryName: "Painting & Waterproofing",
    rating: "4.9",
    reviews: "750",
    price: "1299",
    oldPrice: "1999",
    badge: "Design Artist",
    duration: "1 Day",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80",
    description: "Metallic texture finishes, geometric 3D stencils, velvet touch wall art & feature wall design.",
    features: ["500+ design catalogs", "Italian metallic finishes", "Custom color mixing"],
    keywords: ["texture", "stencil", "colorvibe", "wall art", "painting", "designer"]
  },

  // --- PEST CONTROL PROVIDERS ---
  {
    id: 801,
    title: "Herbal Cockroach & Ant Gel Control",
    providerName: "PestShield India",
    providerRating: "4.9",
    categoryId: "pest",
    categoryName: "Pest Control",
    rating: "4.9",
    reviews: "3.2k",
    price: "599",
    oldPrice: "999",
    badge: "Odorless & Safe",
    duration: "45 Mins",
    image: "https://images.unsplash.com/photo-1615873968403-89e068629265?w=800&auto=format&fit=crop&q=80",
    description: "Odorless Bayer gel dots applied in kitchen cabinets, drain spray & anti-ant barrier.",
    features: ["No need to empty kitchen", "Child & pet safe", "6-month elimination guarantee"],
    keywords: ["pest", "pestshield", "cockroach", "ant", "gel", "spray", "bugs"]
  },
  {
    id: 802,
    title: "Wood Termite Drill & Inject Chemical Barrier",
    providerName: "TermiteBuster Specialists",
    providerRating: "4.85",
    categoryId: "pest",
    categoryName: "Pest Control",
    rating: "4.85",
    reviews: "1.4k",
    price: "1499",
    oldPrice: "2299",
    badge: "1-Yr Warranty",
    duration: "2 Hours",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80",
    description: "Drilling wall-floor junction holes, injecting Premise chemical solution & sealing holes.",
    features: ["Bayer Imidacloprid chemical", "1-year warranty certificate", "Free re-service"],
    keywords: ["termite", "termitebuster", "drill", "wood", "pest control"]
  },
  {
    id: 803,
    title: "Mosquito & Bed Bug Thermal Fogging",
    providerName: "MosquitoFree Solutions",
    providerRating: "4.75",
    categoryId: "pest",
    categoryName: "Pest Control",
    rating: "4.75",
    reviews: "980",
    price: "799",
    oldPrice: "1299",
    badge: "Immediate Result",
    duration: "60 Mins",
    image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&auto=format&fit=crop&q=80",
    description: "Thermal fogging for gardens & balcony, bed bug mattress spray & larva control.",
    features: ["Cold fogging machine", "Destroys eggs & larvae", "Eco-friendly spray"],
    keywords: ["mosquito", "bed bug", "mosquitofree", "fogging", "pest control"]
  },

  // --- CARPENTRY PROVIDERS ---
  {
    id: 901,
    title: "Wooden Door & Lock Repair / Fitting",
    providerName: "WoodCraft Masters",
    providerRating: "4.88",
    categoryId: "carpentry",
    categoryName: "Carpentry",
    rating: "4.88",
    reviews: "2.1k",
    price: "499",
    oldPrice: "799",
    badge: "Master Carpenter",
    duration: "60 Mins",
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&auto=format&fit=crop&q=80",
    description: "Fix swelling wooden doors, Godrej digital lock fitting, hinge replacement & handle repair.",
    features: ["Precision wood planner", "Heavy duty screws & hinges", "Perfect door alignment"],
    keywords: ["carpentry", "woodcraft", "door", "lock", "hinge", "wood"]
  },
  {
    id: 902,
    title: "Modular Kitchen & Wardrobe Cabinet Assembly",
    providerName: "FurnitureFix Assembly Pros",
    providerRating: "4.8",
    categoryId: "carpentry",
    categoryName: "Carpentry",
    rating: "4.8",
    reviews: "1.3k",
    price: "899",
    oldPrice: "1499",
    badge: "IKEA & Custom Pro",
    duration: "2 Hours",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80",
    description: "Assembly of IKEA flatpack furniture, hydraulic bed lift repair, drawer slider fitting.",
    features: ["Cordless power drill", "Soft-close hinge fitting", "Zero scratch handling"],
    keywords: ["furniture", "furniturefix", "wardrobe", "cabinet", "assembly", "ikea"]
  },

  // --- CAR WASH PROVIDERS ---
  {
    id: 1001,
    title: "Doorstep High Pressure Foam Wash & Polish",
    providerName: "AutoSparkle Detailing",
    providerRating: "4.9",
    categoryId: "carwash",
    categoryName: "Car Wash & Detailing",
    rating: "4.9",
    reviews: "2.6k",
    price: "499",
    oldPrice: "799",
    badge: "Top Rated Car Wash",
    duration: "45 Mins",
    image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&auto=format&fit=crop&q=80",
    description: "Pressure water rinse, thick snow foam shampooing, microfiber towel drying & tire shine.",
    features: ["Bring own water & electricity", "Meguiar's car shampoo", "Dashboard polish"],
    keywords: ["car wash", "autosparkle", "foam wash", "car", "detailing", "polish"]
  },
  {
    id: 1002,
    title: "Interior Deep Steam Clean & Upholstery Polish",
    providerName: "DriveClean Detailing Hub",
    providerRating: "4.85",
    categoryId: "carwash",
    categoryName: "Car Wash & Detailing",
    rating: "4.85",
    reviews: "1.4k",
    price: "999",
    oldPrice: "1499",
    badge: "Interior Expert",
    duration: "90 Mins",
    image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&auto=format&fit=crop&q=80",
    description: "High temperature steam sanitization for car seats, roof ceiling cleaning & AC vent deodorization.",
    features: ["140°C steam sterilizer", "Leather conditioner", "Stain extraction"],
    keywords: ["car interior", "driveclean", "steam clean", "car seats", "vacuum"]
  },

  // --- CCTV PROVIDERS ---
  {
    id: 1101,
    title: "Hikvision / CP Plus HD CCTV Camera Setup",
    providerName: "SecureVision Security Tech",
    providerRating: "4.9",
    categoryId: "security",
    categoryName: "CCTV & Security",
    rating: "4.9",
    reviews: "1.1k",
    price: "1299",
    oldPrice: "1899",
    badge: "Certified Tech",
    duration: "2 Hours",
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=80",
    description: "Outdoor night-vision camera mounting, DVR wiring, hard disk recording & mobile live view configuration.",
    features: ["Mobile phone live viewing", "Infrared night vision", "1-year installation warranty"],
    keywords: ["cctv", "securevision", "camera", "dvr", "security", "surveillance"]
  },
  {
    id: 1102,
    title: "Smart Digital Door Lock & Video Doorbell",
    providerName: "SmartLock Home Automation",
    providerRating: "4.85",
    categoryId: "security",
    categoryName: "CCTV & Security",
    rating: "4.85",
    reviews: "820",
    price: "1499",
    oldPrice: "2199",
    badge: "Smart Home Pro",
    duration: "90 Mins",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
    description: "Fingerprint & passcode digital lock installation, wireless video doorbell chime pairing.",
    features: ["Yale / Godrej smart lock pro", "Wi-Fi app pairing", "Emergency key backup"],
    keywords: ["smart lock", "smartlock", "doorbell", "fingerprint", "video door"]
  },

  // --- GARDENING PROVIDERS ---
  {
    id: 1201,
    title: "Lawn Mowing & Shrub Hedge Trimming",
    providerName: "GreenThumb Gardeners",
    providerRating: "4.85",
    categoryId: "gardening",
    categoryName: "Gardening & Lawn",
    rating: "4.85",
    reviews: "910",
    price: "799",
    oldPrice: "1199",
    badge: "Lawn Specialist",
    duration: "2 Hours",
    image: "https://images.unsplash.com/photo-1558904541-efa8c196b27d?w=800&auto=format&fit=crop&q=80",
    description: "Gasoline lawn mower grass cutting, hedge shaping, weeding, and garden green waste cleanup.",
    features: ["Heavy duty lawn mower", "Organic vermicompost fertilizer", "Neat hedge shaping"],
    keywords: ["gardening", "greenthumb", "lawn", "mowing", "grass", "plants"]
  },

  // --- SOLAR PROVIDERS ---
  {
    id: 1301,
    title: "Rooftop Solar Panel Cleaning & Efficiency Check",
    providerName: "SolarSun Energy Care",
    providerRating: "4.92",
    categoryId: "solar",
    categoryName: "Solar & Inverter",
    rating: "4.92",
    reviews: "780",
    price: "899",
    oldPrice: "1399",
    badge: "Solar Certified",
    duration: "90 Mins",
    image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80",
    description: "Soft brush de-ionized water washing for rooftop panels, inverter efficiency audit & battery water refill.",
    features: ["Non-scratch solar squeegee", "Voltage & current test", "+25% efficiency boost"],
    keywords: ["solar", "solarsun", "inverter", "battery", "panel", "sun"]
  },

  // --- PACKERS & MOVERS PROVIDERS ---
  {
    id: 1401,
    title: "Intercity House Relocation & 3-Layer Packing",
    providerName: "SwiftShift Packers & Logistics",
    providerRating: "4.9",
    categoryId: "movers",
    categoryName: "Packers & Movers",
    rating: "4.9",
    reviews: "3.8k",
    price: "3499",
    oldPrice: "4999",
    badge: "Verified Relocation",
    duration: "Full Day",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
    description: "Multi-layer bubble wrapping for TV, fridge, furniture dismantling, enclosed container truck transport.",
    features: ["3-layer heavy bubble wrap", "Transit damage insurance", "Dedicated supervisor"],
    keywords: ["packers", "movers", "swiftshift", "shifting", "relocation", "truck"]
  },
  {
    id: 1402,
    title: "Local Apartment Moving & Heavy Lifting",
    providerName: "SafeMove Express Movers",
    providerRating: "4.8",
    categoryId: "movers",
    categoryName: "Packers & Movers",
    rating: "4.8",
    reviews: "1.9k",
    price: "1999",
    oldPrice: "2999",
    badge: "Same-City Moving",
    duration: "4 - 5 Hours",
    image: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&auto=format&fit=crop&q=80",
    description: "Local city shifting, sofa & bed disassembly, elevator/stair loading & unpacking.",
    features: ["Heavy lifting straps", "Covered 14ft container vehicle", "Unpacking assistance"],
    keywords: ["movers", "safemove", "local shifting", "apartment", "boxes"]
  }
];

export default function ServicesPage() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedService, setSelectedService] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const resultsRef = useRef(null);

  useEffect(() => {
    const urlQuery = searchParams.get("search");
    if (urlQuery) {
      setSearchQuery(urlQuery);
      setSelectedCategoryId("all");
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [searchParams]);

  const toggleFavorite = (e, serviceId) => {
    e.stopPropagation();
    if (favorites.includes(serviceId)) {
      setFavorites(favorites.filter((id) => id !== serviceId));
    } else {
      setFavorites([...favorites, serviceId]);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() !== "") {
      setSelectedCategoryId("all");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    resultsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setSearchQuery("");
    resultsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredServices = SERVICES_DATA.filter((service) => {
    const query = searchQuery.trim().toLowerCase();

    const matchesSearch =
      !query ||
      service.title.toLowerCase().includes(query) ||
      service.categoryName.toLowerCase().includes(query) ||
      service.providerName.toLowerCase().includes(query) ||
      service.description.toLowerCase().includes(query) ||
      service.keywords.some((kw) => kw.toLowerCase().includes(query));

    const matchesCategory =
      selectedCategoryId === "all" || service.categoryId === selectedCategoryId;

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="services-page-container">
      <Navbar />

      {/* Hero Banner Section */}
      <section className="services-page-hero">
        <div className="services-hero-glow"></div>
        <div className="services-hero-content">
          <span className="hero-pill-badge">✨ Multi-Provider Service Marketplace</span>
          <h1>
            Compare & Book Top <span>Service Providers</span>
          </h1>
          <p>
            Choose from multiple background-verified service companies & independent specialists for every category.
          </p>

          <form className="search-box premium-search-box" onSubmit={handleSearchSubmit}>
            <FaSearch className="search-icon-svg" />
            <input
              type="text"
              placeholder="Search Provider, AC Repair, Cleaning, Plumbing, Electrician..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button type="submit" className="search-action-btn">
              Search
            </button>
          </form>

          {/* Quick Tag Pills */}
          <div className="popular-tags">
            <span className="tags-label">Popular Categories:</span>
            {CATEGORIES_DATA.slice(1, 7).map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`tag-pill ${selectedCategoryId === cat.id ? "active-tag" : ""}`}
                onClick={() => handleCategorySelect(cat.id)}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Counter Banner */}
      <div className="stats-banner">
        <div className="stat-item">
          <h3>150+</h3>
          <p>Verified Providers</p>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <h3>14</h3>
          <p>Service Categories</p>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <h3>4.9 ★</h3>
          <p>Average Rating</p>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <h3>100%</h3>
          <p>Price Transparency</p>
        </div>
      </div>

      {/* Categories Grid Section */}
      <section className="categories services-categories-section">
        <div className="section-header-center">
          <span className="section-subtitle">Service Categories</span>
          <h2>Explore By Categories</h2>
          <p>Select any category below to view multiple competitive providers & packages</p>
        </div>

        <div className="category-grid">
          {CATEGORIES_DATA.map((category) => {
            const providerCount = SERVICES_DATA.filter(
              (s) => category.id === "all" || s.categoryId === category.id
            ).length;

            return (
              <div
                key={category.id}
                className={`category-card ${
                  selectedCategoryId === category.id ? "selected-category-card" : ""
                }`}
                onClick={() => handleCategorySelect(category.id)}
              >
                <div className="category-icon">{category.icon}</div>
                <h3>{category.title}</h3>
                <p>{category.description}</p>
                <div className="provider-count-badge">
                  <FaStore /> {providerCount} {providerCount === 1 ? "Option" : "Providers"}
                </div>
                <button type="button" className="category-explore-btn">
                  {selectedCategoryId === category.id ? "Selected" : "View Options"}
                  <FaArrowRight />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Services List Section */}
      <section className="popular-services services-list-section" ref={resultsRef}>
        <div className="section-results-header">
          <div>
            <h2>
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : selectedCategoryId === "all"
                ? "All Available Providers & Services"
                : `${CATEGORIES_DATA.find((c) => c.id === selectedCategoryId)?.title || "Services"}`}
            </h2>
            <p className="results-subtext">
              Showing {filteredServices.length} service {filteredServices.length === 1 ? "option" : "options"} from verified providers
            </p>
          </div>

          {searchQuery && (
            <button
              type="button"
              className="clear-search-link"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategoryId("all");
              }}
            >
              ✕ Clear Search
            </button>
          )}
        </div>

        {filteredServices.length > 0 ? (
          <div className="service-grid">
            {filteredServices.map((service) => (
              <div key={service.id} className="service-card attractive-card">
                <div className="card-media-header">
                  <img src={service.image} alt={service.title} />
                  <div className="card-badges-row">
                    <span className="service-badge-pill">{service.badge}</span>
                    <button
                      type="button"
                      className="fav-heart-btn"
                      onClick={(e) => toggleFavorite(e, service.id)}
                    >
                      {favorites.includes(service.id) ? (
                        <FaHeart style={{ color: "#ff4757" }} />
                      ) : (
                        <FaRegHeart />
                      )}
                    </button>
                  </div>
                  <span className="card-time-tag">
                    <FaClock /> {service.duration}
                  </span>
                </div>

                <div className="service-content">
                  {/* Provider Header Pill */}
                  <div className="provider-info-tag">
                    <FaUserCheck className="provider-check-icon" />
                    <span>Provided by <strong>{service.providerName}</strong></span>
                  </div>

                  <h3>{service.title}</h3>

                  <div className="service-rating-row">
                    <span className="rating-star">
                      <FaStar /> {service.rating}
                    </span>
                    <span className="rating-count">({service.reviews} bookings)</span>
                  </div>

                  <ul className="service-features-list">
                    {service.features.map((feat, idx) => (
                      <li key={idx}>
                        <FaCheckCircle className="check-icon" /> {feat}
                      </li>
                    ))}
                  </ul>

                  <div className="service-pricing-row">
                    <div className="price-container">
                      <span className="price-amount">₹{service.price}</span>
                      {service.oldPrice && (
                        <span className="old-price-amount">₹{service.oldPrice}</span>
                      )}
                    </div>

                    <button
                      type="button"
                      className="book-now-btn"
                      onClick={() => setSelectedService(service)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-services-notice">
            <div className="no-results-icon">🔎</div>
            <h3>No service providers found matching "{searchQuery}"</h3>
            <p>Try searching for terms like "CoolCare", "SparkleClean", "Asian Paints", "VoltMaster", or "AquaFix".</p>
            <button
              type="button"
              className="reset-btn"
              onClick={() => {
                setSelectedCategoryId("all");
                setSearchQuery("");
              }}
            >
              View All Providers
            </button>
          </div>
        )}
      </section>

      {/* Booking Modal */}
      {selectedService && (
        <div className="booking-modal-overlay" onClick={() => setSelectedService(null)}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="close-modal-btn"
              onClick={() => setSelectedService(null)}
            >
              ✕
            </button>

            <div className="modal-top-media">
              <img src={selectedService.image} alt={selectedService.title} />
              <span className="modal-badge">{selectedService.badge}</span>
            </div>

            <div className="modal-header">
              <div className="modal-provider-header">
                <FaUserCheck className="provider-check-icon" />
                <span>Offered by <strong>{selectedService.providerName}</strong></span>
              </div>
              <h2>{selectedService.title}</h2>
              <div className="modal-price-rating-row">
                <span className="modal-price">₹{selectedService.price}</span>
                {selectedService.oldPrice && (
                  <span className="modal-old-price">₹{selectedService.oldPrice}</span>
                )}
                <span className="modal-rating">⭐ {selectedService.rating} ({selectedService.reviews})</span>
              </div>
            </div>

            <div className="modal-body">
              <p className="modal-desc">{selectedService.description}</p>

              <h4>What's Included:</h4>
              <ul className="modal-features-list">
                {selectedService.features.map((feat, idx) => (
                  <li key={idx}>
                    <FaCheckCircle className="check-icon" /> {feat}
                  </li>
                ))}
              </ul>

              <div className="modal-guarantee-note">
                <p>🛡️ Service delivered by <strong>{selectedService.providerName}</strong> under FlexServ 30-Day Partner Guarantee.</p>
              </div>

              <a href="/login" className="modal-confirm-btn">
                Book with {selectedService.providerName}
              </a>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
