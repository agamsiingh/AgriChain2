import { ethers } from 'ethers';

export interface EscrowTransaction {
  txHash: string;
  from: string;
  to: string;
  amount: string;
  gasFee: string;
  timestamp: string;
  confirmations: number;
  status: 'pending' | 'confirmed';
}

export class EscrowSimulator {
  private provider: ethers.JsonRpcProvider;

  constructor() {
    this.provider = new ethers.JsonRpcProvider('https://mock-rpc.local');
  }

  async createEscrow(amount: number, buyerAddress: string, sellerAddress: string): Promise<EscrowTransaction> {
    // Simulate signing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const txHash = '0x' + Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    const tx: EscrowTransaction = {
      txHash,
      from: buyerAddress || '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      to: sellerAddress || '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      amount: ethers.formatEther(ethers.parseEther(amount.toString())),
      gasFee: (Math.random() * 0.001 + 0.0005).toFixed(6),
      timestamp: new Date().toISOString(),
      confirmations: 0,
      status: 'pending',
    };

    return tx;
  }

  async simulateConfirmations(
    tx: EscrowTransaction,
    onProgress: (confirmations: number) => void
  ): Promise<EscrowTransaction> {
    for (let i = 1; i <= 3; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onProgress(i);
    }

    return {
      ...tx,
      confirmations: 3,
      status: 'confirmed',
    };
  }

  formatAddress(address: string): string {
    if (address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
}

export const escrowSimulator = new EscrowSimulator();
