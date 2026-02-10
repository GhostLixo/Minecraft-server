# Copilot Instructions for AI Agents

## Visão Geral do Projeto
Este repositório contém arquivos de configuração, pacotes de comportamento e recursos para servidores Minecraft Bedrock, com foco em customização, automação e extensão de funcionalidades. A estrutura é modular, separando claramente pacotes de comportamento, recursos, skins e configurações.

## Estrutura Principal
- `behavior_packs/` e `resource_packs/`: Pacotes de comportamento e recursos, organizados por versão e tipo.
- `development_behavior_packs/` e `development_resource_packs/`: Áreas para desenvolvimento e testes de novos pacotes.
- `config/`, `definitions/`: Configurações e definições globais do servidor.
- `worlds/`, `world_templates/`: Mundos e templates customizados.

## Convenções e Padrões
- Cada subpasta de versão (ex: `vanilla_1.21.0/`) contém um `manifest.json` e subdiretórios específicos (ex: `entities/`, `recipes/`).
- Arquivos `.json` podem conter comentários temporários durante o desenvolvimento, mas devem ser removidos antes do deploy.
- Configurações sensíveis e listas de permissões estão em arquivos como `permissions.json`, `allowlist.json`.

## Fluxos de Trabalho
- **Testes e Desenvolvimento:** Utilize as pastas `development_*` para testar alterações sem afetar o ambiente de produção.
- **Deploy:** Promova arquivos testados das pastas de desenvolvimento para as pastas principais.
- **Limpeza de Comentários:** Remova comentários de arquivos JSON antes de subir para produção.

## Integrações e Dependências
- O projeto depende da estrutura padrão de servidores Bedrock, mas pode incluir scripts ou automações customizadas.
- Não há scripts de build/teste automatizados detectados; processos são manuais.

## Exemplos de Padrões
- Exemplo de estrutura de um pacote:
  - `behavior_packs/chemistry_1.21.0/manifest.json`
  - `behavior_packs/chemistry_1.21.0/entities/`
  - `resource_packs/chemistry_1.21.0/recipes/`

## Recomendações para Agentes
- Respeite a separação entre produção e desenvolvimento.
- Sempre valide arquivos JSON após edição.
- Documente padrões específicos encontrados em cada pacote.
- Consulte arquivos `manifest.json` para entender dependências e versões.

Seções ou padrões não documentados podem ser detalhados conforme o projeto evolui. Peça feedback ao usuário para ajustar ou expandir estas instruções.