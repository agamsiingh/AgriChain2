import { Link, useLocation } from 'wouter';
import { Sprout, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { useAppContext } from '@/contexts/AppContext';
import { useTranslation } from '@/lib/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const [location] = useLocation();
  const { currentUser, locale } = useAppContext();
  const t = useTranslation(locale);

  const navItems = [
    { path: '/marketplace', label: t.nav.marketplace },
    { path: '/dashboard', label: t.nav.dashboard },
    { path: '/analytics', label: t.nav.analytics },
    { path: '/iot', label: t.nav.iot },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center gap-2 hover:opacity-80 transition-opacity" data-testid="link-home">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Sprout className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-['Poppins'] text-xl font-bold hidden sm:inline">FarmShield</span>
          </a>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <Button
                variant={location === item.path ? 'secondary' : 'ghost'}
                data-testid={`nav-${item.path.slice(1)}`}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link href="/create-listing">
            <Button size="default" className="hidden sm:flex" data-testid="button-create-listing-header">
              + New Listing
            </Button>
          </Link>
          
          <ThemeToggle />
          <LanguageToggle />

          {/* Mobile Menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {navItems.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <DropdownMenuItem>{item.label}</DropdownMenuItem>
                  </Link>
                ))}
                <Link href="/create-listing">
                  <DropdownMenuItem>Create Listing</DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
