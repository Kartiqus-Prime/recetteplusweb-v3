
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, User, ShoppingCart, Heart, LogOut, Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useMainCart } from '@/hooks/useSupabaseCart';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { cartItems } = useMainCart();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  const cartItemsCount = cartItems?.length || 0;

  const NavigationLinks = ({ mobile = false, onLinkClick = () => {} }) => (
    <>
      <Link 
        to="/recettes" 
        className={cn(
          "text-sm font-medium transition-colors hover:text-orange-500",
          isActive("/recettes") ? "text-orange-500" : "text-gray-600",
          mobile && "block py-2 text-base"
        )}
        onClick={onLinkClick}
      >
        Recettes
      </Link>
      <Link 
        to="/produits" 
        className={cn(
          "text-sm font-medium transition-colors hover:text-orange-500",
          isActive("/produits") ? "text-orange-500" : "text-gray-600",
          mobile && "block py-2 text-base"
        )}
        onClick={onLinkClick}
      >
        Produits
      </Link>
      <Link 
        to="/videos" 
        className={cn(
          "text-sm font-medium transition-colors hover:text-orange-500",
          isActive("/videos") ? "text-orange-500" : "text-gray-600",
          mobile && "block py-2 text-base"
        )}
        onClick={onLinkClick}
      >
        Vidéos
      </Link>
      <Link 
        to="/favorites" 
        className={cn(
          "text-sm font-medium transition-colors hover:text-orange-500",
          isActive("/favorites") ? "text-orange-500" : "text-gray-600",
          mobile && "block py-2 text-base"
        )}
        onClick={onLinkClick}
      >
        Favoris
      </Link>
    </>
  );
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/fd4068e4-5395-416a-a0d9-2f2084813da4.png" 
              alt="Recette+" 
              className="h-12 w-auto"
            />
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            <NavigationLinks />
          </nav>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Rechercher des recettes, produits..." 
                className="pl-10 pr-4 bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Favorites - Desktop only */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden md:flex"
              onClick={() => navigate('/favorites')}
            >
              <Heart className="h-5 w-5" />
            </Button>
            
            {/* Cart with badge */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/panier')}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 bg-orange-500 hover:bg-orange-600"
                >
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </Badge>
              )}
            </Button>
            
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    {currentUser.user_metadata?.avatar_url ? (
                      <img 
                        src={currentUser.user_metadata.avatar_url} 
                        alt="Avatar" 
                        className="h-6 w-6 rounded-full"
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{currentUser.user_metadata?.display_name || currentUser.user_metadata?.full_name || 'Utilisateur'}</p>
                    <p className="text-xs text-gray-500">{currentUser.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Mon profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/panier')}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    <span>Mon panier</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/favorites')} className="md:hidden">
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Mes favoris</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Se déconnecter</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="icon" onClick={() => navigate('/login')}>
                  <User className="h-5 w-5" />
                </Button>
                <Button 
                  onClick={() => navigate('/login')}
                  className="bg-orange-500 hover:bg-orange-600 text-white hidden sm:inline-flex"
                >
                  Connexion
                </Button>
              </>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-6">
                  {/* Search on mobile */}
                  <div className="relative w-full md:hidden">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      placeholder="Rechercher..." 
                      className="pl-10 pr-4"
                    />
                  </div>
                  
                  {/* Navigation Links */}
                  <nav className="flex flex-col space-y-2">
                    <NavigationLinks 
                      mobile={true} 
                      onLinkClick={() => setIsMenuOpen(false)} 
                    />
                  </nav>

                  {/* User Actions for mobile */}
                  {!currentUser && (
                    <div className="pt-4 border-t">
                      <Button 
                        onClick={() => {
                          navigate('/login');
                          setIsMenuOpen(false);
                        }}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        Connexion
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
