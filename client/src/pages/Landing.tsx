import { motion } from 'framer-motion';
import { Sprout, Users, TrendingUp, ArrowRight, CheckCircle2, Globe2, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';
import { useTranslation } from '@/lib/i18n';
import { Link } from 'wouter';

export default function Landing() {
  const { locale } = useAppContext();
  const t = useTranslation(locale);

  const features = [
    {
      icon: Globe2,
      title: 'Global Marketplace',
      description: 'Connect with buyers and sellers across India and international markets',
    },
    {
      icon: Shield,
      title: 'Blockchain Escrow',
      description: 'Secure transactions with smart contract-based payment protection',
    },
    {
      icon: TrendingUp,
      title: 'Price Forecasting',
      description: 'AI-powered analytics to predict market trends and optimize pricing',
    },
    {
      icon: Zap,
      title: 'Real-time IoT',
      description: 'Monitor product quality with live sensor data and tracking',
    },
  ];

  const stats = [
    { label: 'Active Traders', value: '2,400+' },
    { label: 'Transactions', value: '₹850Cr+' },
    { label: 'By-Products Listed', value: '15K+' },
    { label: 'Countries Reached', value: '24' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-['Poppins'] text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="text-primary">{t.hero.title}</span>
                <br />
                <span className="text-foreground">{t.hero.subtitle}</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                {t.hero.description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-16"
            >
              {[
                { role: 'farmer', icon: Sprout, label: t.hero.joinFarmer },
                { role: 'processor', icon: Users, label: t.hero.joinProcessor },
                { role: 'buyer', icon: TrendingUp, label: t.hero.joinBuyer },
              ].map((item, index) => (
                <motion.div
                  key={item.role}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Link href="/marketplace">
                    <Card className="h-full hover-elevate active-elevate-2 cursor-pointer transition-all duration-300">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <item.icon className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">{item.label}</h3>
                        <ArrowRight className="h-5 w-5 text-muted-foreground mt-2" />
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Link href="/login">
                <Button size="lg" className="gap-2" data-testid="button-get-started">
                  Get Started <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" data-testid="button-explore-marketplace">
                  Explore Marketplace
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-['Poppins'] text-4xl font-bold mb-4">Platform Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to trade oilseed by-products efficiently and securely
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover-elevate transition-all duration-300">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-primary-foreground/80 text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-['Poppins'] text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Simple steps to start trading</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {[
              { step: 1, title: 'Create Listing', description: 'List your oilseed by-products with quality metrics and IoT data' },
              { step: 2, title: 'Browse & Negotiate', description: 'Explore marketplace, filter products, and negotiate prices directly' },
              { step: 3, title: 'Secure Escrow', description: 'Lock payments in blockchain smart contracts for buyer protection' },
              { step: 4, title: 'Track & Deliver', description: 'Monitor delivery in real-time and release payment upon confirmation' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                  {item.step}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-lg text-muted-foreground">{item.description}</p>
                </div>
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-2" />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/login">
              <Button size="lg" variant="default" className="gap-2" data-testid="button-get-started-now">
                Get Started Now <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
