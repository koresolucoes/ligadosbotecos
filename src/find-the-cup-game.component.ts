import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';

const CUP_COUNT = 3;
const WIN_POINTS = 25;
const MAX_PLAYS_PER_DAY = 3;

type GameState = 'intro' | 'hint' | 'shuffling' | 'playing' | 'result';
type Cup = { id: number; order: number };
type DailyPlays = { date: string; count: number };

@Component({
  selector: 'app-find-the-cup-game',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div 
        class="flex flex-col items-center w-full p-4 rounded-lg overflow-hidden" 
        style="background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(https://www.transparenttextures.com/patterns/wood-pattern.png), #4a2c2a">

        <div class="text-center mb-8 relative">
            <h2 class="text-3xl font-bold text-brand-accent text-yellow-400">Ache o Copo</h2>
            <p class="text-lg text-gray-300 min-h-[28px] transition-opacity duration-300">{{ gameStateMessage() }}</p>
        </div>
        
        <div class="cup-container w-full h-48 flex justify-center items-end relative">
            @for (cup of cups(); track cup.id) {
                <div
                    class="cup-wrapper"
                    [class.is-winner]="gameState() === 'result' && cup.id === winningCup()"
                    [class.is-loser]="gameState() === 'result' && cup.id !== winningCup() && cup.id === chosenCup()"
                    [class.is-hint]="gameState() === 'hint' && cup.id === winningCup()"
                    [style.left.%]="cup.order * 33.33"
                    [style.transform]="gameState() === 'result' && cup.id === chosenCup() ? 'translateY(-20px)' : 'none'"
                    [style.z-index]="gameState() === 'result' && cup.id === chosenCup() ? 10 : 1"
                >
                    <button
                        (click)="handleCupClick(cup.id)"
                        [disabled]="gameState() !== 'playing'"
                        class="cup-button"
                        [attr.aria-label]="'Copo ' + (cup.id + 1)"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full" viewBox="0 0 100 125" fill="#a16207">
                            <path d="M15,5 H85 L75,110 H25 L15,5 Z" stroke="#663300" stroke-width="3" />
                            <path d="M15,5 Q50,20,85,5" fill="none" stroke="#663300" stroke-width="2" />
                            <ellipse cx="50" cy="110" rx="25" ry="5" fill="#663300" />
                        </svg>
                    </button>
                    <div class="ball"></div>
                    <div class="loser-marker">❌</div>
                </div>
            }
        </div>
        
        <div class="mt-12 h-16">
            @if (gameState() === 'intro' && playsLeft() > 0) {
                <button (click)="startGame()" class="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 px-8 rounded-full text-lg transition-transform duration-300 transform hover:scale-105 animate-pulse">Começar!</button>
            }
            @if (gameState() === 'result') {
                <div class="flex gap-4">
                    @if (playsLeft() > 0) {
                        <button (click)="startGame()" class="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-2 px-6 rounded-full">Jogar Novamente</button>
                    } @else {
                        <p class="text-yellow-400 font-bold self-center">Fim das jogadas por hoje!</p>
                    }
                </div>
            }
            @if (playsLeft() <= 0 && gameState() === 'intro') {
                <div class="text-center p-4">
                    <h2 class="text-xl font-bold mb-4 text-yellow-400">Você já jogou todas as suas chances hoje!</h2>
                    <p class="text-gray-300">Volte amanhã para mais diversão.</p>
                </div>
            }
        </div>
    </div>
  `,
  styles: [`
    .cup-container {
      perspective: 800px;
    }
    .cup-wrapper {
      position: absolute;
      width: 33.33%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: left 0.25s ease-in-out, transform 0.3s ease-in-out;
      transform-style: preserve-3d;
    }
    .cup-button {
      width: 7rem; /* w-28 */
      height: 9rem; /* h-36 */
      transition: transform 0.3s;
      cursor: pointer;
    }
    .cup-button:hover:not(:disabled) {
      transform: translateY(-10px) scale(1.05);
    }
    .ball, .loser-marker {
      position: absolute;
      opacity: 0;
      transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
      pointer-events: none;
    }
    .ball {
      width: 30px;
      height: 30px;
      background-color: #f59e0b; /* amber-500 */
      border-radius: 50%;
      bottom: -15px;
      box-shadow: 0 0 10px #f59e0b;
    }
    .loser-marker {
      font-size: 3rem;
      bottom: 2rem;
    }
    .is-hint {
      transform: translateY(-40px);
    }
    .is-hint .ball {
      opacity: 1;
    }
    .is-winner {
      transform: translateY(-40px);
    }
    .is-winner .ball {
      opacity: 1;
    }
    .is-loser .loser-marker {
      opacity: 1;
    }
  `]
})
export class FindTheCupGameComponent {
  gameState = signal<GameState>('intro');
  cups = signal<Cup[]>(Array.from({ length: CUP_COUNT }, (_, i) => ({ id: i, order: i })));
  winningCup = signal(0);
  chosenCup = signal<number | null>(null);
  playsLeft = signal(MAX_PLAYS_PER_DAY);
  
  private dailyPlaysStorageKey = 'findTheCupPlays_demo';

  constructor() {
    this.updatePlays();
  }

  gameStateMessage = computed(() => {
    switch (this.gameState()) {
      case 'intro': return `Você tem ${this.playsLeft()} jogada(s) restante(s).`;
      case 'hint': return 'Olhe onde está a bola!';
      case 'shuffling': return 'Preste atenção...';
      case 'playing': return 'Onde está a bola?';
      case 'result': return this.chosenCup() === this.winningCup() ? `Você venceu! +${WIN_POINTS} pontos!` : 'Não foi dessa vez!';
      default: return '';
    }
  });

  private updatePlays() {
    const today = new Date().toISOString().split('T')[0];
    const storedData = localStorage.getItem(this.dailyPlaysStorageKey);
    let dailyPlays: DailyPlays = { date: '', count: 0 };
    if (storedData) {
        dailyPlays = JSON.parse(storedData);
    }

    if (dailyPlays.date === today) {
        this.playsLeft.set(Math.max(0, MAX_PLAYS_PER_DAY - dailyPlays.count));
    } else {
        localStorage.setItem(this.dailyPlaysStorageKey, JSON.stringify({ date: today, count: 0 }));
        this.playsLeft.set(MAX_PLAYS_PER_DAY);
    }
  }

  startGame() {
    if (this.playsLeft() <= 0) return;
    this.gameState.set('hint');
    this.chosenCup.set(null);
    this.cups.set(Array.from({ length: CUP_COUNT }, (_, i) => ({ id: i, order: i })));
    this.winningCup.set(Math.floor(Math.random() * CUP_COUNT));

    setTimeout(() => {
        this.gameState.set('shuffling');
        let shuffleCount = 0;
        const interval = setInterval(() => {
            this.cups.update(prevCups => {
                const newCups = [...prevCups];
                const i = Math.floor(Math.random() * CUP_COUNT);
                let j = Math.floor(Math.random() * CUP_COUNT);
                while(i === j) { j = Math.floor(Math.random() * CUP_COUNT); }
                [newCups[i].order, newCups[j].order] = [newCups[j].order, newCups[i].order];
                return newCups;
            });
            shuffleCount++;
            if (shuffleCount >= 10) {
                clearInterval(interval);
                this.gameState.set('playing');
            }
        }, 250);
    }, 1500);
  }
  
  handleCupClick(cupId: number) {
    if (this.gameState() !== 'playing') return;
    this.chosenCup.set(cupId);
    this.gameState.set('result');
    
    // In a real app, this would be a service call.
    // For the demo, we just show a message.
    if (cupId === this.winningCup()) {
        console.log(`User won ${WIN_POINTS} points.`);
    }
    
    const today = new Date().toISOString().split('T')[0];
    const storedData = localStorage.getItem(this.dailyPlaysStorageKey);
    let dailyPlays: DailyPlays = { date: '', count: 0 };
    if (storedData) dailyPlays = JSON.parse(storedData);

    const newCount = dailyPlays.date === today ? dailyPlays.count + 1 : 1;
    localStorage.setItem(this.dailyPlaysStorageKey, JSON.stringify({ date: today, count: newCount }));
    this.playsLeft.update(p => p - 1);
  }
}
