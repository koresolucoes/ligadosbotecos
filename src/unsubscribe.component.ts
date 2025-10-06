import { Component, ChangeDetectionStrategy, signal, inject, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from './supabase.service';

@Component({
  selector: 'app-unsubscribe',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="relative py-20 bg-slate-800 min-h-screen flex items-center justify-center">
        <div class="container mx-auto px-6">
            <div class="max-w-lg mx-auto bg-gray-900 rounded-lg p-8 md:p-12 shadow-2xl text-center">
                @switch (status()) {
                    @case ('idle') {
                        <span class="material-symbols-outlined text-6xl text-yellow-400 mb-4">unsubscribe</span>
                        <h1 class="text-3xl font-bold text-white mb-4">Cancelar Inscrição</h1>
                        <p class="text-gray-400 mb-8">
                            Tem certeza de que deseja remover seu e-mail da nossa lista de espera de Bares Fundadores? Você perderá o acesso VIP e as vantagens exclusivas.
                        </p>
                        <form (ngSubmit)="onUnsubscribe()" class="space-y-4">
                            <div>
                                <input 
                                    type="email" 
                                    placeholder="Seu e-mail" 
                                    [ngModel]="email()"
                                    (ngModelChange)="email.set($event)"
                                    name="email"
                                    class="w-full bg-gray-800 border border-gray-600 rounded-md p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
                                    required>
                            </div>
                            <button type="submit"
                                    class="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform duration-300 transform hover:scale-105">
                                Sim, quero cancelar
                            </button>
                        </form>
                    }
                    @case ('loading') {
                        <div class="flex justify-center items-center h-48">
                            <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400"></div>
                        </div>
                        <p class="text-gray-300 mt-4">Processando sua solicitação...</p>
                    }
                    @case ('success') {
                        <span class="material-symbols-outlined text-6xl text-green-400 mb-4">task_alt</span>
                        <h2 class="text-2xl font-bold text-white mb-2">Inscrição Cancelada</h2>
                        <p class="text-gray-300">
                            Seu e-mail foi removido com sucesso da nossa lista. Sentiremos sua falta!
                        </p>
                        <a href="#" (click)="$event.preventDefault(); back.emit()" class="mt-8 inline-block text-yellow-400 hover:text-yellow-300">Voltar para o site</a>
                    }
                    @case ('error') {
                        <span class="material-symbols-outlined text-6xl text-red-400 mb-4">error</span>
                        <h2 class="text-2xl font-bold text-white mb-2">Ocorreu um Erro</h2>
                        <p class="text-red-300 mb-6">{{ errorMessage() }}</p>
                        <button (click)="status.set('idle')" class="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-2 px-6 rounded-full">
                            Tentar Novamente
                        </button>
                    }
                }
            </div>
        </div>
    </main>
  `
})
export class UnsubscribeComponent implements OnInit {
    back = output<void>();
    private supabaseService = inject(SupabaseService);
    
    email = signal('');
    status = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
    errorMessage = signal<string | null>(null);

    ngOnInit() {
        try {
            const hash = window.location.hash;
            if(hash.includes('?')) {
              const params = new URLSearchParams(hash.split('?')[1]);
              const emailFromQuery = params.get('email');
              if (emailFromQuery) {
                  this.email.set(decodeURIComponent(emailFromQuery));
              }
            }
        } catch (e) {
            console.error('Could not parse email from URL hash', e);
        }
    }

    async onUnsubscribe() {
        const emailValue = this.email().trim();
        if (!emailValue) {
            this.status.set('error');
            this.errorMessage.set('Por favor, insira seu e-mail.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailValue)) {
            this.status.set('error');
            this.errorMessage.set('Por favor, insira um e-mail válido.');
            return;
        }

        this.status.set('loading');
        this.errorMessage.set(null);

        try {
            await this.supabaseService.unsubscribeFromWaitingList(emailValue);
            this.status.set('success');
        } catch (error) {
            this.status.set('error');
            this.errorMessage.set(error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.');
        }
    }
}
