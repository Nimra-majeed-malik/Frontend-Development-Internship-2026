import ProductCard from './ProductCard'

const products = [
  {
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    name: 'Running Shoes',
    price: '$59.99',
    description: 'Lightweight and comfortable for everyday runs.',
  },
  {
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    name: 'Wireless Watch',
    price: '$129.99',
    description: 'Track your fitness with style and precision.',
  },
  {
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400',
    name: 'Backpack',
    price: '$39.99',
    description: 'Durable and spacious for daily commutes.',
  },
  {
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    name: 'Headphones',
    price: '$89.99',
    description: 'Noise-cancelling with rich, deep bass.',
  },
];

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-10">Our Products</h1>
      <div className="flex flex-wrap justify-center gap-6">
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </div>
  );
}

export default App;