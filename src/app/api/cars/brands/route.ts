import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Car from "@/lib/models/Car";

export async function GET() {
  await connectDB();

  try {
    // Busca todas as marcas distintas no banco de dados
    const brands = await Car.distinct("brand");

    return NextResponse.json(brands);
  } catch (error) {
    console.error("Erro ao buscar marcas:", error);
    return NextResponse.json({ message: "Erro ao buscar marcas" }, { status: 500 });
  }
}
