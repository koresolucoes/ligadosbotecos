import { Component, ChangeDetectionStrategy, signal, OnInit, OnDestroy, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TicTacToeGameComponent } from './tic-tac-toe-game.component';
import { FindTheCupGameComponent } from './find-the-cup-game.component';
import { ShotRouletteGameComponent } from './shot-roulette-game.component';
import { PrivacyPolicyComponent } from './privacy-policy.component';
import { TermsOfUseComponent } from './terms-of-use.component';
import { SupabaseService } from './supabase.service';

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
export class AppComponent implements OnInit, OnDestroy {
  title = 'A Liga dos Botecos';
  activeGame = signal<string | null>(null);
  currentPage = signal<'home' | 'privacy' | 'terms'>('home');
  isMenuOpen = signal(false);

  // Form signals
  name = signal('');
  email = signal('');
  barName = signal('');
  formSubmitted = signal(false);
  formError = signal<string | null>(null);
  isLoading = signal(false);

  // Countdown signals
  days = signal(0);
  hours = signal(0);
  minutes = signal(0);
  seconds = signal(0);

  private intervalId: any;
  private supabaseService = inject(SupabaseService);

  ngOnInit() {
    this.startCountdown();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startCountdown() {
    // Set a launch date 30 days from now
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 30);
    const launchTime = launchDate.getTime();

    this.intervalId = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchTime - now;

      if (distance < 0) {
        clearInterval(this.intervalId);
        this.days.set(0);
        this.hours.set(0);
        this.minutes.set(0);
        this.seconds.set(0);
        return;
      }

      this.days.set(Math.floor(distance / (1000 * 60 * 60 * 24)));
      this.hours.set(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      this.minutes.set(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
      this.seconds.set(Math.floor((distance % (1000 * 60)) / 1000));
    }, 1000);
  }

  selectGame(game: string | null) {
    this.activeGame.set(game);
  }

  toggleMenu() {
    this.isMenuOpen.update(open => !open);
  }

  closeMenuAndNavigate(page: 'home' | 'privacy' | 'terms', anchor?: string) {
    this.isMenuOpen.set(false);
    this.navigateTo(page, anchor);
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

  async onSubmit() {
    this.formError.set(null);
    if (!this.name().trim() || !this.email().trim() || !this.barName().trim()) {
      this.formError.set('Todos os campos são obrigatórios.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email())) {
      this.formError.set('Por favor, insira um e-mail válido.');
      return;
    }

    this.isLoading.set(true);

    try {
      await this.supabaseService.addToWaitingList(
        this.name(),
        this.email(),
        this.barName()
      );
      this.formSubmitted.set(true);
    } catch (error) {
      if (error instanceof Error) {
        this.formError.set(error.message);
      } else {
        this.formError.set('Ocorreu um erro desconhecido ao enviar o formulário.');
      }
    } finally {
      this.isLoading.set(false);
    }
  }
}