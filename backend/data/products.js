// src/data/products.js
const brands = ['Zara','H&M','Nike','Adidas','Puma','Levis','Biba','Mango','Fabindia','Woodland'];
const categories = ['Dress','Saree','Jeans','Top','Shirt','Gown','Shoes','Kurta','Jacket','Handbag'];
const colors = ['Red','Blue','Black','White','Green','Yellow','Pink','Maroon','Purple','Grey','Brown'];
const occasions = ['Party','Office','Casual','Wedding','Sports','Birthday','Festive'];
const featuresPool = ['Lightweight','Durable','Eco-Friendly','Breathable','Stretch','Waterproof','Quick Dry','Formal','Trendy','Comfort Fit'];
const sizesPool = {
  'Shoes': ['6','7','8','9','10','11'],
  'Handbag': ['One Size'],
  'Saree': ['One Size'],
  'Dress': ['S','M','L','XL'],
  'Top': ['S','M','L','XL'],
  'Shirt': ['S','M','L','XL'],
  'Jeans': ['28','30','32','34','36'],
  'Gown': ['S','M','L'],
  'Kurta': ['M','L','XL'],
  'Jacket': ['M','L','XL']
};

function rand(arr) { return arr[Math.floor(Math.random()*arr.length)]; }
function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function sample(arr,n){ return [...arr].sort(()=>0.5-Math.random()).slice(0,n); }

const products = Array.from({length:100}, (_, i) => {
  const category = rand(categories);
  const brand = rand(brands);
  const color = rand(colors);
  const occasion = rand(occasions);
  const price = randInt(399, 6999);
  const rating = Math.round((Math.random()*2 + 3) * 10) / 10; // 3.0 - 5.0
  const features = sample(featuresPool, randInt(2,4));
  const sizes = sizesPool[category] || ['S','M','L'];
  const colorsArr = sample(colors, Math.min(3, randInt(1,3)));

  return {
    name: `${color} ${category} ${i+1}`,
    brand,
    category,
    price,
    rating,
    occasion,
    features,
    sizes,
    colors: colorsArr,
    stock: randInt(5, 100),
    imageUrl: `https://picsum.photos/seed/fashion_${i}/400/600`,
    description: `${brand} ${category} suitable for ${occasion}. ${features.join(', ')}.`
  };
});

export default products;
