import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase URL and Key must be provided in environment variables.");
    }
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async addToWaitingList(name: string, email: string, barName: string) {
    const { data, error } = await this.supabase
      .from('waiting_list')
      .insert([
        { name, email, bar_name: barName },
      ]);

    if (error) {
      console.error('Error adding to waiting list:', error);
      if (error.code === '23505') { // Unique constraint violation (duplicate email)
          throw new Error('Este e-mail já está cadastrado na lista de espera.');
      }
      throw new Error('Ocorreu um erro ao tentar o registro. Tente novamente.');
    }

    return data;
  }
}
