"use client";

import {
  Button,
  Card,
  FileInput,
  MultiSelect,
  NumberInput,
  Select,
  Stack,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";

export default function CarCreatePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    model: "",
    brand: "",
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    detail: "",
    description: "",
    transmission: "",
    fuel: "",
    licensePlateEnd: 0,
    doors: 4,
    color: "",
    options: [] as string[],
  });
  const [mainImg, setMainImg] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);

  const handleSubmit = async () => {
    if (!mainImg || images.length === 0) {
      notifications.show({ color: "red", message: "Imagens são obrigatórias" });
      return;
    }

    const formData = new FormData();
    formData.append("mainImg", mainImg);
    images.forEach((img) => formData.append("images", img));
    Object.entries(form).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append("options", v));
      } else {
        formData.append(key, value.toString());
      }
    });

    const res = await fetch("/api/cars", { method: "POST", body: formData });
    if (res.ok) {
      notifications.show({ color: "green", message: "Carro cadastrado com sucesso!" });
      router.push("/dashboard");
    } else {
      notifications.show({ color: "red", message: "Erro ao cadastrar carro" });
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={3} mb="md">Cadastrar Novo Carro</Title>
      <Stack>
        <TextInput label="Modelo" value={form.model} onChange={(e) => setForm({ ...form, model: e.currentTarget.value })} />
        <TextInput label="Marca" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.currentTarget.value })} />
        <NumberInput label="Ano" value={form.year} onChange={(v) => setForm({ ...form, year: Number(v) })} />
        <NumberInput label="Preço" value={form.price} onChange={(v) => setForm({ ...form, price: Number(v) })} />
        <NumberInput label="Quilometragem" value={form.mileage} onChange={(v) => setForm({ ...form, mileage: Number(v) })} />
        <TextInput label="Detalhes" value={form.detail} onChange={(e) => setForm({ ...form, detail: e.currentTarget.value })} />
        <Textarea label="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.currentTarget.value })} />
        <Select label="Transmissão" data={["Automático", "Manual"]} value={form.transmission} onChange={(v) => setForm({ ...form, transmission: v || "" })} />
        <Select label="Combustível" data={["Flex", "Gasolina", "Etanol", "Diesel"]} value={form.fuel} onChange={(v) => setForm({ ...form, fuel: v || "" })} />
        <NumberInput label="Final da Placa" value={form.licensePlateEnd} onChange={(v) => setForm({ ...form, licensePlateEnd: Number(v) })} />
        <NumberInput label="Portas" value={form.doors} onChange={(v) => setForm({ ...form, doors: Number(v) })} />
        <TextInput label="Cor" value={form.color} onChange={(e) => setForm({ ...form, color: e.currentTarget.value })} />

        <MultiSelect
          label="Opcionais"
          data={["Ar condicionado", "Airbag", "Freio ABS", "Câmera de ré", "Multimídia", "Vidros elétricos"]}
          value={form.options}
          onChange={(value) => setForm({ ...form, options: value })}
        />

        <FileInput label="Imagem Principal" onChange={setMainImg} accept="image/*" />
        <FileInput label="Outras Imagens" multiple onChange={setImages} accept="image/*" />

        <Button onClick={handleSubmit}>Cadastrar</Button>
      </Stack>
    </Card>
  );
}
