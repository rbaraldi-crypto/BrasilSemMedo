import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { resolve } from 'path';

const projectDir = '/home/project';

if (!existsSync(resolve(projectDir, 'package.json'))) {
  console.error('❌ package.json não encontrado em', projectDir);
  process.exit(1);
}

console.log('✅ Diretório correto:', projectDir);
process.chdir(projectDir);
console.log('📦 Instalando dependências...');

try {
  execSync('npm install', { cwd: projectDir, stdio: 'inherit' });
  console.log('🚀 Iniciando servidor de desenvolvimento...');
  execSync('npm run dev', { cwd: projectDir, stdio: 'inherit' });
} catch (e) {
  process.exit(1);
}
