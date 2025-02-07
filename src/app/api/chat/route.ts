import { NextResponse } from 'next/server';
import { getHuggingFaceResponse } from '../../../lib/huggingface';



export async function POST(req: Request) {
  const { message } = await req.json();
  
  try {
    // Get response from Hugging Face API
    const botResponse = await getHuggingFaceResponse(message);
    
    return NextResponse.json({ reply: botResponse });
  } catch (error) {
    console.error("Error processing chat message:", error);
    return NextResponse.json({ reply: "Sorry, something went wrong." }, { status: 500 });
  }
}
