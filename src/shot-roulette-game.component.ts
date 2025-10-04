import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';

const prizes = [
  { id: 'try_again', text: 'Tente de Novo', points: 0, weight: 4, type: 'text' },
  { id: 'points_10', text: '+10 Pontos!', points: 10, weight: 5, type: 'points' },
  { id: 'points_20', text: '+20 Pontos!', points: 20, weight: 3, type: 'points' },
  { id: 'points_50', text: '+50 Pontos!', points: 50, weight: 1.5, type: 'points' },
  { id: 'free_shot', text: 'Shot Grátis!', points: 0, weight: 1, type: 'shot' },
];

@Component({
  selector: 'app-shot-roulette-game',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="text-center p-4">
      <h2 class="text-3xl font-bold mb-2 text-yellow-400">Roleta de Shot</h2>
      <p class="text-gray-300 mb-8">Gire uma vez por dia e ganhe prêmios!</p>

      <div class="flex items-center justify-center my-12">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke-width="1.5" 
            stroke="currentColor" 
            class="w-32 h-32 text-purple-500"
            [class.animate-spin]="isSpinning()">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.5" stroke-width="2" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 2 L12 6" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 18 L12 22" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M2 12 L6 12" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M18 12 L22 12" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.93 4.93 L7.76 7.76" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.24 16.24 L19.07 19.07" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.93 19.07 L7.76 16.24" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.24 7.76 L19.07 4.93" />
            <circle cx="12" cy="12" r="4" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1.5" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          </svg>
      </div>

      @if (canSpin()) {
          <button (click)="handleSpin()" [disabled]="isSpinning()" class="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 px-8 rounded-full text-lg transition-transform duration-300 transform hover:scale-105 animate-pulse">
              {{ isSpinning() ? 'Girando...' : 'Girar a Roleta!' }}
          </button>
      } @else {
          <p class="text-yellow-400 font-semibold text-lg">Você já girou hoje. Volte amanhã para mais uma chance!</p>
      }
    </div>
    
    @if (isModalOpen()) {
      <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50" (click)="isModalOpen.set(false)">
        <div class="bg-gray-800 rounded-lg p-8 m-4 max-w-sm w-full text-center border border-purple-500 shadow-lg" (click)="$event.stopPropagation()">
            @if(result(); as res) {
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-20 h-20 text-yellow-400 mx-auto mb-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
              </svg>
              <h3 class="text-3xl font-bold mb-4 text-white">{{ res.text }}</h3>
              @if (res.type === 'shot') {
                <p class="text-gray-300">Parabéns! Mostre esta tela para o bartender para resgatar seu shot.</p>
              }
              @if (res.type === 'points') {
                <p class="text-gray-300">Os pontos já foram adicionados à sua conta (simulação).</p>
              }
               @if (res.type === 'text') {
                <p class="text-gray-300">Mais sorte da próxima vez!</p>
              }
              <button (click)="isModalOpen.set(false)" class="mt-6 w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-full">
                Fechar
              </button>
            }
        </div>
      </div>
    }
  `
})
export class ShotRouletteGameComponent {
  canSpin = signal(false);
  isSpinning = signal(false);
  result = signal<{ text: string; type: string; points: number } | null>(null);
  isModalOpen = signal(false);

  private lastSpinStorageKey = 'shotRouletteLastSpin_demo';

  constructor() {
    this.checkCanSpin();
  }

  private checkCanSpin() {
    const lastSpinTime = localStorage.getItem(this.lastSpinStorageKey);
    if (!lastSpinTime) {
      this.canSpin.set(true);
      return;
    }

    const now = new Date();
    const lastSpinDate = new Date(parseInt(lastSpinTime, 10));

    now.setHours(0, 0, 0, 0);
    lastSpinDate.setHours(0, 0, 0, 0);

    if (now.getTime() > lastSpinDate.getTime()) {
      this.canSpin.set(true);
    } else {
      this.canSpin.set(false);
    }
  }

  private selectPrize() {
    const totalWeight = prizes.reduce((acc, prize) => acc + prize.weight, 0);
    let random = Math.random() * totalWeight;
    for (const prize of prizes) {
      if (random < prize.weight) {
        return prize;
      }
      random -= prize.weight;
    }
    return prizes[0]; // Fallback
  }

  handleSpin() {
    if (!this.canSpin() || this.isSpinning()) return;

    this.isSpinning.set(true);
    this.result.set(null);

    setTimeout(() => {
      const prize = this.selectPrize();
      this.result.set(prize);
      this.isSpinning.set(false);
      this.isModalOpen.set(true);
      localStorage.setItem(this.lastSpinStorageKey, Date.now().toString());
      this.canSpin.set(false);

      if (prize.type === 'points' && prize.points > 0) {
        // In a real app, this would be a service call.
        console.log(`User won ${prize.points} points.`);
      }
    }, 3000);
  }
}
