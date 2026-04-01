#!/bin/bash

echo "🔧 1. Arrumando a leitura dos Leads no Dashboard..."
sed -i 's/setLeads(data.content)/setLeads(data.content || data)/g' src/pages/Dashboard.tsx
sed -i 's/\.\.\.data.content/\.\.\.(data.content || data)/g' src/pages/Dashboard.tsx

echo "🔐 2. Limpando aspas do Token no axios..."
sed -i "s/\`Bearer \${token}\`/\`Bearer \${token.replace(\/[\\\"']+\/g, '')}\`/g" src/services/api.ts

echo "🔑 3. Colocando Key nas opções de Select..."
sed -i 's/<option value=\"\">Selecionar/<option key=\"empty\" value=\"\">Selecionar/g' src/components/leads/LeadTable.tsx
sed -i 's/<option value=\"\" disabled>Atribuir/<option key=\"empty-atrib\" value=\"\" disabled>Atribuir/g' src/components/leads/LeadTable.tsx

echo "✅ Tudo corrigido!"
