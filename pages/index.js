import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Bem-vindo à Rede Limpa Nome</h1>
      <Link href="/login">
        <button style={{ marginTop: '20px', padding: '10px 20px' }}>
          Acessar Plataforma
        </button>
      </Link>
    </div>
  );
}