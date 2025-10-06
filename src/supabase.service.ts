import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  constructor() { }

  async addToWaitingList(name: string, email: string, barName: string) {
    const response = await fetch('/api/add-to-waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, barName }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => {
        // Handle cases where the response is not valid JSON
        throw new Error('Ocorreu um erro de comunicação com o servidor.');
      });
      throw new Error(errorData.message || 'Ocorreu um erro ao enviar o formulário.');
    }

    return response.json();
  }
}
