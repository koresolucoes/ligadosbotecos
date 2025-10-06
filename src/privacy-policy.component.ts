import { Component, ChangeDetectionStrategy, output } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="relative py-20 bg-slate-800 min-h-screen">
        <div class="container mx-auto px-6">
            <div class="flex justify-between items-center mb-12">
                <h1 class="text-4xl md:text-5xl font-bold text-white">Política de Privacidade</h1>
                <button (click)="back.emit()" class="flex items-center gap-2 bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300">
                    <span class="material-symbols-outlined">arrow_back</span>
                    Voltar ao Início
                </button>
            </div>

            <p class="text-gray-400 mb-8">Última atualização: 24 de Julho de 2024</p>
            
            <div class="space-y-8">
                <div class="bg-gray-900 p-6 rounded-lg text-left">
                    <h4 class="text-xl font-bold mb-2 text-yellow-400">1. Introdução</h4>
                    <p class="text-gray-400">Bem-vindo à A Liga dos Botecos. A sua privacidade é importante para nós. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando você utiliza nossa plataforma, em total conformidade com a Lei Geral de Proteção de Dados (LGPD) do Brasil.</p>
                </div>

                <div class="bg-gray-900 p-6 rounded-lg text-left">
                    <h4 class="text-xl font-bold mb-2 text-yellow-400">2. Informações que Coletamos</h4>
                    <p class="text-gray-400">Coletamos informações necessárias para o funcionamento da plataforma, incluindo: (a) dados de cadastro (nome, e-mail); (b) dados de uso da plataforma (check-ins, pontos, jogos); e (c) dados de consumo e permanência no bar, de forma anônima e agregada, para análise de tendências.<br><br>Adicionalmente, para análise de tráfego do site, utilizamos o Google Analytics, que coleta dados anônimos de navegação. Estas informações nos ajudam a melhorar nosso serviço e não incluem dados pessoais identificáveis.<br><br>Não coletamos dados pessoais sensíveis, como informações sobre saúde, religião ou orientação política.</p>
                </div>

                <div class="bg-gray-900 p-6 rounded-lg text-left">
                    <h4 class="text-xl font-bold mb-2 text-yellow-400">3. Como Usamos Suas Informações</h4>
                    <p class="text-gray-400">As informações que coletamos são usadas para: operar e manter a plataforma; gerenciar seu perfil e ranking; personalizar sua experiência; e analisar dados de forma agregada e anônima para melhorar o produto e fornecer insights valiosos para os estabelecimentos parceiros, sem identificar indivíduos.</p>
                </div>

                <div class="bg-gray-900 p-6 rounded-lg text-left">
                    <h4 class="text-xl font-bold mb-2 text-yellow-400">4. Compartilhamento de Informações</h4>
                    <p class="text-gray-400">Seu nome de usuário e pontuação são visíveis para outros usuários no ranking do bar. Não compartilharemos suas informações pessoais identificáveis com terceiros. Dados anônimos sobre consumo podem ser compartilhados com os bares parceiros para fins de inteligência de negócio.</p>
                </div>

                <div class="bg-gray-900 p-6 rounded-lg text-left">
                    <h4 class="text-xl font-bold mb-2 text-yellow-400">5. Seus Direitos (LGPD)</h4>
                    <p class="text-gray-400">Você tem o direito de acessar, corrigir ou solicitar a exclusão de seus dados pessoais. Para exercer seus direitos sob a Lei Geral de Proteção de Dados, entre em contato conosco através dos nossos canais de suporte.</p>
                </div>
            </div>
        </div>
    </main>
  `,
})
export class PrivacyPolicyComponent {
  back = output<void>();
}