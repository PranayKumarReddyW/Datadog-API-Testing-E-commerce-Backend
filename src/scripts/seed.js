require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Product = require("../models/Product");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const users = [
  {
    name: "Admin User",
    email: "admin@test.com",
    password: "Admin@123",
    role: "admin",
    phone: "1234567890",
    address: {
      street: "123 Admin Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
  },
  {
    name: "John Doe",
    email: "john@test.com",
    password: "Test@123",
    role: "user",
    phone: "9876543210",
  },
  {
    name: "Jane Smith",
    email: "jane@test.com",
    password: "Test@123",
    role: "user",
    phone: "9876543211",
  },
  {
    name: "Bob Johnson",
    email: "bob@test.com",
    password: "Test@123",
    role: "user",
    phone: "9876543212",
  },
  {
    name: "Alice Williams",
    email: "alice@test.com",
    password: "Test@123",
    role: "user",
    phone: "9876543213",
  },
  {
    name: "Charlie Brown",
    email: "charlie@test.com",
    password: "Test@123",
    role: "user",
    phone: "9876543214",
  },
  {
    name: "Diana Prince",
    email: "diana@test.com",
    password: "Test@123",
    role: "user",
    phone: "9876543215",
  },
  {
    name: "Eve Davis",
    email: "eve@test.com",
    password: "Test@123",
    role: "user",
    phone: "9876543216",
  },
  {
    name: "Frank Miller",
    email: "frank@test.com",
    password: "Test@123",
    role: "user",
    phone: "9876543217",
  },
  {
    name: "Grace Lee",
    email: "grace@test.com",
    password: "Test@123",
    role: "user",
    phone: "9876543218",
  },
];

const products = [
  // Electronics
  {
    name: "iPhone 15 Pro",
    description:
      "Latest Apple smartphone with A17 Pro chip and titanium design",
    price: 999.99,
    category: "Electronics",
    stock: 50,
    brand: "Apple",
    imageUrl: "https://example.com/iphone15.jpg",
  },
  {
    name: "Samsung Galaxy S24",
    description: "Premium Android smartphone with AI features",
    price: 899.99,
    category: "Electronics",
    stock: 45,
    brand: "Samsung",
    imageUrl: "https://example.com/galaxy-s24.jpg",
  },
  {
    name: 'MacBook Pro 16"',
    description: "Powerful laptop with M3 Max chip",
    price: 2499.99,
    category: "Electronics",
    stock: 30,
    brand: "Apple",
    imageUrl: "https://example.com/macbook.jpg",
  },
  {
    name: "Dell XPS 15",
    description: "High-performance Windows laptop",
    price: 1799.99,
    category: "Electronics",
    stock: 25,
    brand: "Dell",
    imageUrl: "https://example.com/dell-xps.jpg",
  },
  {
    name: "Sony WH-1000XM5",
    description: "Premium noise-canceling headphones",
    price: 399.99,
    category: "Electronics",
    stock: 60,
    brand: "Sony",
    imageUrl: "https://example.com/sony-headphones.jpg",
  },
  {
    name: "iPad Air",
    description: "Versatile tablet with M1 chip",
    price: 599.99,
    category: "Electronics",
    stock: 40,
    brand: "Apple",
    imageUrl: "https://example.com/ipad-air.jpg",
  },
  {
    name: 'LG OLED TV 55"',
    description: "4K OLED Smart TV with stunning picture quality",
    price: 1499.99,
    category: "Electronics",
    stock: 20,
    brand: "LG",
    imageUrl: "https://example.com/lg-tv.jpg",
  },
  {
    name: "PlayStation 5",
    description: "Next-gen gaming console",
    price: 499.99,
    category: "Electronics",
    stock: 35,
    brand: "Sony",
    imageUrl: "https://example.com/ps5.jpg",
  },
  {
    name: "Nintendo Switch OLED",
    description: "Portable gaming console with vibrant display",
    price: 349.99,
    category: "Electronics",
    stock: 55,
    brand: "Nintendo",
    imageUrl: "https://example.com/switch.jpg",
  },
  {
    name: "Canon EOS R6",
    description: "Professional mirrorless camera",
    price: 2499.99,
    category: "Electronics",
    stock: 15,
    brand: "Canon",
    imageUrl: "https://example.com/canon-r6.jpg",
  },

  // Clothing
  {
    name: "Levi's 501 Jeans",
    description: "Classic straight-fit denim jeans",
    price: 89.99,
    category: "Clothing",
    stock: 100,
    brand: "Levi's",
    imageUrl: "https://example.com/levis-jeans.jpg",
  },
  {
    name: "Nike Air Max Sneakers",
    description: "Comfortable running shoes with air cushioning",
    price: 129.99,
    category: "Clothing",
    stock: 80,
    brand: "Nike",
    imageUrl: "https://example.com/nike-airmax.jpg",
  },
  {
    name: "Adidas Ultraboost",
    description: "Premium running shoes with boost technology",
    price: 179.99,
    category: "Clothing",
    stock: 70,
    brand: "Adidas",
    imageUrl: "https://example.com/ultraboost.jpg",
  },
  {
    name: "North Face Jacket",
    description: "Waterproof outdoor jacket",
    price: 249.99,
    category: "Clothing",
    stock: 50,
    brand: "The North Face",
    imageUrl: "https://example.com/northface.jpg",
  },
  {
    name: "Ralph Lauren Polo Shirt",
    description: "Classic cotton polo shirt",
    price: 79.99,
    category: "Clothing",
    stock: 90,
    brand: "Ralph Lauren",
    imageUrl: "https://example.com/polo.jpg",
  },

  // Books
  {
    name: "Atomic Habits",
    description: "Practical guide to building good habits by James Clear",
    price: 16.99,
    category: "Books",
    stock: 200,
    brand: "",
    imageUrl: "https://example.com/atomic-habits.jpg",
  },
  {
    name: "The Psychology of Money",
    description: "Timeless lessons on wealth by Morgan Housel",
    price: 14.99,
    category: "Books",
    stock: 150,
    brand: "",
    imageUrl: "https://example.com/psychology-money.jpg",
  },
  {
    name: "Sapiens",
    description: "A brief history of humankind by Yuval Noah Harari",
    price: 18.99,
    category: "Books",
    stock: 120,
    brand: "",
    imageUrl: "https://example.com/sapiens.jpg",
  },
  {
    name: "Educated",
    description: "A memoir by Tara Westover",
    price: 15.99,
    category: "Books",
    stock: 100,
    brand: "",
    imageUrl: "https://example.com/educated.jpg",
  },
  {
    name: "Clean Code",
    description: "A handbook of agile software craftsmanship",
    price: 39.99,
    category: "Books",
    stock: 80,
    brand: "",
    imageUrl: "https://example.com/clean-code.jpg",
  },

  // Home & Kitchen
  {
    name: "Instant Pot Duo",
    description: "7-in-1 electric pressure cooker",
    price: 99.99,
    category: "Home & Kitchen",
    stock: 60,
    brand: "Instant Pot",
    imageUrl: "https://example.com/instant-pot.jpg",
  },
  {
    name: "Dyson V15 Vacuum",
    description: "Cordless vacuum cleaner with laser detection",
    price: 649.99,
    category: "Home & Kitchen",
    stock: 30,
    brand: "Dyson",
    imageUrl: "https://example.com/dyson-v15.jpg",
  },
  {
    name: "KitchenAid Stand Mixer",
    description: "Professional 5-quart stand mixer",
    price: 379.99,
    category: "Home & Kitchen",
    stock: 40,
    brand: "KitchenAid",
    imageUrl: "https://example.com/kitchenaid.jpg",
  },
  {
    name: "Nespresso Coffee Maker",
    description: "Espresso and coffee machine",
    price: 199.99,
    category: "Home & Kitchen",
    stock: 50,
    brand: "Nespresso",
    imageUrl: "https://example.com/nespresso.jpg",
  },
  {
    name: "Air Fryer XL",
    description: "Large capacity oil-free fryer",
    price: 129.99,
    category: "Home & Kitchen",
    stock: 70,
    brand: "Philips",
    imageUrl: "https://example.com/airfryer.jpg",
  },

  // Sports
  {
    name: "Yoga Mat Premium",
    description: "Extra thick exercise mat with carrying strap",
    price: 39.99,
    category: "Sports",
    stock: 100,
    brand: "Gaiam",
    imageUrl: "https://example.com/yoga-mat.jpg",
  },
  {
    name: "Dumbbells Set",
    description: "Adjustable weight dumbbells 5-52.5 lbs",
    price: 299.99,
    category: "Sports",
    stock: 40,
    brand: "Bowflex",
    imageUrl: "https://example.com/dumbbells.jpg",
  },
  {
    name: "Treadmill Pro",
    description: "Folding treadmill with LCD display",
    price: 799.99,
    category: "Sports",
    stock: 20,
    brand: "NordicTrack",
    imageUrl: "https://example.com/treadmill.jpg",
  },
  {
    name: "Wilson Tennis Racket",
    description: "Professional tennis racket",
    price: 189.99,
    category: "Sports",
    stock: 35,
    brand: "Wilson",
    imageUrl: "https://example.com/tennis-racket.jpg",
  },
  {
    name: "Basketball Official Size",
    description: "NBA official game basketball",
    price: 49.99,
    category: "Sports",
    stock: 60,
    brand: "Spalding",
    imageUrl: "https://example.com/basketball.jpg",
  },

  // Toys
  {
    name: "LEGO Star Wars Set",
    description: "Millennium Falcon building set",
    price: 159.99,
    category: "Toys",
    stock: 45,
    brand: "LEGO",
    imageUrl: "https://example.com/lego-starwars.jpg",
  },
  {
    name: "Barbie Dream House",
    description: "Large dollhouse with furniture",
    price: 199.99,
    category: "Toys",
    stock: 30,
    brand: "Barbie",
    imageUrl: "https://example.com/barbie-house.jpg",
  },
  {
    name: "Hot Wheels Track Set",
    description: "Racing track with loop and launcher",
    price: 49.99,
    category: "Toys",
    stock: 70,
    brand: "Hot Wheels",
    imageUrl: "https://example.com/hotwheels.jpg",
  },
  {
    name: "Nintendo Mario Kart",
    description: "Racing game for Nintendo Switch",
    price: 59.99,
    category: "Toys",
    stock: 80,
    brand: "Nintendo",
    imageUrl: "https://example.com/mario-kart.jpg",
  },
  {
    name: "Nerf Elite Blaster",
    description: "Foam dart blaster with targets",
    price: 34.99,
    category: "Toys",
    stock: 90,
    brand: "Nerf",
    imageUrl: "https://example.com/nerf.jpg",
  },

  // Beauty
  {
    name: "Dyson Airwrap",
    description: "Multi-styler for hair styling",
    price: 599.99,
    category: "Beauty",
    stock: 25,
    brand: "Dyson",
    imageUrl: "https://example.com/airwrap.jpg",
  },
  {
    name: "La Mer Moisturizer",
    description: "Luxury face moisturizing cream",
    price: 180.0,
    category: "Beauty",
    stock: 40,
    brand: "La Mer",
    imageUrl: "https://example.com/lamer.jpg",
  },
  {
    name: "Fenty Beauty Foundation",
    description: "Pro Filt'r foundation with wide shade range",
    price: 39.0,
    category: "Beauty",
    stock: 100,
    brand: "Fenty",
    imageUrl: "https://example.com/fenty.jpg",
  },
  {
    name: "Olaplex Hair Treatment",
    description: "Bond building hair treatment",
    price: 28.0,
    category: "Beauty",
    stock: 80,
    brand: "Olaplex",
    imageUrl: "https://example.com/olaplex.jpg",
  },
  {
    name: "Urban Decay Palette",
    description: "Naked eyeshadow palette",
    price: 54.0,
    category: "Beauty",
    stock: 60,
    brand: "Urban Decay",
    imageUrl: "https://example.com/urbandecay.jpg",
  },

  // Automotive
  {
    name: "Michelin Tires Set",
    description: "All-season performance tires",
    price: 599.99,
    category: "Automotive",
    stock: 30,
    brand: "Michelin",
    imageUrl: "https://example.com/michelin.jpg",
  },
  {
    name: "Garmin Dash Cam",
    description: "4K dash camera with GPS",
    price: 249.99,
    category: "Automotive",
    stock: 40,
    brand: "Garmin",
    imageUrl: "https://example.com/dashcam.jpg",
  },
  {
    name: "Car Vacuum Cleaner",
    description: "Portable handheld car vacuum",
    price: 49.99,
    category: "Automotive",
    stock: 70,
    brand: "Black+Decker",
    imageUrl: "https://example.com/car-vacuum.jpg",
  },
  {
    name: "Jump Starter Power Bank",
    description: "Portable battery jump starter",
    price: 89.99,
    category: "Automotive",
    stock: 50,
    brand: "NOCO",
    imageUrl: "https://example.com/jumpstarter.jpg",
  },
  {
    name: "Car Phone Mount",
    description: "Magnetic phone holder for car",
    price: 19.99,
    category: "Automotive",
    stock: 120,
    brand: "iOttie",
    imageUrl: "https://example.com/phone-mount.jpg",
  },

  // Food & Beverages
  {
    name: "Organic Green Tea",
    description: "Premium loose leaf green tea",
    price: 24.99,
    category: "Food & Beverages",
    stock: 100,
    brand: "Teavana",
    imageUrl: "https://example.com/green-tea.jpg",
  },
  {
    name: "Protein Powder Chocolate",
    description: "Whey protein isolate 5lbs",
    price: 59.99,
    category: "Food & Beverages",
    stock: 80,
    brand: "Optimum Nutrition",
    imageUrl: "https://example.com/protein.jpg",
  },
  {
    name: "Extra Virgin Olive Oil",
    description: "Cold-pressed Italian olive oil",
    price: 34.99,
    category: "Food & Beverages",
    stock: 60,
    brand: "Colavita",
    imageUrl: "https://example.com/olive-oil.jpg",
  },
  {
    name: "Manuka Honey",
    description: "Raw Manuka honey MGO 550+",
    price: 49.99,
    category: "Food & Beverages",
    stock: 40,
    brand: "Manuka Health",
    imageUrl: "https://example.com/honey.jpg",
  },
  {
    name: "Dark Chocolate Bar",
    description: "85% cacao dark chocolate",
    price: 4.99,
    category: "Food & Beverages",
    stock: 200,
    brand: "Lindt",
    imageUrl: "https://example.com/chocolate.jpg",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Product.deleteMany({});

    // Insert users
    console.log("Creating users...");
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users created`);

    // Get admin user ID
    const adminUser = createdUsers.find((user) => user.role === "admin");

    // Add createdBy to products
    const productsWithCreator = products.map((product) => ({
      ...product,
      createdBy: adminUser._id,
    }));

    // Insert products
    console.log("Creating products...");
    const createdProducts = await Product.insertMany(productsWithCreator);
    console.log(`${createdProducts.length} products created`);

    console.log("✅ Database seeded successfully!");
    console.log("\n--- Test Credentials ---");
    console.log("Admin:");
    console.log("  Email: admin@test.com");
    console.log("  Password: Admin@123");
    console.log("\nRegular User:");
    console.log("  Email: john@test.com");
    console.log("  Password: Test@123");
    console.log("------------------------\n");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
