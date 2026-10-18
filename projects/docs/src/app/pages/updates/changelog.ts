/** Uma mudança do changelog, com os subitens dela. */
export interface ChangelogEntry {
  text: string;
  items: string[];
}

export interface ChangelogGroup {
  /** "Novidades", "Correções" ou "Mudanças que quebram". */
  title: string;
  entries: ChangelogEntry[];
}

export interface ChangelogVersion {
  version: string;
  groups: ChangelogGroup[];
}

const GROUP_TITLES: Record<string, string> = {
  'Major Changes': 'Mudanças que quebram',
  'Minor Changes': 'Novidades',
  'Patch Changes': 'Correções',
};

/** Sem o hash do commit ("651ebcf: ") e sem os asteriscos de negrito. */
function clean(text: string): string {
  return text
    .replace(/^[0-9a-f]{7,40}: /, '')
    .replaceAll('**', '')
    .trim();
}

/**
 * Lê o `CHANGELOG.md` do Changesets: `## versão`, `### tipo`, itens de lista
 * e subitens. O resultado vira texto no catálogo, nunca marcação.
 */
export function parseChangelog(markdown: string): ChangelogVersion[] {
  const versions: ChangelogVersion[] = [];
  let version: ChangelogVersion | undefined;
  let group: ChangelogGroup | undefined;
  let entry: ChangelogEntry | undefined;
  for (const line of markdown.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const heading = /^(#{2,3}) (.+)$/.exec(line);
    if (heading?.[1] === '##') {
      version = { version: heading[2].trim(), groups: [] };
      versions.push(version);
      group = entry = undefined;
    } else if (heading && version) {
      const title = heading[2].trim();
      group = { title: GROUP_TITLES[title] ?? title, entries: [] };
      version.groups.push(group);
      entry = undefined;
    } else if (/^- /.test(line) && group) {
      entry = { text: clean(line.slice(2)), items: [] };
      group.entries.push(entry);
    } else if (/^\s+- /.test(line) && entry) {
      entry.items.push(clean(line.replace(/^\s+- /, '')));
    } else if (/^\s+\S/.test(line) && entry) {
      // Continuação do item: um parágrafo a mais dentro dele
      if (entry.items.length) entry.items.push(clean(line));
      else entry.text = `${entry.text} ${clean(line)}`;
    }
  }
  return versions;
}
