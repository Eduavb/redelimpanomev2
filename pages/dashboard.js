// pages/dashboard.js
import { useEffect, useState } from 'react';
import { supabase } from '../utils/db';
import Link from 'next/link';

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email || '');
    };

    getUser();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Painel do Afiliado</h1>
      <p>Bem-vindo, {userEmail}</p>

      <br />
      <Link href="/novo-cliente">
        <button>Cadastrar Novo Cliente</button>
      </Link>
    </div>
  );
}
