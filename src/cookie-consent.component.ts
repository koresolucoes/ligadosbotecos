import { Component, ChangeDetectionStrategy, signal, OnInit, output } from '@angular/core';

@Component({
  selector: 'app-cookie-consent',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isVisible()) {
      <div class="fixed bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur-sm border-t border-slate-700 p-4 z-[100] animate-fade-in-up">
        <div class="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-sm text-gray-300 text-center sm:text-left">
            Usamos cookies para analisar o tráfego do site e aprimorar sua experiência. Ao continuar, você concorda com nosso uso de cookies e com nossa 
            <a href="#privacy" (click)="$event.preventDefault(); navigateToPrivacy.emit()" class="font-semibold text-yellow-400 hover:underline">
              Política de Privacidade
            </a>.
          </p>
          <button (click)="accept()" class="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-2 px-6 rounded-full transition-colors duration-300 flex-shrink-0">
            Entendi
          </button>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.5s ease-out forwards;
    }
  `]
})
export class CookieConsentComponent implements OnInit {
  isVisible = signal(false);
  navigateToPrivacy = output<void>();

  private readonly consentKey = 'cookie_consent_ligadosbotecos';

  ngOnInit() {
    try {
      if (localStorage.getItem(this.consentKey) !== 'true') {
        this.isVisible.set(true);
      }
    } catch (e) {
      console.error('Could not access localStorage:', e);
      // If localStorage is disabled, show the banner anyway.
      this.isVisible.set(true);
    }
  }

  accept() {
    try {
      localStorage.setItem(this.consentKey, 'true');
    } catch (e) {
      console.error('Could not access localStorage:', e);
    }
    this.isVisible.set(false);
  }
}
