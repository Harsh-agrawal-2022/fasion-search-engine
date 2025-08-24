import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, BarChart3, Home, Moon, Sun, Menu, X, LogIn, UserPlus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navigation = ({ darkMode, toggleDarkMode }: NavigationProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: Home, protected: false },
    { path: '/search', label: 'Search', icon: Search, protected: true },
    { path: '/compare', label: 'Compare', icon: BarChart3, protected: true },
  
  ];

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true);
    }
  }, [navigate]);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const handleProtectedNavigation = (path: string, protectedRoute: boolean) => {
    if (protectedRoute && !isLoggedIn) {
      alert('Please login to access this page.');
      return;
    }
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-8 h-8 bg-fashion-gradient rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-fashion-gradient bg-clip-text text-transparent">
              Ayaada
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ path, label, icon: Icon, protected: isProtected }) => (
              <button
                key={path}
                onClick={() => handleProtectedNavigation(path, isProtected)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                  isActive(path)
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>

          {/* Dark Mode Toggle & Auth Buttons & Mobile Menu */}
          <div className="flex items-center space-x-2">
            {/* Authentication Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              {isLoggedIn ? (
                <Button size="sm" variant="ghost" className="flex items-center space-x-1" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                      <LogIn className="w-4 h-4" />
                      <span>Login</span>
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm" className="flex items-center space-x-1">
                      <UserPlus className="w-4 h-4" />
                      <span>Sign Up</span>
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full hover:bg-accent"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="px-4 py-4 space-y-2">
            {navItems.map(({ path, label, icon: Icon, protected: isProtected }) => (
              <button
                key={path}
                onClick={() => handleProtectedNavigation(path, isProtected)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all w-full text-left ${
                  isActive(path)
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
              </button>
            ))}

            {/* Mobile Auth Buttons */}
            <div className="pt-4 border-t border-border space-y-2">
              {isLoggedIn ? (
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex items-center space-x-3 px-4 py-3 w-full justify-start"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </Button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all hover:bg-accent hover:text-accent-foreground"
                  >
                    <LogIn className="w-5 h-5" />
                    <span className="font-medium">Login</span>
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span className="font-medium">Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
