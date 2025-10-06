import { Component, ChangeDetectionStrategy, signal, OnInit, OnDestroy, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
    TermsOfUseComponent,
    FormsModule
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

  // FAQ signal
  openFaqIndex = signal<number | null>(null);

  faqs = [
    {
      question: 'O que é exatamente "A Liga dos Botecos"?',
      answer: 'É uma plataforma de gamificação gratuita que transforma a experiência no seu bar em uma competição divertida. Clientes acumulam pontos consumindo, cumprindo missões e jogando no app, o que aumenta a frequência, o consumo e a fidelidade deles.'
    },
    {
      question: 'É realmente 100% gratuito para o bar? Qual é a pegadinha?',
      answer: 'Sim, é e sempre será 100% gratuito para os bares. Não há pegadinha. Nosso modelo de negócio futuro será focado em parcerias com grandes marcas de bebidas e produtos que queiram se conectar com a nossa comunidade de botequeiros, mas nunca cobraremos dos estabelecimentos.'
    },
    {
      question: 'Meu bar não usa o sistema Chefos ERP. Posso participar?',
      answer: 'Com certeza! Embora a integração com o Chefos ERP automatize a pontuação, estamos desenvolvendo ativamente soluções para outros sistemas de PDV e também um método de validação manual via QR Code da nota fiscal. Inscreva-se como Bar Fundador para garantir sua vaga e ser o primeiro a saber das novas integrações.'
    },
    {
      question: 'Como meus clientes usam o app? É complicado para eles?',
      answer: 'É super simples. O cliente baixa o app, faz check-in no seu bar lendo um QR Code na mesa e começa a pontuar. A interface é intuitiva e focada na diversão, com rankings, missões claras e jogos fáceis de entender. O objetivo é engajar, não complicar.'
    },
    {
      question: 'Que tipo de suporte vocês oferecem aos bares parceiros?',
      answer: 'Oferecemos suporte completo. Para os Bares Fundadores, haverá um canal direto via WhatsApp para dúvidas e sugestões. Além disso, fornecemos material de marketing digital para divulgação, guias de melhores práticas para criar missões e um painel com dados sobre o engajamento dos seus clientes.'
    },
    {
      question: 'Como posso customizar as "missões" para a realidade do meu bar?',
      answer: 'Você terá acesso a um painel de controle onde poderá criar missões personalizadas. Quer aumentar a venda de um petisco específico? Crie uma missão "Experimente nossa porção de torresmo". Quer bombar sua terça-feira? Crie uma missão com pontos em dobro. As possibilidades são enormes para direcionar o consumo e o marketing.'
    },
    {
      question: 'Quem são os fundadores por trás da Liga dos Botecos?',
      answer: 'Somos um grupo de amigos de Belo Horizonte: um desenvolvedor de software, um especialista em marketing e um dono de bar. Cansados de ver bares incríveis lutando para atrair e manter clientes, decidimos unir nossas paixões — tecnologia, marketing e, claro, um bom boteco — para criar uma ferramenta que realmente ajuda os estabelecimentos locais que tanto amamos a prosperar.'
    },
  ];

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
    // Set launch date to February 1, 2026
    const launchDate = new Date('2026-02-01T00:00:00');
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