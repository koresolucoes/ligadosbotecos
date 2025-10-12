import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
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
export class AppComponent implements OnInit {
  title = 'A Liga dos Botecos';
  activeGame = signal<string | null>(null);
  currentPage = signal<'home' | 'privacy' | 'terms'>('home');
  isMenuOpen = signal(false);

  // Countdown signals
  days = signal(0);
  hours = signal(0);
  minutes = signal(0);
  seconds = signal(0);

  // FAQ signal
  openFaqIndex = signal<number | null>(null);

  faqs = [
    {
      question: 'O que é a Liga dos Botecos?',
      answer: 'É uma plataforma gratuita que oferece as ferramentas essenciais que todo bar e restaurante precisa: <strong>Cardápio Digital com QR Code</strong> e um <strong>Programa de Fidelidade</strong> completo. Tudo isso com uma camada de gamificação para engajar seus clientes e aumentar o consumo.'
    },
    {
      question: 'É realmente 100% gratuito? Qual é a pegadinha?',
      answer: 'Sim, as ferramentas essenciais (cardápio e fidelidade) são e sempre serão 100% gratuitas para os estabelecimentos. Não há pegadinha. Nosso modelo de negócio é baseado em parcerias futuras com grandes marcas, não em mensalidades para os bares.'
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

  private intervalId: any;

  ngOnInit() {
    this.startCountdown();
    this.handleUrlHash();
  }

  private handleUrlHash() {
    const hash = window.location.hash.toLowerCase();
    if (hash.startsWith('#privacy')) {
        this.currentPage.set('privacy');
    } else if (hash.startsWith('#terms')) {
        this.currentPage.set('terms');
    }
  }

  startCountdown() {
    // Set launch date to November 1, 2025
    const launchDate = new Date('2025-11-01T00:00:00');
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

  toggleFaq(index: number) {
    this.openFaqIndex.update(currentIndex => currentIndex === index ? null : index);
  }
}