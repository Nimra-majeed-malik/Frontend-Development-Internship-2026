type ProductCardProps = {
  image: string;
  name: string;
  price: string;
  description: string;
};

export default function ProductCard({ image, name, price, description }: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 max-w-xs">
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
        <p className="text-gray-500 text-sm mb-3">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-indigo-600">{price}</span>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors duration-300">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}