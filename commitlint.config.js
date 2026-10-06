// Conventional Commits: feat:, fix:, chore:, docs:, refactor:, test:…
module.exports = {
  extends: ['@commitlint/config-conventional'],
  // O Dependabot escreve "Bump" com maiúscula e não deixa mudar; o resto do título segue o padrão
  ignores: [(message) => /^(chore\(deps\)|ci)(\(deps\))?: Bump /.test(message)],
};
