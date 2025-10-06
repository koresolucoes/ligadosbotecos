import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from './environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async addToWaitingList(name: string, email: string, barName: string) {
    const { data, error } = await this.supabase
      .from('waiting_list')
      .insert([
        { name, email, bar_name: barName },
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      
      // Handle specific error codes for better user feedback
      if (error.code === '23505') {
        throw new Error('Este e-mail já está na lista de espera.');
      }
      if (error.code === '42501') {
        throw new Error('Erro de permissão no banco de dados. A política de segurança (RLS) pode estar bloqueando a inserção.');
      }
      
      // Check for auth errors based on message content, as 401 might not be in the code
      if (error.message.includes('Unauthorized') || error.message.includes('Invalid API key')) {
        throw new Error('Erro de autenticação. Verifique se a chave da API está correta e ativa.');
      }

      throw new Error('Ocorreu um erro ao enviar o formulário. Tente novamente mais tarde.');
    }

    return data;
  }

  async unsubscribeFromWaitingList(email: string) {
    const { error } = await this.supabase
      .from('waiting_list')
      .delete()
      .eq('email', email);

    if (error) {
      console.error('Supabase unsubscribe error:', error);
      throw new Error('Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.');
    }
  }
}