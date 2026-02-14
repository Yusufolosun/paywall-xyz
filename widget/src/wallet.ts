import { AppConfig, UserSession, showConnect } from '@stacks/connect';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export async function connectWallet(): Promise<string> {
  return new Promise((resolve, reject) => {
    showConnect({
      appDetails: {
        name: 'PayWall.xyz',
        icon: 'https://paywall.xyz/icon.png',
      },
      redirectTo: '/',
      onFinish: () => {
        const userData = userSession.loadUserData();
        resolve(userData.profile.stxAddress.testnet);
      },
      onCancel: () => {
        reject(new Error('User cancelled wallet connection'));
      },
      userSession,
    });
  });
}

