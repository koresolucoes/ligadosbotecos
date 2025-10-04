import { Component, ChangeDetectionStrategy, signal, computed, effect } from '@angular/core';

const PLAYER = 'X';
const AI = 'O';

function calculateWinner(squares: (string | null)[]) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  if (squares.every(square => square)) {
    return { winner: 'T', line: null }; // T for Tie
  }
  return null;
}

@Component({
  selector: 'app-tic-tac-toe-game',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center w-full p-4">
      <h2 class="text-3xl font-bold text-yellow-400 mb-2">Jogo da Velha</h2>
      
      <div class="flex justify-around w-full max-w-xs my-4 text-lg">
        <div class="text-center">
            <div class="font-bold text-emerald-300">Você (X)</div>
            <div class="text-2xl font-black">{{ scores().player }}</div>
        </div>
        <div class="text-center">
            <div class="font-bold text-red-300">IA (O)</div>
            <div class="text-2xl font-black">{{ scores().ai }}</div>
        </div>
      </div>
      
      <div class="w-full max-w-xs aspect-square tic-tac-toe-board">
        @for(value of board(); track $index) {
          <button
            (click)="handlePlay($index)"
            [disabled]="!!value || !!winnerInfo()"
            class="tic-tac-toe-cell"
            [class.x]="value === 'X'"
            [class.o]="value === 'O'"
            [class.winner]="winnerInfo()?.line?.includes($index)"
            [attr.aria-label]="'Posição ' + ($index + 1)"
          ></button>
        }
      </div>

      <div class="mt-6 text-center h-16 flex flex-col justify-center">
        <p class="text-xl font-semibold min-h-[28px] text-gray-300">{{ statusMessage() }}</p>
        @if (winnerInfo()) {
            <button (click)="resetBoard()" class="mt-4 px-6 py-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold rounded-full">
                Jogar Novamente
            </button>
        }
      </div>
    </div>
  `,
  styles: [`
    .tic-tac-toe-board {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }
    .tic-tac-toe-cell {
      width: 100%;
      aspect-ratio: 1 / 1;
      position: relative;
      background-color: #374151; /* bg-gray-700 */
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .tic-tac-toe-cell:hover:not(:disabled) {
      background-color: #4b5563; /* bg-gray-600 */
    }
    .tic-tac-toe-cell:disabled {
      cursor: not-allowed;
    }
    .tic-tac-toe-cell::before,
    .tic-tac-toe-cell::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%) scale(0);
      background-color: white;
      transition: transform 0.3s ease;
    }
    .tic-tac-toe-cell.x::before, .tic-tac-toe-cell.x::after {
      width: 80%;
      height: 15%;
      border-radius: 10px;
      background-color: #34d399; /* emerald-400 */
      transform: translate(-50%, -50%) scale(1) rotate(45deg);
    }
    .tic-tac-toe-cell.x::after {
      transform: translate(-50%, -50%) scale(1) rotate(-45deg);
    }
    .tic-tac-toe-cell.o::before {
      width: 70%;
      height: 70%;
      border-radius: 50%;
      border: 12px solid #f87171; /* red-400 */
      background-color: transparent;
      transform: translate(-50%, -50%) scale(1);
    }
    .tic-tac-toe-cell.winner {
      background-color: #ca8a04; /* yellow-600 */
    }
  `]
})
export class TicTacToeGameComponent {
  board = signal<(string | null)[]> (Array(9).fill(null));
  playerIsNext = signal(true);
  scores = signal({ player: 0, ai: 0 });

  winnerInfo = computed(() => calculateWinner(this.board()));
  
  statusMessage = computed(() => {
    const winner = this.winnerInfo();
    if (winner) {
      if (winner.winner === 'T') return 'Empate!';
      return winner.winner === PLAYER ? 'Você Venceu!' : 'A IA Venceu!';
    }
    return this.playerIsNext() ? 'Sua vez de jogar' : 'IA está pensando...';
  });

  constructor() {
    effect((onCleanup) => {
      const winner = this.winnerInfo();
      const isNext = this.playerIsNext();
      
      if(winner) {
          if (winner.winner === PLAYER) {
              this.scores.update(s => ({...s, player: s.player + 1}));
          } else if (winner.winner === AI) {
              this.scores.update(s => ({...s, ai: s.ai + 1}));
          }
          return;
      }

      if (!isNext) {
        const timeout = setTimeout(() => {
          this.makeAiMove();
        }, 600);
        onCleanup(() => clearTimeout(timeout));
      }
    }, { allowSignalWrites: true });
  }

  resetBoard() {
    this.board.set(Array(9).fill(null));
    this.playerIsNext.set(true);
  }

  handlePlay(index: number) {
    if (this.winnerInfo() || this.board()[index] || !this.playerIsNext()) {
      return;
    }
    this.board.update(b => {
      const newBoard = b.slice();
      newBoard[index] = PLAYER;
      return newBoard;
    });
    this.playerIsNext.set(false);
  }
  
  private makeAiMove() {
      const currentBoard = this.board();
      // 1. Check if AI can win
      for (let i = 0; i < 9; i++) {
        if (!currentBoard[i]) {
          const tempBoard = currentBoard.slice();
          tempBoard[i] = AI;
          if (calculateWinner(tempBoard)?.winner === AI) {
            this.updateBoardForAI(i);
            return;
          }
        }
      }
      // 2. Check if player can win and block
      for (let i = 0; i < 9; i++) {
        if (!currentBoard[i]) {
          const tempBoard = currentBoard.slice();
          tempBoard[i] = PLAYER;
          if (calculateWinner(tempBoard)?.winner === PLAYER) {
            this.updateBoardForAI(i);
            return;
          }
        }
      }
      // 3. Take center if available
      if (!currentBoard[4]) {
          this.updateBoardForAI(4);
          return;
      }
      // 4. Take a random corner
      const corners = [0, 2, 6, 8].filter(i => !currentBoard[i]);
      if (corners.length > 0) {
          this.updateBoardForAI(corners[Math.floor(Math.random() * corners.length)]);
          return;
      }
      // 5. Take any available spot
      const emptySpots = currentBoard.map((val, idx) => val === null ? idx : null).filter((val): val is number => val !== null);
      if(emptySpots.length > 0) {
        this.updateBoardForAI(emptySpots[Math.floor(Math.random() * emptySpots.length)]);
      }
  }

  private updateBoardForAI(index: number) {
      this.board.update(b => {
          const newBoard = b.slice();
          newBoard[index] = AI;
          return newBoard;
      });
      this.playerIsNext.set(true);
  }
}