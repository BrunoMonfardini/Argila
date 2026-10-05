/**
 * Valida os SVGs de projects/ui/icons e gera as constantes TypeScript dos ícones.
 *
 *   node scripts/gerar-icones.ts           grava icons.generated.ts
 *   node scripts/gerar-icones.ts --check   só confere (usado no CI)
 */
import { runIconGenerator } from './lib/icones.ts';

const result = runIconGenerator({
  iconsDir: 'projects/ui/icons',
  outFile: 'projects/ui/src/lib/icon/icons.generated.ts',
  check: process.argv.includes('--check'),
});

for (const message of result.messages) {
  if (result.ok) {
    console.log(message);
  } else {
    console.error(message);
  }
}
process.exitCode = result.ok ? 0 : 1;
