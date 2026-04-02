#!/bin/bash

echo "======================================================"
echo "                FRONT-END (REACT)                     "
echo "======================================================"

echo -e "\n\n>>>>>>>> src/pages/Dashboard.tsx <<<<<<<<"
cat src/pages/Dashboard.tsx 2>/dev/null || echo "Não encontrado"

echo -e "\n\n>>>>>>>> src/pages/AdminDashboard.tsx <<<<<<<<"
cat src/pages/AdminDashboard.tsx 2>/dev/null || echo "Não encontrado"

echo -e "\n\n>>>>>>>> src/components/leads/LeadFilter.tsx <<<<<<<<"
cat src/components/leads/LeadFilter.tsx 2>/dev/null || echo "Não encontrado"

echo -e "\n\n>>>>>>>> src/services/leadService.ts <<<<<<<<"
cat src/services/leadService.ts 2>/dev/null || echo "Não encontrado"

echo -e "\n\n======================================================"
echo "                BACK-END (JAVA)                       "
echo "======================================================"

echo -e "\n\n>>>>>>>> LeadController.java <<<<<<<<"
cat ../consig/src/main/java/com/jws/consig/controller/LeadController.java 2>/dev/null || echo "Não encontrado"

echo -e "\n\n>>>>>>>> LeadService.java <<<<<<<<"
cat ../consig/src/main/java/com/jws/consig/service/LeadService.java 2>/dev/null || echo "Não encontrado"

echo -e "\n\n>>>>>>>> LeadRepository.java <<<<<<<<"
cat ../consig/src/main/java/com/jws/consig/repository/LeadRepository.java 2>/dev/null || echo "Não encontrado"

