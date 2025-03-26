import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import FinancingRequest from "@/lib/models/FinancingRequest";

export async function POST(req: Request) {
  try {
    // Para logar informações básicas da requisição
    console.log({
      method: req.method,
      url: req.url,
      headers: Object.fromEntries(req.headers.entries()),
    });

    // Ler o corpo da requisição corretamente
    const body = await req.json();
    console.log("Corpo da requisição:", body);
    
    await connectDB();

    const newRequest = await FinancingRequest.create({
      ...body,
      status: "PENDING"
    });

    return NextResponse.json({ 
      success: true, 
      insertedId: newRequest._id 
    });
  } catch (error) {
    console.error("Erro ao salvar solicitação de financiamento:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno" }, 
      { status: 500 }
    );
  }
}