import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/db';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) setErro('Login inválido');
    else {
      const { user } = data;
      if (user.email === 'admin@redelimpanome.com.br') router.push('/admin');
      else router.push('/dashboard');
    }
  }

  return (
    <form onSubmit={handleLogin} style={{ textAlign: 'center', marginTop: 100 }}>
      <h2>Área de Acesso</h2>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mail" /><br />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Senha" /><br />
      <button type="submit">Entrar</button>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
    </form>
  );
}