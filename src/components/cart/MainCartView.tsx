
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Package, ChefHat, User, CreditCard } from 'lucide-react';
import { usePersonalCart, useRecipeUserCarts } from '@/hooks/useSupabaseCart';
import { formatPrice } from '@/lib/firestore';
import { useNavigate, useSearchParams } from 'react-router-dom';

const MainCartView = () => {
  const { personalCart, personalCartItems } = usePersonalCart();
  const { recipeCarts } = useRecipeUserCarts();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const personalCartTotal = personalCartItems.reduce((sum, item) => 
    sum + ((item.products?.price || 0) * item.quantity), 0
  );

  const recipeCartsTotal = recipeCarts.reduce((sum, cart) => {
    // On pourrait calculer le total de chaque panier recette ici
    return sum;
  }, 0);

  const totalAmount = personalCartTotal + recipeCartsTotal;

  const allCarts = [
    ...(personalCart && personalCartItems.length > 0 ? [{
      id: personalCart.id,
      name: 'Panier Personnel',
      type: 'personal',
      itemsCount: personalCartItems.length,
      total: personalCartTotal,
      icon: <User className="h-4 w-4" />
    }] : []),
    ...recipeCarts.map(cart => ({
      id: cart.id,
      name: cart.cart_name,
      type: 'recipe',
      itemsCount: 0, // À calculer si nécessaire
      total: 0, // À calculer si nécessaire
      icon: <ChefHat className="h-4 w-4" />
    }))
  ];

  const handleViewCartDetail = (cartType: string, cartId: string) => {
    // Mettre à jour les paramètres de recherche pour changer d'onglet
    const newSearchParams = new URLSearchParams(searchParams);
    
    if (cartType === 'personal') {
      newSearchParams.set('tab', 'personal');
    } else if (cartType === 'recipe') {
      newSearchParams.set('tab', 'recipe');
    }
    
    // Naviguer vers la page panier avec le bon onglet
    navigate(`/panier?${newSearchParams.toString()}`);
  };

  if (allCarts.length === 0) {
    return (
      <Card>
        <CardContent className="pt-8 pb-8 sm:pt-12 sm:pb-12">
          <div className="text-center">
            <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Votre panier est vide</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4">Ajoutez des produits ou créez des paniers recette pour commencer</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button 
                onClick={() => navigate('/produits')}
                className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto"
              >
                Voir les produits
              </Button>
              <Button 
                onClick={() => navigate('/recettes')}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Voir les recettes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center text-lg sm:text-xl">
            <ShoppingCart className="h-5 w-5 mr-2 flex-shrink-0" />
            <span className="truncate">Mes Paniers ({allCarts.length} panier{allCarts.length > 1 ? 's' : ''})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          {allCarts.map((cart) => (
            <div key={cart.id} className="border rounded-lg bg-gray-50 overflow-hidden">
              <div className="p-3 sm:p-4">
                <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex-shrink-0">
                      {cart.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm sm:text-base truncate pr-2">{cart.name}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {cart.type === 'personal' ? 'Personnel' : 'Recette'}
                        </Badge>
                        <span className="text-xs sm:text-sm text-gray-500">
                          {cart.itemsCount} article{cart.itemsCount > 1 ? 's' : ''}
                        </span>
                      </div>
                      <p className="text-orange-500 font-semibold mt-1 text-sm sm:text-base">
                        {formatPrice(cart.total)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewCartDetail(cart.type, cart.id)}
                    className="w-full sm:w-auto mt-2 sm:mt-0 text-xs sm:text-sm"
                  >
                    Voir le détail
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Résumé de commande</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm sm:text-base">
              <span>Sous-total</span>
              <span className="font-medium">{formatPrice(totalAmount)}</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span>Livraison</span>
              <span className="text-green-600 font-medium">Gratuite</span>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex justify-between font-semibold text-base sm:text-lg">
            <span>Total</span>
            <span className="text-orange-500">{formatPrice(totalAmount)}</span>
          </div>

          <Button 
            className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm sm:text-base py-2 sm:py-3"
            disabled={totalAmount === 0}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Passer commande ({formatPrice(totalAmount)})
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MainCartView;
