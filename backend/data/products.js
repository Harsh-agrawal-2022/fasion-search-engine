const Products=[
  {
    "name": "Classic Denim Jacket",
    "brand": "Urban Threads",
    "category": "Jackets",
    "price": 89.99,
    "colors": ["Blue", "Black"],
    "availableSizes": ["S", "M", "L", "XL"],
    "description": "A timeless denim jacket, perfect for any season. Made with 100% organic cotton.",
    "imageUrl": "https://placehold.co/600x400/3B82F6/FFFFFF?text=Denim+Jacket"
  },
  {
    "name": "Floral Sundress",
    "brand": "Summer Bloom",
    "category": "Dresses",
    "price": 59.50,
    "colors": ["White", "Pink", "Yellow"],
    "availableSizes": ["XS", "S", "M"],
    "description": "Light and airy sundress with a beautiful floral pattern. Ideal for warm summer days.",
    "imageUrl": "https://placehold.co/600x400/F472B6/FFFFFF?text=Sundress"
  },
  {
    "name": "High-Waisted Skinny Jeans",
    "brand": "Denim Co.",
    "category": "Jeans",
    "price": 75.00,
    "colors": ["Dark Blue", "Black", "Light Blue"],
    "availableSizes": ["S", "M", "L"],
    "description": "Flattering high-waisted skinny jeans that hug your curves in all the right places.",
    "imageUrl": "https://placehold.co/600x400/1E40AF/FFFFFF?text=Skinny+Jeans"
  },
  {
    "name": "Striped Linen Shirt",
    "brand": "Coastal Living",
    "category": "Tops",
    "price": 45.99,
    "colors": ["White", "Blue"],
    "availableSizes": ["M", "L", "XL"],
    "description": "A breathable linen shirt with classic vertical stripes. Perfect for a casual, beachy look.",
    "imageUrl": "https://placehold.co/600x400/60A5FA/FFFFFF?text=Linen+Shirt"
  },
  {
    "name": "Leather Crossbody Bag",
    "brand": "Artisan Bags",
    "category": "Accessories",
    "price": 120.00,
    "colors": ["Brown", "Black"],
    "availableSizes": ["One Size"],
    "description": "Handcrafted genuine leather crossbody bag with multiple compartments.",
    "imageUrl": "https://placehold.co/600x400/A16207/FFFFFF?text=Leather+Bag"
  },
  {
    "name": "V-Neck Cashmere Sweater",
    "brand": "Luxe Knits",
    "category": "Sweaters",
    "price": 150.00,
    "colors": ["Gray", "Beige", "Navy"],
    "availableSizes": ["S", "M", "L"],
    "description": "Incredibly soft and luxurious 100% cashmere sweater.",
    "imageUrl": "https://placehold.co/600x400/9CA3AF/FFFFFF?text=Cashmere+Sweater"
  },
  {
    "name": "Pleated Midi Skirt",
    "brand": "Chic & Co.",
    "category": "Skirts",
    "price": 65.00,
    "colors": ["Pink", "Black", "Green"],
    "availableSizes": ["S", "M", "L"],
    "description": "Elegant pleated midi skirt that flows beautifully with every step.",
    "imageUrl": "https://placehold.co/600x400/EC4899/FFFFFF?text=Midi+Skirt"
  },
  {
    "name": "Graphic T-Shirt",
    "brand": "Urban Threads",
    "category": "Tops",
    "price": 29.99,
    "colors": ["White", "Black", "Gray"],
    "availableSizes": ["S", "M", "L", "XL", "XXL"],
    "description": "Comfortable cotton t-shirt with a unique graphic print.",
    "imageUrl": "https://placehold.co/600x400/F3F4F6/000000?text=Graphic+Tee"
  },
  {
    "name": "Tailored Wool Blazer",
    "brand": "Modern Executive",
    "category": "Jackets",
    "price": 199.99,
    "colors": ["Charcoal", "Navy"],
    "availableSizes": ["S", "M", "L"],
    "description": "A sharp, tailored blazer made from premium wool. A staple for any professional wardrobe.",
    "imageUrl": "https://placehold.co/600x400/4B5563/FFFFFF?text=Blazer"
  },
  {
    "name": "Athletic Joggers",
    "brand": "FitFlex",
    "category": "Pants",
    "price": 55.00,
    "colors": ["Black", "Gray", "Olive"],
    "availableSizes": ["S", "M", "L", "XL"],
    "description": "Comfortable and stylish joggers for the gym or lounging.",
    "imageUrl": "https://placehold.co/600x400/1F2937/FFFFFF?text=Joggers"
  },
  {
    "name": "Silk Camisole",
    "brand": "Luxe Knits",
    "category": "Tops",
    "price": 49.90,
    "colors": ["Champagne", "Black", "Ivory"],
    "availableSizes": ["XS", "S", "M"],
    "description": "A delicate and versatile silk camisole, perfect for layering.",
    "imageUrl": "https://placehold.co/600x400/F5E8DD/000000?text=Silk+Cami"
  },
  {
    "name": "Bohemian Maxi Dress",
    "brand": "Summer Bloom",
    "category": "Dresses",
    "price": 88.00,
    "colors": ["Red", "Orange", "Turquoise"],
    "availableSizes": ["S", "M", "L"],
    "description": "A flowing maxi dress with a vibrant bohemian print.",
    "imageUrl": "https://placehold.co/600x400/EF4444/FFFFFF?text=Maxi+Dress"
  },
  {
    "name": "Distressed Boyfriend Jeans",
    "brand": "Denim Co.",
    "category": "Jeans",
    "price": 80.00,
    "colors": ["Light Blue"],
    "availableSizes": ["S", "M", "L", "XL"],
    "description": "Relaxed fit boyfriend jeans with stylish distressing.",
    "imageUrl": "https://placehold.co/600x400/93C5FD/FFFFFF?text=Boyfriend+Jeans"
  },
  {
    "name": "Turtleneck Sweater",
    "brand": "Luxe Knits",
    "category": "Sweaters",
    "price": 95.00,
    "colors": ["Black", "Cream", "Burgundy"],
    "availableSizes": ["S", "M", "L"],
    "description": "A cozy and chic turtleneck sweater made from a soft wool blend.",
    "imageUrl": "https://placehold.co/600x400/881337/FFFFFF?text=Turtleneck"
  },
  {
    "name": "Canvas Tote Bag",
    "brand": "Coastal Living",
    "category": "Accessories",
    "price": 35.00,
    "colors": ["Natural", "Navy"],
    "availableSizes": ["One Size"],
    "description": "A durable and spacious canvas tote, perfect for everyday use.",
    "imageUrl": "https://placehold.co/600x400/E5E7EB/000000?text=Tote+Bag"
  },
  {
    "name": "Satin Slip Dress",
    "brand": "Chic & Co.",
    "category": "Dresses",
    "price": 99.99,
    "colors": ["Emerald", "Silver", "Black"],
    "availableSizes": ["XS", "S", "M"],
    "description": "A luxurious satin slip dress for special occasions.",
    "imageUrl": "https://placehold.co/600x400/059669/FFFFFF?text=Slip+Dress"
  },
  {
    "name": "Cropped Hoodie",
    "brand": "Urban Threads",
    "category": "Tops",
    "price": 49.99,
    "colors": ["Pink", "Gray", "White"],
    "availableSizes": ["S", "M", "L"],
    "description": "A trendy cropped hoodie in a soft fleece material.",
    "imageUrl": "https://placehold.co/600x400/D946EF/FFFFFF?text=Cropped+Hoodie"
  },
  {
    "name": "Wide-Leg Trousers",
    "brand": "Modern Executive",
    "category": "Pants",
    "price": 85.00,
    "colors": ["Beige", "Black"],
    "availableSizes": ["S", "M", "L", "XL"],
    "description": "Elegant wide-leg trousers that offer both comfort and style.",
    "imageUrl": "https://placehold.co/600x400/D2B48C/FFFFFF?text=Trousers"
  },
  {
    "name": "Chunky Knit Cardigan",
    "brand": "Luxe Knits",
    "category": "Sweaters",
    "price": 110.00,
    "colors": ["Cream", "Gray"],
    "availableSizes": ["One Size"],
    "description": "An oversized, chunky knit cardigan to keep you warm and stylish.",
    "imageUrl": "https://placehold.co/600x400/D1D5DB/000000?text=Cardigan"
  },
  {
    "name": "Denim Mini Skirt",
    "brand": "Denim Co.",
    "category": "Skirts",
    "price": 49.50,
    "colors": ["Blue", "Black", "White"],
    "availableSizes": ["XS", "S", "M", "L"],
    "description": "A classic A-line denim mini skirt.",
    "imageUrl": "https://placehold.co/600x400/2563EB/FFFFFF?text=Denim+Skirt"
  },
  {
    "name": "Puffer Vest",
    "brand": "FitFlex",
    "category": "Jackets",
    "price": 70.00,
    "colors": ["Black", "Red", "Silver"],
    "availableSizes": ["S", "M", "L"],
    "description": "A lightweight but warm puffer vest, perfect for layering.",
    "imageUrl": "https://placehold.co/600x400/DC2626/FFFFFF?text=Puffer+Vest"
  },
  {
    "name": "Ruffle Blouse",
    "brand": "Chic & Co.",
    "category": "Tops",
    "price": 55.00,
    "colors": ["White", "Lavender"],
    "availableSizes": ["S", "M", "L"],
    "description": "A romantic blouse with delicate ruffle details.",
    "imageUrl": "https://placehold.co/600x400/C4B5FD/000000?text=Ruffle+Blouse"
  },
  {
    "name": "Leather Leggings",
    "brand": "Urban Threads",
    "category": "Pants",
    "price": 60.00,
    "colors": ["Black"],
    "availableSizes": ["S", "M", "L"],
    "description": "Sleek and edgy faux leather leggings.",
    "imageUrl": "https://placehold.co/600x400/111827/FFFFFF?text=Leather+Leggings"
  },
  {
    "name": "Fedora Hat",
    "brand": "Artisan Bags",
    "category": "Accessories",
    "price": 40.00,
    "colors": ["Brown", "Gray"],
    "availableSizes": ["S/M", "L/XL"],
    "description": "A stylish wool felt fedora hat.",
    "imageUrl": "https://placehold.co/600x400/78716C/FFFFFF?text=Fedora"
  },
  {
    "name": "Wrap Dress",
    "brand": "Summer Bloom",
    "category": "Dresses",
    "price": 78.00,
    "colors": ["Navy", "Green", "Red"],
    "availableSizes": ["S", "M", "L", "XL"],
    "description": "A universally flattering wrap dress in a soft jersey fabric.",
    "imageUrl": "https://placehold.co/600x400/1E3A8A/FFFFFF?text=Wrap+Dress"
  },
  {
    "name": "Cargo Pants",
    "brand": "Urban Threads",
    "category": "Pants",
    "price": 68.00,
    "colors": ["Khaki", "Olive", "Black"],
    "availableSizes": ["S", "M", "L"],
    "description": "Utilitarian-chic cargo pants with multiple pockets.",
    "imageUrl": "https://placehold.co/600x400/57534E/FFFFFF?text=Cargo+Pants"
  },
  {
    "name": "Off-Shoulder Top",
    "brand": "Summer Bloom",
    "category": "Tops",
    "price": 39.99,
    "colors": ["White", "Yellow", "Blue"],
    "availableSizes": ["XS", "S", "M"],
    "description": "A flirty and fun off-the-shoulder top.",
    "imageUrl": "https://placehold.co/600x400/FBBF24/000000?text=Off-Shoulder+Top"
  },
  {
    "name": "Trench Coat",
    "brand": "Modern Executive",
    "category": "Jackets",
    "price": 250.00,
    "colors": ["Beige", "Black"],
    "availableSizes": ["S", "M", "L"],
    "description": "A classic, timeless trench coat for rainy days.",
    "imageUrl": "https://placehold.co/600x400/D6C1A2/FFFFFF?text=Trench+Coat"
  },
  {
    "name": "A-Line Skirt",
    "brand": "Chic & Co.",
    "category": "Skirts",
    "price": 52.00,
    "colors": ["Black", "Red"],
    "availableSizes": ["S", "M", "L"],
    "description": "A simple and versatile A-line skirt.",
    "imageUrl": "https://placehold.co/600x400/B91C1C/FFFFFF?text=A-Line+Skirt"
  },
  {
    "name": "Knit Beanie",
    "brand": "Luxe Knits",
    "category": "Accessories",
    "price": 25.00,
    "colors": ["Gray", "Black", "Mustard"],
    "availableSizes": ["One Size"],
    "description": "A soft and warm knit beanie for cold weather.",
    "imageUrl": "https://placehold.co/600x400/6B7280/FFFFFF?text=Beanie"
  },
  {
    "name": "Button-Up Shirt Dress",
    "brand": "Coastal Living",
    "category": "Dresses",
    "price": 69.95,
    "colors": ["White", "Striped Blue"],
    "availableSizes": ["S", "M", "L"],
    "description": "A casual yet polished shirt dress.",
    "imageUrl": "https://placehold.co/600x400/BFDBFE/000000?text=Shirt+Dress"
  },
  {
    "name": "High-Top Sneakers",
    "brand": "Urban Threads",
    "category": "Shoes",
    "price": 95.00,
    "colors": ["White", "Black", "Red"],
    "availableSizes": ["7", "8", "9", "10", "11"],
    "description": "Classic canvas high-top sneakers.",
    "imageUrl": "https://placehold.co/600x400/E5E7EB/000000?text=Sneakers"
  },
  {
    "name": "Ankle Boots",
    "brand": "Artisan Bags",
    "category": "Shoes",
    "price": 140.00,
    "colors": ["Black", "Brown"],
    "availableSizes": ["6", "7", "8", "9"],
    "description": "Versatile leather ankle boots with a low heel.",
    "imageUrl": "https://placehold.co/600x400/44403C/FFFFFF?text=Ankle+Boots"
  },
  {
    "name": "Yoga Pants",
    "brand": "FitFlex",
    "category": "Pants",
    "price": 65.00,
    "colors": ["Black", "Navy", "Purple"],
    "availableSizes": ["XS", "S", "M", "L", "XL"],
    "description": "High-waisted, moisture-wicking yoga pants.",
    "imageUrl": "https://placehold.co/600x400/5B21B6/FFFFFF?text=Yoga+Pants"
  },
  {
    "name": "Bomber Jacket",
    "brand": "Urban Threads",
    "category": "Jackets",
    "price": 99.00,
    "colors": ["Olive", "Black", "Burgundy"],
    "availableSizes": ["S", "M", "L", "XL"],
    "description": "A stylish satin bomber jacket.",
    "imageUrl": "https://placehold.co/600x400/4D7C0F/FFFFFF?text=Bomber+Jacket"
  },
  {
    "name": "Peplum Top",
    "brand": "Chic & Co.",
    "category": "Tops",
    "price": 48.00,
    "colors": ["Red", "White", "Black"],
    "availableSizes": ["S", "M", "L"],
    "description": "A flattering peplum top that accentuates the waist.",
    "imageUrl": "https://placehold.co/600x400/E11D48/FFFFFF?text=Peplum+Top"
  },
  {
    "name": "Flare Jeans",
    "brand": "Denim Co.",
    "category": "Jeans",
    "price": 85.00,
    "colors": ["Dark Blue", "Black"],
    "availableSizes": ["S", "M", "L"],
    "description": "Retro-inspired high-waisted flare jeans.",
    "imageUrl": "https://placehold.co/600x400/1D4ED8/FFFFFF?text=Flare+Jeans"
  },
  {
    "name": "Cocktail Dress",
    "brand": "Chic & Co.",
    "category": "Dresses",
    "price": 130.00,
    "colors": ["Black", "Red", "Navy"],
    "availableSizes": ["XS", "S", "M", "L"],
    "description": "A stunning little black dress for any cocktail party.",
    "imageUrl": "https://placehold.co/600x400/171717/FFFFFF?text=Cocktail+Dress"
  },
  {
    "name": "Crewneck Sweatshirt",
    "brand": "FitFlex",
    "category": "Sweaters",
    "price": 50.00,
    "colors": ["Gray", "Navy", "Forrest Green"],
    "availableSizes": ["S", "M", "L", "XL", "XXL"],
    "description": "A classic and comfortable crewneck sweatshirt.",
    "imageUrl": "https://placehold.co/600x400/A1A1AA/FFFFFF?text=Sweatshirt"
  },
  {
    "name": "Leather Biker Jacket",
    "brand": "Urban Threads",
    "category": "Jackets",
    "price": 220.00,
    "colors": ["Black"],
    "availableSizes": ["S", "M", "L"],
    "description": "An iconic faux leather biker jacket with silver hardware.",
    "imageUrl": "https://placehold.co/600x400/262626/FFFFFF?text=Biker+Jacket"
  },
  {
    "name": "Polka Dot Blouse",
    "brand": "Chic & Co.",
    "category": "Tops",
    "price": 54.99,
    "colors": ["Black", "White"],
    "availableSizes": ["S", "M", "L"],
    "description": "A playful yet chic polka dot blouse.",
    "imageUrl": "https://placehold.co/600x400/FAFAF9/000000?text=Polka+Dot"
  },
  {
    "name": "Linen Shorts",
    "brand": "Coastal Living",
    "category": "Shorts",
    "price": 42.00,
    "colors": ["Beige", "White", "Olive"],
    "availableSizes": ["S", "M", "L", "XL"],
    "description": "Lightweight and breathable linen shorts.",
    "imageUrl": "https://placehold.co/600x400/F5F5F4/000000?text=Linen+Shorts"
  },
  {
    "name": "Jumpsuit",
    "brand": "Modern Executive",
    "category": "Dresses",
    "price": 115.00,
    "colors": ["Black", "Navy"],
    "availableSizes": ["S", "M", "L"],
    "description": "A sophisticated and modern jumpsuit for work or evening.",
    "imageUrl": "https://placehold.co/600x400/374151/FFFFFF?text=Jumpsuit"
  },
  {
    "name": "Straw Hat",
    "brand": "Summer Bloom",
    "category": "Accessories",
    "price": 30.00,
    "colors": ["Natural"],
    "availableSizes": ["One Size"],
    "description": "A wide-brim straw hat for sun protection.",
    "imageUrl": "https://placehold.co/600x400/FDE68A/000000?text=Straw+Hat"
  },
  {
    "name": "Running Shorts",
    "brand": "FitFlex",
    "category": "Shorts",
    "price": 35.00,
    "colors": ["Black", "Blue", "Pink"],
    "availableSizes": ["S", "M", "L"],
    "description": "Lightweight running shorts with a built-in liner.",
    "imageUrl": "https://placehold.co/600x400/4F46E5/FFFFFF?text=Running+Shorts"
  },
  {
    "name": "Pencil Skirt",
    "brand": "Modern Executive",
    "category": "Skirts",
    "price": 65.00,
    "colors": ["Black", "Gray", "Navy"],
    "availableSizes": ["S", "M", "L"],
    "description": "A classic, form-fitting pencil skirt.",
    "imageUrl": "https://placehold.co/600x400/52525B/FFFFFF?text=Pencil+Skirt"
  },
  {
    "name": "Henley Shirt",
    "brand": "Coastal Living",
    "category": "Tops",
    "price": 38.00,
    "colors": ["White", "Gray", "Navy"],
    "availableSizes": ["M", "L", "XL"],
    "description": "A comfortable long-sleeve henley shirt.",
    "imageUrl": "https://placehold.co/600x400/E5E7EB/000000?text=Henley"
  },
  {
    "name": "Evening Gown",
    "brand": "Chic & Co.",
    "category": "Dresses",
    "price": 350.00,
    "colors": ["Red", "Black", "Gold"],
    "availableSizes": ["XS", "S", "M", "L"],
    "description": "A breathtaking floor-length evening gown.",
    "imageUrl": "https://placehold.co/600x400/F59E0B/FFFFFF?text=Gown"
  },
  {
    "name": "Denim Shorts",
    "brand": "Denim Co.",
    "category": "Shorts",
    "price": 55.00,
    "colors": ["Blue", "Black", "White"],
    "availableSizes": ["S", "M", "L"],
    "description": "Classic high-waisted denim cutoff shorts.",
    "imageUrl": "https://placehold.co/600x400/3B82F6/FFFFFF?text=Denim+Shorts"
  },
  {
    "name": "Cable Knit Sweater",
    "brand": "Luxe Knits",
    "category": "Sweaters",
    "price": 125.00,
    "colors": ["Cream", "Navy"],
    "availableSizes": ["S", "M", "L", "XL"],
    "description": "A timeless and cozy cable knit sweater.",
    "imageUrl": "https://placehold.co/600x400/FEFCE8/000000?text=Cable+Knit"
  },
  {
    "name": "Silk Scarf",
    "brand": "Artisan Bags",
    "category": "Accessories",
    "price": 45.00,
    "colors": ["Blue", "Pink", "Green"],
    "availableSizes": ["One Size"],
    "description": "A beautiful printed silk scarf.",
    "imageUrl": "https://placehold.co/600x400/22D3EE/FFFFFF?text=Silk+Scarf"
  },
  {
    "name": "Corduroy Pants",
    "brand": "Urban Threads",
    "category": "Pants",
    "price": 72.00,
    "colors": ["Brown", "Green", "Tan"],
    "availableSizes": ["S", "M", "L"],
    "description": "Soft and durable corduroy pants.",
    "imageUrl": "https://placehold.co/600x400/854D0E/FFFFFF?text=Corduroy"
  },
  {
    "name": "Raincoat",
    "brand": "Coastal Living",
    "category": "Jackets",
    "price": 110.00,
    "colors": ["Yellow", "Navy", "Red"],
    "availableSizes": ["S", "M", "L", "XL"],
    "description": "A waterproof and stylish raincoat.",
    "imageUrl": "https://placehold.co/600x400/FACC15/000000?text=Raincoat"
  },
  {
    "name": "Bodycon Dress",
    "brand": "Chic & Co.",
    "category": "Dresses",
    "price": 80.00,
    "colors": ["Black", "Red"],
    "availableSizes": ["XS", "S", "M"],
    "description": "A curve-hugging bodycon dress.",
    "imageUrl": "https://placehold.co/600x400/7F1D1D/FFFFFF?text=Bodycon"
  },
  {
    "name": "Plaid Flannel Shirt",
    "brand": "Urban Threads",
    "category": "Tops",
    "price": 49.00,
    "colors": ["Red", "Blue", "Green"],
    "availableSizes": ["S", "M", "L", "XL"],
    "description": "A soft and warm plaid flannel shirt.",
    "imageUrl": "https://placehold.co/600x400/991B1B/FFFFFF?text=Flannel"
  },
  {
    "name": "Mom Jeans",
    "brand": "Denim Co.",
    "category": "Jeans",
    "price": 78.00,
    "colors": ["Light Blue", "Black"],
    "availableSizes": ["S", "M", "L"],
    "description": "High-waisted, relaxed-fit mom jeans.",
    "imageUrl": "https://placehold.co/600x400/60A5FA/FFFFFF?text=Mom+Jeans"
  },
  {
    "name": "Fleece Pullover",
    "brand": "FitFlex",
    "category": "Sweaters",
    "price": 65.00,
    "colors": ["Gray", "Black", "Blue"],
    "availableSizes": ["S", "M", "L", "XL"],
    "description": "A cozy half-zip fleece pullover.",
    "imageUrl": "https://placehold.co/600x400/4B5563/FFFFFF?text=Fleece"
  },
  {
    "name": "Maxi Skirt",
    "brand": "Summer Bloom",
    "category": "Skirts",
    "price": 58.00,
    "colors": ["Black", "Floral", "Teal"],
    "availableSizes": ["S", "M", "L"],
    "description": "A long, flowing maxi skirt.",
    "imageUrl": "https://placehold.co/600x400/14B8A6/FFFFFF?text=Maxi+Skirt"
  },
  {
    "name": "Leather Belt",
    "brand": "Artisan Bags",
    "category": "Accessories",
    "price": 50.00,
    "colors": ["Brown", "Black"],
    "availableSizes": ["S", "M", "L"],
    "description": "A classic genuine leather belt.",
    "imageUrl": "https://placehold.co/600x400/A16207/FFFFFF?text=Leather+Belt"
  },
  {
    "name": "Sheath Dress",
    "brand": "Modern Executive",
    "category": "Dresses",
    "price": 120.00,
    "colors": ["Navy", "Black", "Gray"],
    "availableSizes": ["S", "M", "L"],
    "description": "A sophisticated and tailored sheath dress for the office.",
    "imageUrl": "https://placehold.co/600x400/1E40AF/FFFFFF?text=Sheath+Dress"
  },
  {
    "name": "Parka",
    "brand": "FitFlex",
    "category": "Jackets",
    "price": 180.00,
    "colors": ["Olive", "Black", "Navy"],
    "availableSizes": ["S", "M", "L", "XL"],
    "description": "A warm, insulated parka with a faux fur hood.",
    "imageUrl": "https://placehold.co/600x400/3F6212/FFFFFF?text=Parka"
  },
  {
    "name": "Tank Top",
    "brand": "FitFlex",
    "category": "Tops",
    "price": 25.00,
    "colors": ["White", "Black", "Gray", "Pink"],
    "availableSizes": ["XS", "S", "M", "L", "XL"],
    "description": "A basic, versatile ribbed tank top.",
    "imageUrl": "https://placehold.co/600x400/F9FAFB/000000?text=Tank+Top"
  },
  {
    "name": "Chinos",
    "brand": "Coastal Living",
    "category": "Pants",
    "price": 60.00,
    "colors": ["Khaki", "Navy", "Gray"],
    "availableSizes": ["30", "32", "34", "36"],
    "description": "Classic and comfortable chino pants.",
    "imageUrl": "https://placehold.co/600x400/BEBEBE/FFFFFF?text=Chinos"
  },
  {
    "name": "Gingham Dress",
    "brand": "Summer Bloom",
    "category": "Dresses",
    "price": 62.00,
    "colors": ["Black", "White", "Blue"],
    "availableSizes": ["S", "M", "L"],
    "description": "A sweet and classic gingham print dress.",
    "imageUrl": "https://placehold.co/600x400/71717A/FFFFFF?text=Gingham"
  },
  {
    "name": "Overalls",
    "brand": "Denim Co.",
    "category": "Pants",
    "price": 90.00,
    "colors": ["Blue", "Black"],
    "availableSizes": ["S", "M", "L"],
    "description": "Classic denim overalls with a modern fit.",
    "imageUrl": "https://placehold.co/600x400/2563EB/FFFFFF?text=Overalls"
  },
  {
    "name": "Ballet Flats",
    "brand": "Chic & Co.",
    "category": "Shoes",
    "price": 75.00,
    "colors": ["Black", "Nude", "Red"],
    "availableSizes": ["6", "7", "8", "9", "10"],
    "description": "Comfortable and elegant leather ballet flats.",
    "imageUrl": "https://placehold.co/600x400/FBCFE8/000000?text=Flats"
  },
  {
    "name": "Polo Shirt",
    "brand": "Coastal Living",
    "category": "Tops",
    "price": 45.00,
    "colors": ["White", "Navy", "Pink", "Green"],
    "availableSizes": ["S", "M", "L", "XL"],
    "description": "A classic pique polo shirt.",
    "imageUrl": "https://placehold.co/600x400/A7F3D0/000000?text=Polo"
  },
  {
    "name": "Sequin Skirt",
    "brand": "Chic & Co.",
    "category": "Skirts",
    "price": 85.00,
    "colors": ["Silver", "Gold", "Black"],
    "availableSizes": ["XS", "S", "M"],
    "description": "A dazzling sequin mini skirt for a night out.",
    "imageUrl": "https://placehold.co/600x400/E5E7EB/000000?text=Sequin+Skirt"
  },
  {
    "name": "Wool Peacoat",
    "brand": "Modern Executive",
    "category": "Jackets",
    "price": 280.00,
    "colors": ["Navy", "Charcoal"],
    "availableSizes": ["S", "M", "L", "XL"],
    "description": "A classic double-breasted wool peacoat.",
    "imageUrl": "https://placehold.co/600x400/1E3A8A/FFFFFF?text=Peacoat"
  },
  {
    "name": "Lace Bralette",
    "brand": "Luxe Knits",
    "category": "Lingerie",
    "price": 35.00,
    "colors": ["Black", "White", "Red"],
    "availableSizes": ["S", "M", "L"],
    "description": "A delicate and comfortable lace bralette.",
    "imageUrl": "https://placehold.co/600x400/FCA5A5/000000?text=Bralette"
  },
  {
    "name": "Romper",
    "brand": "Summer Bloom",
    "category": "Dresses",
    "price": 58.00,
    "colors": ["Floral", "Blue", "White"],
    "availableSizes": ["S", "M", "L"],
    "description": "A playful and easy-to-wear romper.",
    "imageUrl": "https://placehold.co/600x400/818CF8/FFFFFF?text=Romper"
  },
  {
    "name": "Sunglasses",
    "brand": "Artisan Bags",
    "category": "Accessories",
    "price": 60.00,
    "colors": ["Black", "Tortoise"],
    "availableSizes": ["One Size"],
    "description": "Classic wayfarer-style sunglasses with UV protection.",
    "imageUrl": "https://placehold.co/600x400/404040/FFFFFF?text=Sunglasses"
  },
  {
    "name": "Sports Bra",
    "brand": "FitFlex",
    "category": "Tops",
    "price": 40.00,
    "colors": ["Black", "Pink", "Blue"],
    "availableSizes": ["S", "M", "L"],
    "description": "A supportive sports bra for medium-impact activities.",
    "imageUrl": "https://placehold.co/600x400/F472B6/FFFFFF?text=Sports+Bra"
  },
  {
    "name": "Beret",
    "brand": "Chic & Co.",
    "category": "Accessories",
    "price": 28.00,
    "colors": ["Red", "Black", "Gray"],
    "availableSizes": ["One Size"],
    "description": "A classic wool beret for a touch of Parisian chic.",
    "imageUrl": "https://placehold.co/600x400/EF4444/FFFFFF?text=Beret"
  },
  {
    "name": "Velvet Blazer",
    "brand": "Chic & Co.",
    "category": "Jackets",
    "price": 150.00,
    "colors": ["Burgundy", "Black", "Emerald"],
    "availableSizes": ["S", "M", "L"],
    "description": "A luxurious and plush velvet blazer.",
    "imageUrl": "https://placehold.co/600x400/9F1239/FFFFFF?text=Velvet+Blazer"
  },
  {
    "name": "Bodysuit",
    "brand": "Urban Threads",
    "category": "Tops",
    "price": 35.00,
    "colors": ["Black", "White", "Nude"],
    "availableSizes": ["XS", "S", "M", "L"],
    "description": "A seamless and versatile long-sleeve bodysuit.",
    "imageUrl": "https://placehold.co/600x400/D6D3D1/000000?text=Bodysuit"
  },
  {
    "name": "Loafers",
    "brand": "Modern Executive",
    "category": "Shoes",
    "price": 110.00,
    "colors": ["Black", "Brown", "Navy"],
    "availableSizes": ["7", "8", "9", "10"],
    "description": "Classic leather penny loafers.",
    "imageUrl": "https://placehold.co/600x400/57534E/FFFFFF?text=Loafers"
  },
  {
    "name": "Kimono",
    "brand": "Summer Bloom",
    "category": "Jackets",
    "price": 55.00,
    "colors": ["Floral", "Black"],
    "availableSizes": ["One Size"],
    "description": "A lightweight, flowing kimono-style jacket.",
    "imageUrl": "https://placehold.co/600x400/FB923C/FFFFFF?text=Kimono"
  },
  {
    "name": "Sweatpants",
    "brand": "FitFlex",
    "category": "Pants",
    "price": 50.00,
    "colors": ["Gray", "Black"],
    "availableSizes": ["S", "M", "L", "XL"],
    "description": "Ultra-soft fleece sweatpants for maximum comfort.",
    "imageUrl": "https://placehold.co/600x400/A3A3A3/FFFFFF?text=Sweatpants"
  },
  {
    "name": "Halter Top",
    "brand": "Summer Bloom",
    "category": "Tops",
    "price": 32.00,
    "colors": ["White", "Black", "Red"],
    "availableSizes": ["S", "M", "L"],
    "description": "A stylish knit halter top.",
    "imageUrl": "https://placehold.co/600x400/F87171/FFFFFF?text=Halter+Top"
  },
  {
    "name": "Platform Sandals",
    "brand": "Urban Threads",
    "category": "Shoes",
    "price": 80.00,
    "colors": ["Black", "White", "Tan"],
    "availableSizes": ["6", "7", "8", "9"],
    "description": "Chunky platform sandals for a trendy look.",
    "imageUrl": "https://placehold.co/600x400/F5F5F4/000000?text=Sandals"
  },
  {
    "name": "One-Piece Swimsuit",
    "brand": "Coastal Living",
    "category": "Swimwear",
    "price": 75.00,
    "colors": ["Black", "Red", "Blue"],
    "availableSizes": ["S", "M", "L"],
    "description": "A classic and flattering one-piece swimsuit.",
    "imageUrl": "https://placehold.co/600x400/0EA5E9/FFFFFF?text=Swimsuit"
  },
  {
    "name": "Bikini Set",
    "brand": "Summer Bloom",
    "category": "Swimwear",
    "price": 80.00,
    "colors": ["Pink", "Yellow", "Tropical Print"],
    "availableSizes": ["S", "M", "L"],
    "description": "A vibrant and stylish two-piece bikini set.",
    "imageUrl": "https://placehold.co/600x400/F43F5E/FFFFFF?text=Bikini"
  },
  {
    "name": "Cowl Neck Sweater",
    "brand": "Luxe Knits",
    "category": "Sweaters",
    "price": 98.00,
    "colors": ["Gray", "Oatmeal", "Black"],
    "availableSizes": ["S", "M", "L"],
    "description": "An elegant and cozy cowl neck sweater.",
    "imageUrl": "https://placehold.co/600x400/D4D4D8/000000?text=Cowl+Neck"
  },
  {
    "name": "Suede Skirt",
    "brand": "Urban Threads",
    "category": "Skirts",
    "price": 70.00,
    "colors": ["Tan", "Black"],
    "availableSizes": ["S", "M", "L"],
    "description": "A chic faux suede mini skirt with button-front details.",
    "imageUrl": "https://placehold.co/600x400/D97706/FFFFFF?text=Suede+Skirt"
  }
]
export default Products;