import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Check, Loader2, ExternalLink } from 'lucide-react';
import { escrowSimulator, type EscrowTransaction } from '@/lib/escrowSimulator';

interface EscrowModalProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  onConfirm: (txHash: string) => void;
}

export function EscrowModal({ open, onClose, amount, onConfirm }: EscrowModalProps) {
  const [stage, setStage] = useState<'initial' | 'signing' | 'confirming' | 'confirmed'>('initial');
  const [tx, setTx] = useState<EscrowTransaction | null>(null);
  const [confirmations, setConfirmations] = useState(0);

  const handleStartEscrow = async () => {
    setStage('signing');

    try {
      const transaction = await escrowSimulator.createEscrow(amount, '', '');
      setTx(transaction);
      setStage('confirming');

      await escrowSimulator.simulateConfirmations(transaction, (count) => {
        setConfirmations(count);
      });

      setStage('confirmed');
      onConfirm(transaction.txHash);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        onClose();
        resetState();
      }, 3000);
    } catch (error) {
      console.error('Escrow error:', error);
      setStage('initial');
    }
  };

  const resetState = () => {
    setStage('initial');
    setTx(null);
    setConfirmations(0);
  };

  const handleClose = () => {
    if (stage !== 'signing' && stage !== 'confirming') {
      onClose();
      resetState();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-escrow">
        <DialogHeader>
          <DialogTitle>Blockchain Escrow</DialogTitle>
          <DialogDescription>
            Secure payment using smart contract escrow
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <AnimatePresence mode="wait">
            {stage === 'initial' && (
              <motion.div
                key="initial"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Escrow Amount</span>
                    <span className="font-bold">₹{amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Network Fee (estimated)</span>
                    <span className="font-medium">₹45</span>
                  </div>
                  <div className="pt-2 border-t border-border flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg">₹{(amount + 45).toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Funds will be locked in smart contract</p>
                  <p>• Released automatically upon delivery confirmation</p>
                  <p>• Full refund protection for buyers</p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleClose} className="flex-1" data-testid="button-cancel-escrow">
                    Cancel
                  </Button>
                  <Button onClick={handleStartEscrow} className="flex-1" data-testid="button-start-escrow">
                    Start Escrow
                  </Button>
                </div>
              </motion.div>
            )}

            {stage === 'signing' && (
              <motion.div
                key="signing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center py-8 space-y-4"
              >
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-lg font-medium">Signing transaction...</p>
                <p className="text-sm text-muted-foreground">Please wait while we process your request</p>
              </motion.div>
            )}

            {stage === 'confirming' && tx && (
              <motion.div
                key="confirming"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-center py-4">
                  <div className="relative">
                    <Loader2 className="h-16 w-16 animate-spin text-primary" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">{confirmations}/3</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Confirmations</span>
                    <span className="font-medium">{confirmations} / 3</span>
                  </div>
                  <Progress value={(confirmations / 3) * 100} className="h-2" />
                </div>

                <div className="p-4 bg-muted rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction Hash</span>
                    <span className="font-mono text-xs">{escrowSimulator.formatAddress(tx.txHash)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="text-amber-600 dark:text-amber-400 font-medium">Pending</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Waiting for blockchain confirmations...
                </p>
              </motion.div>
            )}

            {stage === 'confirmed' && tx && (
              <motion.div
                key="confirmed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-4"
              >
                <div className="flex flex-col items-center justify-center py-6 space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
                  >
                    <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-green-600 dark:text-green-400">Escrow Confirmed!</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Your payment is secured in the smart contract
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-lg space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction Hash</span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-xs">{escrowSimulator.formatAddress(tx.txHash)}</span>
                      <ExternalLink className="h-3 w-3" />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Confirmations</span>
                    <span className="font-bold text-green-600 dark:text-green-400">3/3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gas Fee</span>
                    <span className="font-medium">{tx.gasFee} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Timestamp</span>
                    <span className="font-medium">{new Date(tx.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
