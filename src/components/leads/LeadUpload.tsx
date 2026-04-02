import React, { useState } from 'react';
import { leadService } from '../../services/leadService';

interface LeadUploadProps {
  onUploadSuccess?: () => void;
}

export const LeadUpload = ({ onUploadSuccess }: LeadUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<{adicionados: number, duplicados: number} | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setResultado(null);
    try {
      const res = await leadService.importarCSV(file);
      setResultado(res); // O Java vai devolver os números aqui
      if (onUploadSuccess) onUploadSuccess();
      setFile(null);
    } catch (err) {
      console.error("Erro no upload:", err);
      alert("Erro ao processar o arquivo. Verifique o console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '1px solid #333', marginBottom: '20px' }}>
      <h3 style={{ marginTop: 0, color: '#fff' }}>📂 Importar Leads (CSV)</h3>
      
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input 
          type="file" 
          accept=".csv" 
          onChange={e => setFile(e.target.files?.[0] || null)}
          style={{ color: '#ccc', padding: '5px', border: '1px solid #444', borderRadius: '4px' }}
        />
        <button 
          onClick={handleUpload} 
          disabled={!file || loading}
          style={{
            padding: '10px 20px',
            background: loading ? '#555' : '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: loading || !file ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? '⏳ Lendo CSV e Salvando...' : '🚀 Fazer Upload'}
        </button>
      </div>

      {/* CARD DE RESULTADO (MODAL) */}
      {resultado && (
        <div style={{ marginTop: '15px', padding: '15px', background: '#002a00', border: '1px solid #005a00', borderRadius: '4px', color: '#85ff85' }}>
          <strong>✅ Upload Concluído!</strong>
          <ul style={{ margin: '10px 0 0 0', paddingLeft: '20px' }}>
            <li><strong>{resultado.adicionados}</strong> novos leads salvos no banco.</li>
            <li><strong>{resultado.duplicados}</strong> ignorados (CPFs já existentes ou linhas inválidas).</li>
          </ul>
          <button onClick={() => setResultado(null)} style={{ marginTop: '10px', padding: '5px 10px', background: 'transparent', border: '1px solid #85ff85', color: '#85ff85', borderRadius: '4px', cursor: 'pointer' }}>Fechar</button>
        </div>
      )}
    </div>
  );
};
