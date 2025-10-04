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
                    <p class="text-gray-400">Ao acessar ou usar a plataforma Ranking do Copo, você concorda em cumprir estes Termos de Serviço. Se você não concordar com estes termos, não utilize a plataforma.</p>
                </div>

                <div class="bg-gray-900 p-6 rounded-lg text-left">
                    <h4 class="text-xl font-bold mb-2 text-yellow-400">2. Uso da Plataforma</h4>
                    <p class="text-gray-400">Você concorda em usar a plataforma apenas para fins legais e de maneira que não infrinja os direitos de, restrinja ou iniba o uso e aproveitamento da plataforma por qualquer terceiro. O uso de linguagem ofensiva ou conduta disruptiva não será tolerado.</p>
                </div>

                <div class="bg-gray-900 p-6 rounded-lg text-left">
                    <h4 class="text-xl font-bold mb-2 text-yellow-400">3. Contas de Usuário</h4>
                    <p class="text-gray-400">Para participar dos rankings, você deve criar uma conta. Você é responsável por manter a confidencialidade de sua conta e senha e por todas as atividades que ocorram em sua conta.</p>
                </div>

                <div class="bg-gray-900 p-6 rounded-lg text-left">
                    <h4 class="text-xl font-bold mb-2 text-yellow-400">4. Pontuação e Recompensas</h4>
                    <p class="text-gray-400">Os pontos e recompensas são concedidos a critério do bar e da plataforma Ranking do Copo. Tentativas de manipular o sistema de pontuação resultarão na suspensão da conta. As recompensas não têm valor monetário e não podem ser trocadas por dinheiro.</p>
                </div>

                <div class="bg-gray-900 p-6 rounded-lg text-left">
                    <h4 class="text-xl font-bold mb-2 text-yellow-400">5. Encerramento</h4>
                    <p class="text-gray-400">Reservamo-nos o direito de suspender ou encerrar sua conta a qualquer momento, sem aviso prévio, por violação destes Termos ou por qualquer outro motivo que considerarmos apropriado.</p>
                </div>
            </div>
        </div>
    </main>
  `,
})
export class TermsOfUseComponent {
  back = output<void>();
}