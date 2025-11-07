import { Component, ChangeDetectionStrategy, signal, OnInit, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicTacToeGameComponent } from './tic-tac-toe-game.component';
import { FindTheCupGameComponent } from './find-the-cup-game.component';
import { ShotRouletteGameComponent } from './shot-roulette-game.component';
import { PrivacyPolicyComponent } from './privacy-policy.component';
import { TermsOfUseComponent } from './terms-of-use.component';
import { UnsubscribeComponent } from './unsubscribe.component';
import { SupabaseService } from './supabase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    TicTacToeGameComponent, 
    FindTheCupGameComponent, 
    ShotRouletteGameComponent, 
    NgOptimizedImage,
    PrivacyPolicyComponent,
    TermsOfUseComponent,
    UnsubscribeComponent
  ]
})
export class AppComponent implements OnInit {
  private supabaseService = inject(SupabaseService);

  title = 'A Liga dos Botecos';
  activeGame = signal<string | null>(null);
  currentPage = signal<'home' | 'privacy' | 'terms' | 'unsubscribe'>('home');
  isMenuOpen = signal(false);

  // Form signals
  name = signal('');
  email = signal('');
  barName = signal('');
  formStatus = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  errorMessage = signal('');

  // FAQ signal
  openFaqIndex = signal<number | null>(null);

  faqs = [
    {
      question: 'O que é a Liga dos Botecos?',
      answer: 'É a plataforma definitiva para bares e restaurantes que buscam fidelizar clientes e aumentar o faturamento. Oferecemos <strong>Cardápio Digital com QR Code</strong>, um <strong>Programa de Fidelidade</strong> gamificado com missões e rankings, e jogos interativos para criar uma experiência única e viciante para seus clientes.'
    },
    {
      question: 'O que é o programa de "Bares Fundadores"?',
      answer: 'É uma parceria por tempo limitado. Estamos selecionando os primeiros bares para usar a plataforma <strong>sem custo de mensalidade, para sempre</strong>. Em troca, buscamos seu feedback para construirmos juntos a melhor ferramenta do mercado. É uma oportunidade única com vagas limitadas antes do lançamento oficial com planos pagos.'
    },
    {
      question: 'Preciso de um sistema de PDV específico para usar?',
      answer: 'Não! A Liga dos Botecos funciona de forma totalmente independente. Você gerencia seu cardápio, recompensas e missões diretamente no nosso painel de controle. A integração com sistemas como o Chefos ERP é um recurso opcional para quem deseja automatizar ainda mais a pontuação.'
    },
    {
      question: 'Como meus clientes usam o app? É complicado?',
      answer: 'É super simples. O cliente escaneia um QR Code na mesa para acessar o cardápio e fazer o check-in no bar. A partir daí, ele já começa a pontuar e pode acompanhar os rankings, missões e jogos. A interface é intuitiva e focada na diversão.'
    },
    {
      question: 'Que tipo de suporte vocês oferecem aos bares parceiros?',
      answer: 'Oferecemos suporte completo, com um canal direto via WhatsApp para dúvidas e sugestões. Além disso, fornecemos material de marketing digital para divulgação, guias de melhores práticas para criar missões e um painel com dados sobre o engajamento dos seus clientes.'
    },
    {
      question: 'Como posso customizar as "missões" para a realidade do meu bar?',
      answer: 'Você terá acesso a um painel de controle onde poderá criar missões personalizadas. Quer aumentar a venda de um petisco específico? Crie uma missão "Experimente nossa porção de torresmo". Quer bombar sua terça-feira? Crie uma missão com pontos em dobro. As possibilidades são enormes para direcionar o consumo.'
    },
    {
      question: 'Quem são os fundadores por trás da Liga dos Botecos?',
      answer: 'Somos um grupo de amigos de Belo Horizonte: um desenvolvedor de software, um especialista em marketing e um dono de bar. Decidimos unir nossas paixões — tecnologia, marketing e, claro, um bom boteco — para criar uma ferramenta que realmente ajuda os estabelecimentos locais que tanto amamos a prosperar.'
    },
  ];

  ngOnInit() {
    this.handleUrlHash();
  }

  private handleUrlHash() {
    const hash = window.location.hash.toLowerCase();
    if (hash.startsWith('#privacy')) {
        this.currentPage.set('privacy');
    } else if (hash.startsWith('#terms')) {
        this.currentPage.set('terms');
    } else if (hash.startsWith('#unsubscribe')) {
        this.currentPage.set('unsubscribe');
    }
  }

  async submitForm() {
    this.formStatus.set('loading');
    this.errorMessage.set('');
    try {
      if (!this.name().trim() || !this.email().trim() || !this.barName().trim()) {
        throw new Error('Por favor, preencha todos os campos.');
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email())) {
          throw new Error('Por favor, insira um e-mail válido.');
      }

      await this.supabaseService.addToWaitingList(this.name(), this.email(), this.barName());
      this.formStatus.set('success');
    } catch (error) {
      this.formStatus.set('error');
      this.errorMessage.set(error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.');
    }
  }

  selectGame(game: string | null) {
    this.activeGame.set(game);
  }

  toggleMenu() {
    this.isMenuOpen.update(open => !open);
  }

  closeMenuAndNavigate(page: 'home' | 'privacy' | 'terms' | 'unsubscribe', anchor?: string) {
    this.isMenuOpen.set(false);
    this.navigateTo(page, anchor);
  }

  navigateTo(page: 'home' | 'privacy' | 'terms' | 'unsubscribe', anchor?: string) {
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

  toggleFaq(index: number) {
    this.openFaqIndex.update(currentIndex => currentIndex === index ? null : index);
  }
}