import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { allDefinitions as calendarDefinitions } from './tools/calendar.js';
import { allDefinitions as emailDefinitions } from './tools/email.js';

const allDefinitions = calendarDefinitions.concat(emailDefinitions)

const server = new McpServer({
    name: "secretaria",
    version: "1.0.0",
})

for (let definition of allDefinitions) {
    server.registerTool(
        definition.declaration.name, 
        {
            description: definition.declaration.description,
            inputSchema: definition.declaration.parameters ?? {}
        }, 
        async (args) => await definition.function(args)
    )
}

const transport = new StdioServerTransport()
await server.connect(transport)
console.error("MCP server is running...")