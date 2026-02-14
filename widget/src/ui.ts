export function applyBlur(element: HTMLElement): void {
  element.style.filter = 'blur(8px)';
  element.style.pointerEvents = 'none';
  element.style.userSelect = 'none';
  element.classList.add('paywall-locked');
}

export function removeBlur(element: HTMLElement): void {
  element.style.filter = 'none';
  element.style.pointerEvents = 'auto';
  element.style.userSelect = 'auto';
  element.classList.remove('paywall-locked');
  element.classList.add('paywall-unlocked');
  
  const button = element.querySelector('.paywall-unlock-btn');
  if (button) button.remove();
}

export function showUnlockButton(element: HTMLElement, price: number, onUnlock: () => Promise<void>): void {
  const button = document.createElement('button');
  button.className = 'paywall-unlock-btn';
  button.textContent = `Unlock for ${price} STX`;
  button.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 12px 24px;
    background: #5546ff;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    z-index: 1000;
  `;

  button.addEventListener('click', onUnlock);
  
  element.style.position = 'relative';
  element.appendChild(button);
}

export function showLoadingState(element: HTMLElement, message: string): void {
  const button = element.querySelector('.paywall-unlock-btn');
  if (button) {
    button.textContent = message;
    (button as HTMLButtonElement).disabled = true;
  }
}

