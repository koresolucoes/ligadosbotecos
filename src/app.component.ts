import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TicTacToeGameComponent } from './tic-tac-toe-game.component';
import { FindTheCupGameComponent } from './find-the-cup-game.component';
import { ShotRouletteGameComponent } from './shot-roulette-game.component';
import { PrivacyPolicyComponent } from './privacy-policy.component';
import { TermsOfUseComponent } from './terms-of-use.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TicTacToeGameComponent, 
    FindTheCupGameComponent, 
    ShotRouletteGameComponent, 
    NgOptimizedImage,
    PrivacyPolicyComponent,
    TermsOfUseComponent
  ]
})
export class AppComponent {
  title = 'Ranking do Copo';
  activeGame = signal<string | null>(null);
  currentPage = signal<'home' | 'privacy' | 'terms'>('home');

  selectGame(game: string | null) {
    this.activeGame.set(game);
  }

  navigateTo(page: 'home' | 'privacy' | 'terms', anchor?: string) {
    this.currentPage.set(page);
    
    // Use a timeout to ensure the DOM is updated before trying to scroll
    setTimeout(() => {
      if (page === 'home' && anchor) {
        const element = document.querySelector(anchor);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        window.scrollTo(0, 0);
      }
    }, 0);
  }
}