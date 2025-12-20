import { Product } from '@/types/pos';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Package } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export const ProductGrid = ({ products, onAddToCart }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {products.map((product) => (
        <Card 
          key={product.id} 
          className="group hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          <CardContent className="p-0">
            <div className="relative overflow-hidden rounded-t-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <Badge 
                variant="secondary" 
                className="absolute top-2 right-2 bg-white/90 text-gray-800"
              >
                {product.category}
              </Badge>
              {product.stock < 10 && (
                <Badge 
                  variant="destructive" 
                  className="absolute top-2 left-2 flex items-center gap-1"
                >
                  <Package className="w-3 h-3" />
                  Sắp hết hàng
                </Badge>
              )}
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-sm mb-1 line-clamp-1">{product.name}</h3>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">{formatCurrency(product.price)}</span>
                <span className="text-xs text-muted-foreground">Kho: {product.stock}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-3 pt-0">
            <Button 
              onClick={() => onAddToCart(product)}
              className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              variant="outline"
              size="sm"
              disabled={product.stock === 0}
            >
              <Plus className="w-4 h-4 mr-1" />
              Thêm vào giỏ
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};