import { connectWallet } from './wallet';
import { unlockContent } from './payment';
import { verifyTransaction } from './verification';
import { applyBlur, removeBlur, showUnlockButton, showLoadingState } from './ui';

interface PaywallConfig {
  contractAddress: string;
  network: 'testnet' | 'mainnet';
}

export class PaywallWidget {
  private config: PaywallConfig;
  private userAddress: string | null = null;

  constructor(config: PaywallConfig) {
    this.config = config;
  }

  async init(): Promise<void> {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initWidget());
    } else {
      await this.initWidget();
    }
  }

  private async initWidget(): Promise<void> {
    const paywallElements = document.querySelectorAll('[data-paywall-id]');
    
    paywallElements.forEach((element) => {
      const contentId = element.getAttribute('data-paywall-id');
      const price = element.getAttribute('data-paywall-price');
      
      if (!contentId || !price) return;
      
      this.setupPaywall(element as HTMLElement, parseInt(contentId), parseFloat(price));
    });
  }

  private async setupPaywall(element: HTMLElement, contentId: number, price: number): Promise<void> {
    const cached = localStorage.getItem(`paywall_${contentId}_${this.userAddress}`);
    if (cached === 'unlocked') {
      return;
    }

    applyBlur(element);
    showUnlockButton(element, price, async () => {
      await this.handleUnlock(element, contentId, price);
    });
  }

  private async handleUnlock(element: HTMLElement, contentId: number, price: number): Promise<void> {
    try {
      showLoadingState(element, 'Connecting wallet...');
      
      if (!this.userAddress) {
        this.userAddress = await connectWallet();
      }

      showLoadingState(element, 'Processing payment...');
      const txId = await unlockContent(contentId, price, this.config.contractAddress, this.config.network);

      showLoadingState(element, 'Verifying transaction...');
      const verified = await verifyTransaction(txId, this.config.network);

      if (verified) {
        localStorage.setItem(`paywall_${contentId}_${this.userAddress}`, 'unlocked');
        removeBlur(element);
      } else {
        throw new Error('Transaction verification failed');
      }
    } catch (error) {
      alert(`Failed to unlock content: ${(error as Error).message}`);
    }
  }
}

if (typeof window !== 'undefined') {
  (window as any).PaywallWidget = PaywallWidget;
}

