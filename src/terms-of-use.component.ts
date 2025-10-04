import { Component, ChangeDetectionStrategy, output } from '@angular/core';

@Component({
  selector: 'app-terms-of-use',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="relative py-20 bg-slate-800 min-h-screen">
        <div class="container mx-auto px-6">
            <div class="flex justify-between items-center mb-12">
                <h1 class="text-4xl md:text-5xl font-bold text-white">Termos de Serviço</h1>
                <button (click)="back.emit()" class="flex items-center gap-2 bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300">
                    <span class="material-symbols-outlined">arrow_back</span>
                    Voltar ao Início
                </button>
            </div>

            <p class="text-gray-400 mb-8">Última atualização: 24 de Julho de 2024</p>
            
            <div class="space-y-8">
                <div class="bg-gray-900 p-6 rounded-lg text-left">
                    <h4 class="text-xl font-bold mb-2 text-yellow-400">1. Aceitação dos Termos</h4>
                    <p class="text-gray-400">Ao acessar ou usar a plataforma A Liga dos Botecos, você concorda em cumprir estes Termos de Serviço e a nossa Política de Privacidade. Se você não concordar, não utilize a plataforma.</p>
                </div>

                <div class="bg-gray-900 p-6 rounded-lg text-left">
                    <h4 class="text-xl font-bold mb-2 text-yellow-400">2. Uso da Plataforma e Coleta de Dados</h4>
                    <p class="text-gray-400">Você concorda em usar a plataforma para fins legais e de maneira apropriada. Ao participar, você reconhece e concorda com a coleta de dados de uso e consumo, conforme detalhado em nossa Política de Privacidade, para fins de melhoria do serviço e em conformidade com a LGPD.</p>
                </div>

                <div class="bg-gray-900 p-6 rounded-lg text-left">
                    <h4 class="text-xl font-bold mb-2 text-yellow-400">3. Contas de Usuário</h4>
                    <p class="text-gray-400">Você é responsável por manter a confidencialidade de sua conta e por todas as atividades que ocorram nela. A criação de contas com informações falsas é proibida.</p>
                </div>

                <div class="bg-gray-900 p-6 rounded-lg text-left">
                    <h4 class="text-xl font-bold mb-2 text-yellow-400">4. Pontuação e Recompensas</h4>
                    <p class="text-gray-400">Os pontos e recompensas são concedidos a critério do bar e da plataforma A Liga dos Botecos. Tentativas de manipular o sistema de pontuação resultarão na suspensão da conta. As recompensas não têm valor monetário.</p>
                </div>

                <div class="bg-gray-900 p-6 rounded-lg text-left">
                    <h4 class="text-xl font-bold mb-2 text-yellow-400">5. Encerramento</h4>
                    <p class="text-gray-400">Reservamo-nos o direito de suspender ou encerrar sua conta a qualquer momento, sem aviso prévio, por violação destes Termos ou por conduta que considerarmos prejudicial à comunidade ou à plataforma.</p>
                </div>
            </div>
        </div>
    </main>
  `,
})
export class TermsOfUseComponent {
  back = output<void>();
}
