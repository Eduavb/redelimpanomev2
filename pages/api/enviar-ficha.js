import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import FormData from 'form-data';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { nome, cpf, email } = req.body;

  if (!nome || !cpf || !email) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  try {
    // Lê o arquivo PDF fixo da pasta /public
    const filePath = path.join(process.cwd(), 'public', 'modelo-ficha.pdf');
    const fileBuffer = fs.readFileSync(filePath);

    // Cria o formulário multipart para enviar para a API do Autentique
    const form = new FormData();
    form.append('document', JSON.stringify({
      name: `Ficha de ${nome}`,
      signers: [{ email, action: 'SIGN' }],
    }));
    form.append('file', fileBuffer, {
      filename: 'modelo-ficha.pdf',
      contentType: 'application/pdf',
    });

    // Envia para o Autentique
    const response = await fetch('https://api.autentique.com.br/v2/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.AUTENTIQUE_TOKEN}`,
        ...form.getHeaders(),
      },
      body: form,
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      const text = await response.text();
      console.error('Resposta inesperada da API:', text);
      return res.status(500).json({ error: 'Resposta inválida da Autentique' });
    }

    if (!response.ok || data.errors) {
      console.error('Erro na resposta da Autentique:', data);
      return res.status(500).json({ error: 'Erro ao criar documento no Autentique' });
    }

    return res.status(200).json({ sucesso: true });
  } catch (err) {
    console.error('Erro interno:', err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}
