import { spawn } from 'node:child_process';
import { mkdirSync, createWriteStream } from 'node:fs';
import stripAnsi from 'strip-ansi';

// Garante que a pasta logs existe
mkdirSync('logs', { recursive: true });

// Abre o arquivo de log (sem cores)
const logStream = createWriteStream('logs/lint-errors.txt', { flags: 'w' });

// Roda o ESLint
const child = spawn('npx', ['eslint', '.'], {
  shell: true,
  stdio: ['inherit', 'pipe', 'pipe'],
});

// Para cada pedaço de saída (stdout e stderr):
// - escreve no terminal (com cores)
// - escreve no arquivo (sem cores)
const handle = (chunk) => {
  const text = chunk.toString();
  process.stdout.write(text);          // terminal: mantém as cores
  logStream.write(stripAnsi(text));    // arquivo: remove as cores
};

child.stdout.on('data', handle);
child.stderr.on('data', handle);

child.on('close', (code) => {
  logStream.end();
  process.exit(code); // repassa o código de saída do ESLint
});