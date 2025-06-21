// pages/admin.js
import { useEffect, useState } from 'react';
import { supabase } from '../utils/db';
import jsPDF from 'jspdf';

export default function Admin() {
  const [clientes, setClientes] = useState([]);
  const [listas, setListas] = useState([]);
  const [gerando, setGerando] = useState(false);

  useEffect(() => {
    fetchClientes();
    fetchListas();
  }, []);

  const fetchClientes = async () => {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('status', 'CONCLUÍDO');

    if (error) {
      console.error('Erro ao buscar clientes:', error.message);
    } else {
      setClientes(data);
    }
  };

  const fetchListas = async () => {
    const { data, error } = await supabase
      .from('listas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar listas:', error.message);
    } else {
      setListas(data);
    }
  };

  const gerarLista = async () => {
    if (clientes.length === 0) {
      alert('Nenhum cliente com status CONCLUÍDO.');
      return;
    }

    setGerando(true);

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Lista de Clientes - Limpa Nome', 20, 20);

    let y = 40;
    clientes.forEach((cliente, index) => {
      doc.setFontSize(12);
      doc.text(`${index + 1}. ${cliente.nome} - CPF: ${cliente.cpf}`, 20, y);
      y += 10;
    });

    const pdfOutput = doc.output('blob');
    const fileName = `lista-${new Date().toISOString()}.pdf`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('listas-geradas')
      .upload(fileName, pdfOutput, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (uploadError) {
      console.error('Erro ao salvar PDF no Storage:', uploadError.message);
      setGerando(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('listas-geradas')
      .getPublicUrl(fileName);

    const { error: insertError } = await supabase
      .from('listas')
      .insert({ url_pdf: urlData.publicUrl });

    if (insertError) {
      console.error('Erro ao salvar na tabela listas:', insertError.message);
    } else {
      alert('Lista gerada com sucesso!');
      fetchListas(); // atualiza a lista na tela
    }

    setGerando(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Painel do Administrador</h1>
      <p>Total de clientes concluídos: {clientes.length}</p>

      <button onClick={gerarLista} disabled={gerando}>
        {gerando ? 'Gerando PDF...' : 'Gerar Lista'}
      </button>

      <hr style={{ margin: '20px 0' }} />

      <h2>Listas Geradas</h2>
      {listas.length === 0 ? (
        <p>Nenhuma lista gerada ainda.</p>
      ) : (
        <ul>
          {listas.map((lista) => (
            <li key={lista.id}>
              <a href={lista.url_pdf} target="_blank" rel="noopener noreferrer">
                Baixar lista ({new Date(lista.created_at).toLocaleString()})
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
