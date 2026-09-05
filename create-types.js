const fs = require('fs');
const path = require('path');

const files = [
  {
    file: 'src/types/elements.d.ts',
    content: `// Type definitions for the Elements module\n\nexport interface Elements {\n  init(): void;\n  // Adicione outras funções exportadas pelo módulo\n}\n\nexport const Elements: Elements;\n`
  },
  {
    file: 'src/types/project.d.ts',
    content: `// Type definitions for the Project module\n\nexport interface Project {\n  init(): void;\n  // ...\n}\n\nexport const Project: Project;\n`
  },
  {
    file: 'src/types/resize.d.ts',
    content: `// Type definitions for the Resize module\n\nexport interface Resize {\n  init(): void;\n  // ...\n}\n\nexport const Resize: Resize;\n`
  },
  {
    file: 'src/types/filters.d.ts',
    content: `// Type definitions for the Filters module\n\nexport interface Filters {\n  init(): void;\n  // ...\n}\n\nexport const Filters: Filters;\n`
  },
  {
    file: 'src/types/music.d.ts',
    content: `// Type definitions for the Music module\n\nexport interface Music {\n  init(): void;\n  // ...\n}\n\nexport const Music: Music;\n`
  },
  {
    file: 'src/types/state.d.ts',
    content: `// Type definitions for the State module\n\nexport interface State {\n  selected: HTMLElement | null;\n  activeCell: number | null;\n  filter: string;\n  // ...\n}\n\nexport const State: State;\n`
  },
  {
    file: 'src/types/drag-drop.d.ts',
    content: `// Type definitions for the DragDrop module\n\nexport interface DragDrop {\n  init(): void;\n  // ...\n}\n\nexport const DragDrop: DragDrop;\n`
  }
];

files.forEach(({ file, content }) => {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Created ${file}`);
});
