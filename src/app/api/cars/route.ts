import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Car from "@/lib/models/Car";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.S3_REGION || "us-east-1",
  endpoint: process.env.S3_URI || "http://localhost:9000",
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY ?? "", // Usa "" caso seja undefined
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "", // Usa "" caso seja undefined
  },
});

export async function GET(req: Request) {
  await connectDB();
  
  // Pegar parâmetros da query string
  const { searchParams } = new URL(req.url);
  const yearFrom = searchParams.get("yearFrom");
  const yearTo = searchParams.get("yearTo");
  const priceFrom = searchParams.get("priceFrom");
  const priceTo = searchParams.get("priceTo");
  const brand = searchParams.get("brand");
  const model = searchParams.get("model");
  const order = searchParams.get("order"); // "asc" ou "desc"

  // Criar um objeto de filtro para MongoDB
  let filters: any = {};

  // Filtro por ano (de/até)
  if (yearFrom || yearTo) {
    filters.year = {};
    if (yearFrom) filters.year.$gte = parseInt(yearFrom);
    if (yearTo) filters.year.$lte = parseInt(yearTo);
  }

  // Filtro por preço (de/até)
  if (priceFrom || priceTo) {
    filters.price = {};
    if (priceFrom) filters.price.$gte = parseFloat(priceFrom);
    if (priceTo) filters.price.$lte = parseFloat(priceTo);
  }

  // Filtro por marca
  if (brand) {
    filters.brand = new RegExp(brand, "i"); // Case insensitive (ex: "toyota" == "Toyota")
  }

  // Filtro por modelo (nome do carro)
  if (model) {
    filters.name = new RegExp(model, "i");
  }

  // Definir ordenação (1 = crescente, -1 = decrescente)
  let sortOption: any = {};
  if (order === "asc") {
    sortOption.price = 1; // Menor preço primeiro
  } else if (order === "desc") {
    sortOption.price = -1; // Maior preço primeiro
  }

  try {
    // Buscar no MongoDB aplicando filtros e ordenação
    const cars = await Car.find(filters).sort(sortOption);
    return NextResponse.json(cars);
  } catch (error) {
    console.error("Erro ao buscar carros:", error);
    return NextResponse.json({ message: "Erro ao buscar carros" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await connectDB();

  try {
    const formData = await req.formData();
    const files = formData.getAll("images") as File[];
    const mainImgFile = formData.get("mainImg") as File;

    console.log(mainImgFile);

    if (!mainImgFile) {
      return NextResponse.json({ message: "Imagem principal obrigatória" }, { status: 400 });
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ message: "Imagens obrigatórias" }, { status: 400 });
    }

    // Upload imagem principal
    const mainImgUrl = await uploadFileToMinio(mainImgFile, "main-");

    // Upload das demais imagens
    const imageUrls: string[] = [];
    for (const file of files) {
      const url = await uploadFileToMinio(file);
      imageUrls.push(url);
    }

    // Criar o carro no banco
    const newCar = await Car.create({
      model: formData.get("model"),
      mainImg: mainImgUrl,
      price: Number(formData.get("price")),
      detail: formData.get("detail"),
      img: imageUrls,
      year: Number(formData.get("year")),
      brand: formData.get("brand"),
      description: formData.get("description"),
      mileage: Number(formData.get("mileage")),
      transmission: formData.get("transmission"),
      fuel: formData.get("fuel"),
      licensePlateEnd: Number(formData.get("licensePlateEnd")),
      doors: Number(formData.get("doors")),
      color: formData.get("color"),
      options: formData.getAll("options"),
    });

    return NextResponse.json(newCar, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar carro:", error);
    return NextResponse.json({ message: "Erro ao criar carro" }, { status: 500 });
  }
}

async function uploadFileToMinio(file: File, prefix = ""): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${Date.now()}-${prefix}${file.name}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: "otima-veiculos",
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
      ContentLength: buffer.length,
    })
  );

  return `http://localhost:9000/otima-veiculos/${fileName}`;
}