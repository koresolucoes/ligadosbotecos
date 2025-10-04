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
                    <p class="text-gray-400">Bem-vindo ao Ranking do Copo. A sua privacidade é importante para nós. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando você utiliza nossa plataforma.</p>
                </div>

                <div class="bg-gray-900 p-6 rounded-lg text-left">
                    <h4 class="text-xl font-bold mb-2 text-yellow-400">2. Informações que Coletamos</h4>
                    <p class="text-gray-400">Podemos coletar informações pessoalmente identificáveis, como seu nome, e-mail e foto de perfil, quando você se registra. Também coletamos dados de uso, como check-ins, pontos acumulados e jogos jogados, para fornecer e melhorar nossos serviços.</p>
                </div>

                <div class="bg-gray-900 p-6 rounded-lg text-left">
                    <h4 class="text-xl font-bold mb-2 text-yellow-400">3. Como Usamos Suas Informações</h4>
                    <p class="text-gray-400">As informações que coletamos são usadas para: operar e manter a plataforma; criar e gerenciar seu perfil; exibir rankings e pontuações; personalizar sua experiência; e comunicar novidades e promoções.</p>
                </div>

                <div class="bg-gray-900 p-6 rounded-lg text-left">
                    <h4 class="text-xl font-bold mb-2 text-yellow-400">4. Compartilhamento de Informações</h4>
                    <p class="text-gray-400">Seu nome de usuário e pontuação são visíveis para outros usuários nos rankings do bar. Não compartilharemos suas informações pessoais com terceiros para fins de marketing sem o seu consentimento explícito.</p>
                </div>

                <div class="bg-gray-900 p-6 rounded-lg text-left">
                    <h4 class="text-xl font-bold mb-2 text-yellow-400">5. Segurança dos Dados</h4>
                    <p class="text-gray-400">Implementamos medidas de segurança para proteger suas informações contra acesso não autorizado. No entanto, nenhum sistema é 100% seguro, e não podemos garantir a segurança absoluta de seus dados.</p>
                </div>
            </div>
        </div>
    </main>
  `,
})
export class PrivacyPolicyComponent {
  back = output<void>();
}