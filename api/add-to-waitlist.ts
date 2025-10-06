// IMPORTANT: This file should be placed in the `api` directory at the root of your project.
// It acts as a Vercel Serverless Function.

// This function does not require external dependencies and uses the native fetch API.
export default async function handler(request: any, response: any) {
  // 1. Only allow POST requests
  if (request.method !== 'POST') {
    response.setHeader('Allow', ['POST']);
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, barName } = request.body;

  // 2. Validate input
  if (!name || !email || !barName) {
    return response.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    // For Vercel environment variables, you should use the SERVICE_ROLE_KEY for better security
    const supabaseKey = process.env.SUPABASE_KEY;

    // 3. Check for environment variables
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase URL or Key not set in environment variables.');
      return response.status(500).json({ message: 'Erro de configuração no servidor.' });
    }

    // 4. Make the request to Supabase REST API using fetch
    const supabaseResponse = await fetch(`${supabaseUrl}/rest/v1/waiting_list`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        name: name,
        email: email,
        bar_name: barName,
      }),
    });

    // 5. Handle the response from Supabase
    if (supabaseResponse.ok) {
      return response.status(200).json({ message: 'Inscrição realizada com sucesso!' });
    } else {
      const errorData = await supabaseResponse.json();
      console.error('Supabase API error:', errorData);

      // Handle specific errors like duplicate email (unique constraint violation)
      if (errorData.code === '23505') {
        return response.status(409).json({ message: 'Este e-mail já está cadastrado na lista de espera.' });
      }

      return response.status(supabaseResponse.status).json({ message: 'Ocorreu um erro ao tentar o registro. Tente novamente.' });
    }
  } catch (error) {
    console.error('Internal server error:', error);
    return response.status(500).json({ message: 'Ocorreu um erro inesperado no servidor.' });
  }
}
