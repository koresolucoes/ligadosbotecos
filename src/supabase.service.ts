import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  constructor() { }

  async addToWaitingList(name: string, email: string, barName: string) {
    // This is the more secure approach: calling a dedicated backend endpoint
    // which then communicates with Supabase using a secret key.
    const apiEndpoint = '/api/add-to-waitlist'; 

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          barName: barName,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        return responseData;
      } else {
        // The backend function will provide a clear error message
        throw new Error(responseData.message || 'Ocorreu um erro ao tentar o registro. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao chamar a API para adicionar à lista de espera:', error);
      if (error instanceof Error) {
        // Re-throw the specific error message from the backend
        throw error;
      }
      throw new Error('Ocorreu um erro de comunicação. Verifique sua conexão e tente novamente.');
    }
  }
}
