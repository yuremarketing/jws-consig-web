import { useState } from 'react';
import { leadService } from '../../services/leadService';

interface Props {
  onSuccess: (mensagem: string) => void;
}

export const LeadUpload = ({ onSuccess }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const res = await leadService.importarCSV(file);
      onSuccess(res.message);
      setFile(null);
    } catch (err) {
      console.error("Erro no upload:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '20px' }}>
      <h3 style={{ marginTop: 0 }}>📁 Importar Planilha (CSV)</h3>
      <input 
        type="file" 
        accept=".csv" 
        onChange={(e) => setFile(e.target.files?.[0] || null)} 
      />
      <button 
        onClick={handleUpload} 
        disabled={loading || !file}
        style={{ marginLeft: '10px', padding: '5px 15px', cursor: 'pointer' }}
      >
        {loading ? 'Processando...' : 'Fazer Upload'}
      </button>
    </div>
  );
};
