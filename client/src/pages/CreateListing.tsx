import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';

export default function CreateListing() {
  const [step, setStep] = useState(1);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    type: 'soymeal',
    grade: '',
    quantityKg: '',
    pricePerTon: '',
    location: { lat: 25.3176, lng: 82.9739, address: '' },
    quality: { moisture_pct: '', ash_pct: '', oil_pct: '' },
    iotDeviceId: '',
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/listings', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/listings'] });
      toast({
        title: 'Success!',
        description: 'Your listing has been created successfully',
      });
      navigate('/marketplace');
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create listing. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = () => {
    createMutation.mutate({
      ...formData,
      quantityKg: parseInt(formData.quantityKg),
      pricePerTon: parseInt(formData.pricePerTon),
      quality: {
        moisture_pct: parseFloat(formData.quality.moisture_pct),
        ash_pct: parseFloat(formData.quality.ash_pct),
        oil_pct: parseFloat(formData.quality.oil_pct),
      },
      sellerId: 'mock-user-id',
      images: [],
      status: 'available',
    });
  };

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="font-['Poppins'] text-4xl font-bold mb-2">Create Listing</h1>
          <p className="text-muted-foreground">List your oilseed by-products in 3 easy steps</p>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="mb-4 flex justify-between text-sm">
              <span className="font-medium">Step {step} of {totalSteps}</span>
              <span className="text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
            
            <div className="mt-6 grid grid-cols-3 gap-4">
              {['Basic Info', 'Quality Metrics', 'Review'].map((label, idx) => (
                <div key={label} className="flex flex-col items-center">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center font-bold mb-2 ${
                      step > idx + 1
                        ? 'bg-primary text-primary-foreground'
                        : step === idx + 1
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step > idx + 1 ? <Check className="h-5 w-5" /> : idx + 1}
                  </div>
                  <span className="text-xs text-center">{label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && 'Basic Information'}
              {step === 2 && 'Quality Metrics'}
              {step === 3 && 'Review & Submit'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <>
                <div>
                  <Label htmlFor="title">Product Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Soymeal (48% protein) - Bulk"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    data-testid="input-title"
                  />
                </div>

                <div>
                  <Label htmlFor="type">Product Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger id="type" data-testid="select-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="soymeal">Soymeal</SelectItem>
                      <SelectItem value="sunflower_cake">Sunflower Cake</SelectItem>
                      <SelectItem value="husk">Husk</SelectItem>
                      <SelectItem value="specialty">Specialty By-products</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="grade">Grade</Label>
                  <Input
                    id="grade"
                    placeholder="e.g., 48% Protein"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    data-testid="input-grade"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity">Quantity (kg)</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="12000"
                      value={formData.quantityKg}
                      onChange={(e) => setFormData({ ...formData, quantityKg: e.target.value })}
                      data-testid="input-quantity"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price per Ton (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="42000"
                      value={formData.pricePerTon}
                      onChange={(e) => setFormData({ ...formData, pricePerTon: e.target.value })}
                      data-testid="input-price"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Location</Label>
                  <Input
                    id="address"
                    placeholder="City, State"
                    value={formData.location.address}
                    onChange={(e) =>
                      setFormData({ ...formData, location: { ...formData.location, address: e.target.value } })
                    }
                    data-testid="input-address"
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="moisture">Moisture (%)</Label>
                    <Input
                      id="moisture"
                      type="number"
                      step="0.1"
                      placeholder="9.2"
                      value={formData.quality.moisture_pct}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          quality: { ...formData.quality, moisture_pct: e.target.value },
                        })
                      }
                      data-testid="input-moisture"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ash">Ash Content (%)</Label>
                    <Input
                      id="ash"
                      type="number"
                      step="0.1"
                      placeholder="6.5"
                      value={formData.quality.ash_pct}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          quality: { ...formData.quality, ash_pct: e.target.value },
                        })
                      }
                      data-testid="input-ash"
                    />
                  </div>
                  <div>
                    <Label htmlFor="oil">Oil Content (%)</Label>
                    <Input
                      id="oil"
                      type="number"
                      step="0.1"
                      placeholder="1.5"
                      value={formData.quality.oil_pct}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          quality: { ...formData.quality, oil_pct: e.target.value },
                        })
                      }
                      data-testid="input-oil"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="iot">IoT Device ID (Optional)</Label>
                  <Input
                    id="iot"
                    placeholder="SENSOR-8891"
                    value={formData.iotDeviceId}
                    onChange={(e) => setFormData({ ...formData, iotDeviceId: e.target.value })}
                    data-testid="input-iot-device"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Attach a sensor to provide real-time quality monitoring
                  </p>
                </div>

                <div>
                  <Label>Product Images</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Product</span>
                    <span className="font-semibold">{formData.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-semibold capitalize">{formData.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Grade</span>
                    <span className="font-semibold">{formData.grade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity</span>
                    <span className="font-semibold">{(parseInt(formData.quantityKg) / 1000).toFixed(1)} tons</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-bold text-lg">₹{parseInt(formData.pricePerTon).toLocaleString()} / ton</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-semibold">{formData.location.address}</span>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-3">Quality Metrics</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">{formData.quality.moisture_pct}%</div>
                      <div className="text-sm text-muted-foreground">Moisture</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{formData.quality.ash_pct}%</div>
                      <div className="text-sm text-muted-foreground">Ash</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{formData.quality.oil_pct}%</div>
                      <div className="text-sm text-muted-foreground">Oil</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-6 border-t border-border">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)} data-testid="button-previous">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Previous
                </Button>
              )}
              {step < totalSteps ? (
                <Button onClick={() => setStep(step + 1)} className="ml-auto" data-testid="button-next">
                  Next
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="ml-auto"
                  disabled={createMutation.isPending}
                  data-testid="button-submit"
                >
                  {createMutation.isPending ? 'Creating...' : 'Publish Listing'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
