import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';

const help = `Create a Markdown draft:
  npm run new-post -- photo-walk --title "Article title" --tag photography

Options:
  --title <text>        Required article title
  --description <text> Optional summary
  --tag <text>         Repeat for multiple tags
  --date <YYYY-MM-DD>  Defaults to today's date in Asia/Shanghai
  --help              Show this message
`;

function today() {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      title: { type: 'string' },
      description: { type: 'string', default: '' },
      tag: { type: 'string', multiple: true, default: [] },
      date: { type: 'string' },
      help: { type: 'boolean', default: false },
    },
  });
  if (values.help) {
    console.log(help);
    return;
  }

  const [slug] = positionals;
  if (positionals.length !== 1 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error('Provide one lowercase slug using letters, numbers and hyphens.');
  }
  if (!values.title?.trim()) throw new Error('--title is required.');
  const date = values.date ?? today();
  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parsedDate.valueOf())
      || parsedDate.toISOString().slice(0, 10) !== date) {
    throw new Error('--date must be a valid date in YYYY-MM-DD format.');
  }

  const directory = resolve('src/content/posts');
  const path = resolve(directory, `${slug}.md`);
  const tags = [...new Set(values.tag.map((tag) => tag.trim()).filter(Boolean))];
  const content = [
    '---',
    `title: ${JSON.stringify(values.title.trim())}`,
    `description: ${JSON.stringify(values.description.trim())}`,
    `published: ${date}`,
    `tags: ${JSON.stringify(tags)}`,
    'draft: true',
    '---', '', '',
  ].join('\n');
  await mkdir(directory, { recursive: true });
  // Exclusive creation protects existing articles from accidental overwrites.
  await writeFile(path, content, { flag: 'wx' });
  console.log(`Draft created: ${path}`);
}

main().catch((error) => {
  console.error(error.code === 'EEXIST' ? 'This article already exists. Choose another slug.' : error.message);
  process.exitCode = 1;
});
