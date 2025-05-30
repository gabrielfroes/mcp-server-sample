import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { NWSApiService } from "./infrastructure/services/NWSApiService.js";
import { WeatherService } from "./application/services/WeatherService.js";
import { WeatherToolsController } from "./interface/controllers/WeatherToolsController.js";
import { SchoolQueryService } from "./application/services/EscolaQueryService.js";
import { PriceByCepService } from "./application/services/PriceByCepService.js";

async function main() {
  // Criação da instância do servidor MCP
  const server = new McpServer({
    name: "weather",
    version: "1.0.0",
    capabilities: {
      resources: {},
      tools: {},
    },
  });

  // Inicializando serviços e controladores
  const nwsApiService = new NWSApiService();
  const weatherService = new WeatherService(nwsApiService);
  const priceByCepService = new PriceByCepService();
  const schoolQueryService = new SchoolQueryService();

  // Controlador que registra as ferramentas
  new WeatherToolsController(server, weatherService, priceByCepService, schoolQueryService);

  // Configurando e iniciando o servidor
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Weather MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
