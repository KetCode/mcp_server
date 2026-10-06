import "dotenv/config"
import readline from "readline"
import { GoogleGenAI, mcpToTool } from '@google/genai'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { Client } from '@modelcontextprotocol/sdk/client'

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEN_AI_API_KEY})

const serverParams = new StdioClientTransport({
    command: "node",
    args: ["index.js"],
    env: process.env
})

const client = new Client({
    name: "Secretaria-client",
    version: "1.0.0",
})

await client.connect(serverParams)

const contents = []

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

while (true) {
    const userInput = await new Promise((resolve) => {
        rl.question("VOCE: ", (input) => {
            resolve(input)
        })
    })
    contents.push({ role: "user", parts: [{ text: userInput }] })
    
    var response = await ai.models.generateContent({
        model: process.env.MODEL_AI,
        contents: contents,
        config: {
            tools: [mcpToTool(client)]
        }
    })

    console.log("SECRETARIA:", response.candidates[0].content.parts[0].text)
}