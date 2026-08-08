import ProductCard from "../../components/shop/ProductCard";
import { products } from "../../data/products";

export default function Shop() {
  return (
    <div className="mx-auto max-w-7xl p-10">
      <h1 className="mb-8 text-4xl font-bold">
        T-Shirts
      </h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
}