# Exemplo de Servidor MCP

Criado para fins educacionais no canal Código Fonte TV, este projeto demonstra como construir um servidor MCP com integração a APIs externas e validação de dados.

Este repositório contém um exemplo de implementação de um servidor MCP (_Model Context Protocol_) em Node.js/TypeScript, que fornece duas ferramentas para obter informações meteorológicas usando a API do National Weather Service (NWS) dos EUA.

## Funcionalidades

- **get-alerts**: Retorna alertas meteorológicos ativos para um estado (código de duas letras, ex: `CA`, `NY`).
- **get-forecast**: Retorna a previsão do tempo para coordenadas geográficas (latitude, longitude).
- Validação de entrada usando [Zod](https://github.com/colinhacks/zod).
- Integração com a API do NWS usando `fetch` (camada de infraestrutura).
- Comunicação via _stdio_ usando o protocolo MCP (`@modelcontextprotocol/sdk`).

## Novas Funcionalidades

O projeto agora conta com:

- **Busca de frete por CEP**: ferramenta `price-by-cep` que consulta preços de envio entre dois CEPs usando a API do Melhor Envio. É necessário gerar um token gratuito em https://app.melhorenvio.com.br/integracoes/permissoes-de-acesso (marque a opção "shipping-calculate (Cotação de fretes)") e configurar no arquivo `.env`.
- **Ferramentas de banco de dados escolar**: diversas tools para consultar, criar, atualizar e deletar alunos e professores, além de listar turmas, matrículas e realizar buscas avançadas no banco PostgreSQL.

### Banco de Dados PostgreSQL
Para utilizar as ferramentas de escola, é necessário ter o Docker instalado. Agora, basta rodar o comando abaixo para criar, popular e iniciar o banco automaticamente:

```powershell
docker-compose up -d
```

O arquivo `docker-compose.yml` já está configurado para:
- Subir um container PostgreSQL com o banco, usuário e senha corretos.
- Executar automaticamente o script `school_init.sql` na primeira inicialização, criando as tabelas e inserindo dados de exemplo.

> **Importante:**
> Certifique-se de que o arquivo `school_init.sql` está na mesma pasta do `docker-compose.yml` antes de rodar o comando acima.


#### Caso tenha problemas com o container e queira deletá-lo:

1. Pare o container (caso esteja rodando ou pausado):
```powershell
docker stop escola-postgres
```
2. Remova o container:
```powershell
docker rm escola-postgres
```

Se quiser remover também o volume de dados (apaga tudo do banco):
```powershell
docker volume rm mcp-server-sample_pgdata
```


## Arquitetura

O projeto segue uma arquitetura em camadas inspirada em padrões de **Domain-Driven Design** (DDD):

- **Domain** (`src/domain`):
  Definição de interfaces e tipos que representam as estruturas de dados (ex: `AlertFeature`, `ForecastPeriod`, `AlertsResponse`).

- **Infrastructure** (`src/infrastructure`):
  Implementação de serviços externos, como o `NWSApiService`, responsável por realizar as chamadas HTTP à API do NWS.

- **Application** (`src/application`):
  Contém a lógica de negócio no `WeatherService`, que processa e formata os dados vindos da infraestrutura.

- **Interface** (`src/interface`):
  Inclui controladores (`WeatherToolsController`) que registram as ferramentas no servidor MCP, definem schemas de validação e retornam os resultados.

- **Entry Point** (`src/main.ts`):
  Inicializa o `McpServer`, configura o transporte (`StdioServerTransport`), instancia serviços e controladores, e inicia escuta em _stdio_.

A estrutura de pastas é a seguinte:

```
src/
├── domain/
│   └── models/           # Interfaces de domínio
├── infrastructure/
│   └── services/         # Implementações da API externa (NWS)
├── application/
│   └── services/         # Lógica de negócio e formatação de dados
├── interface/
│   └── controllers/      # Registro das ferramentas MCP e validação
└── main.ts               # Ponto de entrada do servidor
build/                     # Código JavaScript compilado
```

## Instalação

```bash
git clone <REPOSITÓRIO_URL>
cd mcp-server-sample
npm install
npm run build
```

## Uso

Após o build, você pode executar o servidor diretamente:

```bash
node build/main.js
```

Ou, se registrado como binário (`weather`):

```bash
npm link
weather
```

O servidor iniciará na saída padrão (_stdio_) e aguardará requisições MCP.

## Contribuição

Pull requests são bem-vindos! Sinta-se à vontade para abrir issues e discutir melhorias.

## Código Fonte TV

Para mais detalhes sobre a implementação, assista ao vídeo no canal [Código Fonte TV](https://youtu.be/NUOzYPSNaNk).
