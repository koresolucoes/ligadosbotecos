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
      // Handle unique constraint violation for email
      if (error.code === '23505') {
        throw new Error('Este e-mail já está na lista de espera.');
      }
      throw new Error('Ocorreu um erro ao enviar o formulário. Tente novamente mais tarde.');
    }

    return data;
  }
}
