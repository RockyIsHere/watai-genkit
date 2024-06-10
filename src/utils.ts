import { runFlow } from "@genkit-ai/flow";

export default async function generateOutput(llm:any,input:string){
    return await runFlow(llm,input)
}