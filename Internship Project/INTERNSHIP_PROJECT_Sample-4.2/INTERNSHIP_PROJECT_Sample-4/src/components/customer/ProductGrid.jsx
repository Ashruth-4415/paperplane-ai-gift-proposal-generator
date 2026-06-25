import { useState } from 'react';
import { ShoppingBag, Star, Package, ChevronRight, Check } from 'lucide-react';
import { productCategories } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import Button from '../common/Button';
import { useApp } from '../../context/AppContext';

export default function ProductGrid({ onAddToEnquiry }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [enquired, setEnquired] = useState(new Set());
  const { showToast, products } = useApp();

  const filtered = activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory);

  const handleAdd = (product) => {
    setEnquired(prev => new Set([...prev, product.id]));
    showToast(`${product.name} added to enquiry!`, 'success');
    if (onAddToEnquiry) onAddToEnquiry(product);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {productCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? 'bg-brand-600 text-white shadow-glow' : 'bg-surface-800 text-surface-400 hover:text-surface-100 border border-surface-700'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(product => {
          const added = enquired.has(product.id);
          return (
            <div key={product.id} className="group bg-surface-800 border border-surface-700/50 rounded-2xl overflow-hidden hover:border-brand-500/40 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 flex flex-col">
              {/* Visual */}
              <div className={`h-36 bg-gradient-to-br ${product.bgColor} flex items-center justify-center relative`}>
                <span className="text-5xl">{product.emoji}</span>
                {!product.inStock && (
                  <div className="absolute inset-0 bg-surface-900/60 flex items-center justify-center">
                    <span className="text-xs font-semibold text-rose-300 bg-rose-900/80 px-2 py-1 rounded-full border border-rose-700">Out of Stock</span>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className="text-xs bg-surface-900/70 text-surface-300 px-2 py-0.5 rounded-full border border-surface-700">{product.category}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-surface-100 font-semibold text-sm leading-snug mb-1 group-hover:text-brand-300 transition-colors">{product.name}</h3>
                <p className="text-surface-500 text-xs mb-3 flex-1 leading-relaxed">{product.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-xs bg-surface-700/60 text-surface-400 px-1.5 py-0.5 rounded-md">{tag}</span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-brand-400 font-bold text-sm">{formatCurrency(product.price)}</p>
                    <p className="text-surface-600 text-xs">Min: {product.minQty} units</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-surface-400">{product.rating}</span>
                  </div>
                </div>

                <Button
                  variant={added ? 'success' : 'primary'}
                  size="sm"
                  className="mt-3 w-full"
                  disabled={!product.inStock || added}
                  icon={added ? Check : ShoppingBag}
                  onClick={() => handleAdd(product)}
                >
                  {added ? 'Added to Enquiry' : 'Add to Enquiry'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
