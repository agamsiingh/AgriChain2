import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sprout, Mail, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';
import { useLocation } from 'wouter';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Login() {
  const [, navigate] = useLocation();
  const { setCurrentUser } = useAppContext();
  const [step, setStep] = useState<'email' | 'otp' | 'role'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [role, setRole] = useState('farmer');

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setStep('otp');
    }
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock OTP verification - any 6-digit code works
    if (otp.length === 6) {
      setStep('role');
    }
  };

  const handleSelectRole = () => {
    // Create mock user based on role
    const user = {
      id: 'mock-user-' + Date.now(),
      email,
      name: role === 'farmer' ? 'Ramesh Kumar' : role === 'processor' ? 'Hind Agro' : 'DairyPro Foods',
      role,
      rating: 4.6,
      phone: '+91 98765 43210',
      location: 'Varanasi, UP',
      createdAt: new Date(),
    };

    setCurrentUser(user);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
            <Sprout className="h-8 w-8 text-primary-foreground" />
          </div>
          <span className="font-['Poppins'] text-2xl font-bold">FarmShield</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 'email' && 'Welcome Back'}
              {step === 'otp' && 'Verify OTP'}
              {step === 'role' && 'Select Your Role'}
            </CardTitle>
            <CardDescription>
              {step === 'email' && 'Enter your email to receive a one-time password'}
              {step === 'otp' && 'Enter the 6-digit code sent to your email'}
              {step === 'role' && 'Choose your role to continue'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'email' && (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    data-testid="input-email"
                  />
                </div>
                <Button type="submit" className="w-full gap-2" data-testid="button-send-otp">
                  <Mail className="h-5 w-5" />
                  Send OTP
                </Button>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <Label htmlFor="otp">One-Time Password</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    required
                    data-testid="input-otp"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Demo: Enter any 6-digit code
                  </p>
                </div>
                <Button type="submit" className="w-full gap-2" data-testid="button-verify-otp">
                  <Check className="h-5 w-5" />
                  Verify OTP
                </Button>
              </form>
            )}

            {step === 'role' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="role">Select Your Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger id="role" data-testid="select-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent data-testid="select-role-content">
                      <SelectItem value="farmer" data-testid="select-role-farmer">Farmer</SelectItem>
                      <SelectItem value="processor" data-testid="select-role-processor">Processor</SelectItem>
                      <SelectItem value="buyer" data-testid="select-role-buyer">Buyer</SelectItem>
                      <SelectItem value="admin" data-testid="select-role-admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSelectRole} className="w-full" data-testid="button-continue">
                  Continue to Dashboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
