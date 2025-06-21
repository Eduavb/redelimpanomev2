import { useState } from 'react';
import { supabase } from '../utils/db';
import { useRouter } from 'next/router';

export default function NovoCliente() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  const router = useRouter();

  const cadastrarCliente = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setMensagem('Cadastrando e gerando ficha...');

    try {
      const user = await supabase.auth.getUser();
      const id_afiliado = user.data.user.id;

      // 1. Cadastrar cliente no banco
      const { data, error } = await supabase.from('clientes').insert([
        {
          nome,
          cpf,
          id_afiliado,
          status: 'AGUARDANDO',
        }
      ]);

      if (error) {
        throw new Error('Erro ao cadastrar cliente no banco');
      }

      // 2. Enviar para assinatura via API
      const resposta = await fetch('/api/enviar-ficha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, cpf, email })
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error('Erro ao enviar para assinatura: ' + resultado.error);
      }

      setMensagem('Ficha enviada para assinatura com sucesso!');
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err) {
      console.error(err);
      setMensagem('Erro ao cadastrar cliente ou enviar ficha.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Cadastrar Novo Cliente</h1>
      <form onSubmit={cadastrarCliente}>
        <div>
          <label>Nome completo:</label><br />
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
        </div>
        <div>
          <label>CPF:</label><br />
          <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} required />
        </div>
        <div>
          <label>Email do cliente:</label><br />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <br />
        <button type="submit" disabled={carregando}>
          {carregando ? 'Cadastrando...' : 'Cadastrar Cliente'}
        </button>
      </form>

      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}
