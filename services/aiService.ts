
import { OpenAI } from "openai";
import type { CardData } from '../types';
import { Language } from '../types';
import type { ChatContextMessage } from '../hooks/useChatContext';
import { chatDatabase } from './chatDatabase';

// Get API key from environment
const getApiKey = () => {
  const apiKey = import.meta.env?.VITE_HF_TOKEN;
  if (!apiKey) {
    throw new Error('VITE_HF_TOKEN is not defined in environment variables. Please check your .env file.');
  }
  return apiKey;
};

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: getApiKey(),
  dangerouslyAllowBrowser: true,
});

const getSystemInstruction = (language: Language, hasContext: boolean = false) => `
You are SmartAgri, an AI assistant for Indian farmers. You will receive an image of a plant/crop and an optional text query${hasContext ? ', along with conversation history to provide contextual responses' : ''}. Your goal is to provide a concise, actionable advisory. ALWAYS respond in valid JSON format according to the provided schema. The language of your entire response content (title, content, source) MUST be in ${language}.

${hasContext ? 'IMPORTANT: Use the conversation history to provide more contextual and personalized responses. Reference previous discussions when relevant.' : ''}

Schema format:
{
  "type": "CURE" | "PRICE" | "ALERT" | "WEATHER" | "TIP",
  "urgency": "CRITICAL" | "MEDIUM" | "NORMAL",
  "title": "string",
  "content": ["array", "of", "strings"],
  "source": "string"
}

Guidelines:
- If the image shows a diseased plant, provide a 'CURE' card. Urgency is 'CRITICAL' for severe cases, 'MEDIUM' otherwise. Content must be a numbered list of simple steps.
- If the image shows a healthy, harvest-ready crop, provide a 'PRICE' card. Urgency is 'NORMAL'. Content should include today's price in a local Indian market (e.g., Punjab) and a 2-3 day trend prediction.
- If the query is about general farming, weather, or other topics, provide a 'TIP' or 'WEATHER' card with 'NORMAL' urgency.
- Provide a plausible source for all information (e.g., 'Punjab Agricultural University', 'Local Mandi Board', 'IMD Weather Bulletin').
- If the user provides a greeting or an unclear query, respond with a helpful 'TIP' card suggesting they upload an image of their crop.
${hasContext ? '- Reference previous conversations when providing follow-up advice or clarifications.' : ''}
`;

export const getAdvisory = async (
    image: { data: string; mimeType: string } | null,
    text: string,
    language: Language,
    conversationContext?: ChatContextMessage[]
): Promise<CardData | null> => {
    try {
        // Build conversation history if provided
        let contextualPrompt = text || "Analyze the provided image.";
        
        // Get persistent context from previous sessions
        const persistentContext = chatDatabase.getContextForNewSession();
        
        console.log('🔍 Context Debug:');
        console.log('- Has image:', !!image);
        console.log('- User text:', text);
        console.log('- Conversation context length:', conversationContext?.length || 0);
        console.log('- Persistent context:', persistentContext ? 'Available' : 'None');
        
        if (conversationContext && conversationContext.length > 0) {
            const contextSummary = conversationContext
                .map(msg => `${msg.role}: ${msg.content}`)
                .join('\n');
            
            contextualPrompt = `Previous conversation:\n${contextSummary}\n\nCurrent query: ${text || "Analyze the provided image."}`;
            console.log('📝 Using conversation context');
        }
        
        // Add persistent context if available
        if (persistentContext) {
            contextualPrompt = `${persistentContext}\n\n${contextualPrompt}`;
            console.log('💾 Added persistent context');
        }

        console.log('🚀 Final prompt length:', contextualPrompt.length);

        // Prepare messages for OpenAI format
        const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
            {
                role: "system",
                content: getSystemInstruction(language, !!(conversationContext?.length || persistentContext))
            }
        ];

        // Add user message - handle image differently for Hugging Face
        if (image) {
            // For now, let's handle text-only requests until we confirm image support
            messages.push({
                role: "user",
                content: `${contextualPrompt}\n\n[Note: User uploaded an image of a plant/crop. Please provide agricultural advice assuming this is a crop image that needs analysis.]`
            });
        } else {
            messages.push({
                role: "user",
                content: contextualPrompt
            });
        }

        console.log('📤 Sending request to Hugging Face API...');
        console.log('Messages:', JSON.stringify(messages, null, 2));

        const response = await client.chat.completions.create({
            model: "openai/gpt-oss-120b:cerebras",
            messages,
            temperature: 0.7,
            max_tokens: 2000,
        });

        const jsonString = response.choices[0]?.message?.content?.trim();
        if (!jsonString) {
            throw new Error('No response from AI model');
        }
        
        const parsedData = JSON.parse(jsonString);
        
        return parsedData as CardData;

    } catch (error) {
        console.error("Hugging Face API error:", error);
        
        // Log more detailed error information
        if (error instanceof Error) {
            console.error("Error name:", error.name);
            console.error("Error message:", error.message);
            if ('status' in error) {
                console.error("Status code:", (error as any).status);
            }
            if ('response' in error) {
                console.error("Response:", (error as any).response);
            }
        }
        
        return null;
    }
};
