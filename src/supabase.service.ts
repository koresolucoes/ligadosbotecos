import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  constructor() { }

  async addToWaitingList(name: string, email: string, barName: string) {
    // A chamada agora é para o nosso próprio endpoint seguro, que por sua vez
    // se comunica com o Supabase usando as credenciais do ambiente do servidor.
    const response = await fetch('/api/add-to-waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, barName }),
    });

    const result = await response.json();

    if (!response.ok) {
      // O endpoint da API retorna uma mensagem de erro clara, que podemos repassar.
      // Lança um erro para que o componente possa capturá-lo e exibir o feedback correto.
      throw new Error(result.message || 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.');
    }

    return result;
  }
}
