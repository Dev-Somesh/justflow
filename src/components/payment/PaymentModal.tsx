import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CreditCard, 
  Calendar, 
  Lock, 
  CheckCircle2
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    name: string;
    price: string;
    billing: string;
  };
}

const PaymentModal = ({ isOpen, onClose, plan }: PaymentModalProps) => {
  const { toast } = useToast();
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Show success toast
      toast({
        title: "Payment Successful",
        description: `You've successfully subscribed to the ${plan.name} plan.`,
        variant: "default",
      });
      
      // Reset form after 2 seconds and close modal
      setTimeout(() => {
        resetForm();
        onClose();
      }, 2000);
    }, 1500);
  };

  const resetForm = () => {
    setCardNumber('');
    setCardName('');
    setExpiryDate('');
    setCvv('');
    setIsSuccess(false);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    
    setExpiryDate(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isSuccess ? 'Payment Successful!' : 'Complete Your Payment'}</DialogTitle>
          <DialogDescription>
            {isSuccess 
              ? `Thank you for subscribing to the ${plan.name} plan.`
              : `Subscribe to the ${plan.name} plan for ${plan.price} per user/month, billed ${plan.billing}.`
            }
          </DialogDescription>
        </DialogHeader>
        
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <p className="text-lg font-medium text-center">Your payment has been processed successfully</p>
            <p className="text-gray-500 text-center mt-2">You'll receive a confirmation email shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="cardNumber"
                    placeholder="4111 1111 1111 1111"
                    className="pl-10"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    maxLength={19}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      className="pl-10"
                      value={expiryDate}
                      onChange={handleExpiryDateChange}
                      maxLength={5}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      id="cvv"
                      type="password"
                      placeholder="123"
                      className="pl-10"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      maxLength={3}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Plan</span>
                <span className="font-medium">{plan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price</span>
                <span className="font-medium">{plan.price} per user/month</span>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 flex items-center">
              <Lock size={12} className="mr-1" />
              Your payment information is secure and encrypted
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isProcessing}
                className="min-w-[120px]"
              >
                {isProcessing ? 'Processing...' : 'Pay Now'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
