
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ChefHat, User, Package } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MainCartView from '@/components/cart/MainCartView';
import RecipeCartsView from '@/components/cart/RecipeCartsView';
import PersonalCartView from '@/components/cart/PersonalCartView';

const Cart = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Récupérer l'onglet actuel depuis l'URL ou utiliser 'main' par défaut
  const activeTab = searchParams.get('tab') || 'main';

  // Fonction pour changer d'onglet et mettre à jour l'URL
  const handleTabChange = (newTab: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (newTab === 'main') {
      newSearchParams.delete('tab'); // Supprimer le paramètre pour l'onglet principal
    } else {
      newSearchParams.set('tab', newTab);
    }
    setSearchParams(newSearchParams);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-center text-gray-600 mb-4 text-sm sm:text-base">
              Veuillez vous connecter pour accéder à vos paniers.
            </p>
            <Button 
              onClick={() => navigate('/login')} 
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              Se connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Mes Paniers</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Gérez tous vos paniers : principal, recettes et personnalisé
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4 sm:space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-4 h-auto p-1 min-w-[320px]">
              <TabsTrigger value="main" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-3 px-1 sm:px-3">
                <ShoppingCart className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm leading-tight">Principal</span>
              </TabsTrigger>
              <TabsTrigger value="recipe" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-3 px-1 sm:px-3">
                <ChefHat className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm leading-tight">Recettes</span>
              </TabsTrigger>
              <TabsTrigger value="personal" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-3 px-1 sm:px-3">
                <User className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm leading-tight">Personnel</span>
              </TabsTrigger>
              <TabsTrigger value="preconfigured" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-3 px-1 sm:px-3">
                <Package className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm leading-tight hidden lg:inline">Préconfigurés</span>
                <span className="text-xs sm:text-sm leading-tight lg:hidden">Préconfig</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="main" className="space-y-4 sm:space-y-6">
            <MainCartView />
          </TabsContent>

          <TabsContent value="recipe" className="space-y-4 sm:space-y-6">
            <RecipeCartsView />
          </TabsContent>

          <TabsContent value="personal" className="space-y-4 sm:space-y-6">
            <PersonalCartView />
          </TabsContent>

          <TabsContent value="preconfigured" className="space-y-4 sm:space-y-6">
            <Card>
              <CardContent className="pt-8 pb-8 sm:pt-12 sm:pb-12">
                <div className="text-center">
                  <Package className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Paniers préconfigurés</h3>
                  <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base px-4">
                    Découvrez nos sélections de produits pré-organisées
                  </p>
                  <Button 
                    onClick={() => navigate('/preconfigured-carts')}
                    className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto"
                  >
                    Voir les paniers préconfigurés
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Cart;
