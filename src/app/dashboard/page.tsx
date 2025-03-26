"use client";

import {
  Button,
  Card,
  Group,
  Table,
  Text,
  Title,
  Select,
  NumberInput,
  TextInput,
  Stack,
} from "@mantine/core";
import { BarChart } from "@mantine/charts";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Car } from "@/types/Car";
import { useAuthGuard } from "@/hooks/useAuthGuard"; // ✅ useAuthGuard
import Sidebar from "../../components/Sidebar";

export default function DashboardPage() {
  const { session, status } = useAuthGuard(); // ✅ Proteção

  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    brand: "",
    year: "",
    priceMin: "",
    priceMax: "",
    model: "",
  });
  const [colors] = useState([
    "#228be6", "#15aabf", "#12b886", "#fab005",
    "#fa5252", "#cc5de8", "#5c7cfa",
  ]);

  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchCars = async () => {
      try {
        const params = new URLSearchParams();
        if (filters.brand) params.append("brand", filters.brand);
        if (filters.year) params.append("yearFrom", filters.year);
        if (filters.priceMin) params.append("priceFrom", filters.priceMin);
        if (filters.priceMax) params.append("priceTo", filters.priceMax);
        if (filters.model) params.append("model", filters.model);

        const res = await fetch(`/api/cars?${params.toString()}`);
        const data = await res.json();
        setCars(data);

        const uniqueBrands = [...new Set(data.map((car: Car) => car.brand))];
        setBrands(uniqueBrands);
      } catch (err) {
        console.error("Erro ao buscar carros:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [filters, status]);

  if (status === "loading") {
    return <Text>Carregando sessão...</Text>;
  }

  const carsPerBrand = cars.reduce((acc: Record<string, number>, car) => {
    acc[car.brand] = (acc[car.brand] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(carsPerBrand).map(([brand, total], index) => ({
    brand,
    total,
    color: colors[index % colors.length],
  }));

  return (
    <div className="flex">
      <Sidebar/>
      <div className="flex flex-col w-full p-8">
        <Group className="mb-6" justify="space-between">
          <Title order={2}>Dashboard</Title>
          <Button
            component={Link}
            href="/cars/create"
            leftSection={<IconPlus size={16} />}
          >
            Novo Carro
          </Button>
        </Group>

        {/* Filtros */}
        <Card withBorder mb="md">
          <Stack>
            <Group grow>
              <TextInput
                label="Buscar por modelo"
                value={filters.model}
                onChange={(e) =>
                  setFilters({ ...filters, model: e.currentTarget.value })
                }
              />
              <Select
                label="Marca"
                data={brands}
                value={filters.brand}
                onChange={(value) =>
                  setFilters({ ...filters, brand: value || "" })
                }
              />
              <NumberInput
                label="Ano"
                value={filters.year}
                onChange={(value) =>
                  setFilters({ ...filters, year: value?.toString() || "" })
                }
              />
              <NumberInput
                label="Preço mín."
                value={filters.priceMin}
                onChange={(value) =>
                  setFilters({ ...filters, priceMin: value?.toString() || "" })
                }
              />
              <NumberInput
                label="Preço máx."
                value={filters.priceMax}
                onChange={(value) =>
                  setFilters({ ...filters, priceMax: value?.toString() || "" })
                }
              />
            </Group>
          </Stack>
        </Card>

        <Card withBorder mb="xl">
          <Title order={4} mb="md">Carros por Marca</Title>
          {chartData.length ? (
            <BarChart
              h={300}
              data={chartData}
              dataKey="brand"
              series={[{ name: "total", color: "color" }]}
              withLegend={false}
              withTooltip={false}
              className="bg-white"
            />
          ) : (
            <Text size="sm">Nenhum dado disponível.</Text>
          )}
        </Card>

        <Card withBorder>
          <Title order={4} mb="md">Lista de Carros</Title>
          {cars.length ? (
            <Table striped highlightOnHover withTableBorder>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Modelo</Table.Th>
                  <Table.Th>Marca</Table.Th>
                  <Table.Th>Ano</Table.Th>
                  <Table.Th>Preço</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {cars.map((car) => (
                  <Table.Tr key={car._id}>
                    <Table.Td>{car.model}</Table.Td>
                    <Table.Td>{car.brand}</Table.Td>
                    <Table.Td>{car.year}</Table.Td>
                    <Table.Td>
                      R$ {Number(car.price).toLocaleString("pt-BR")}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          ) : (
            <Text size="sm">Nenhum carro cadastrado.</Text>
          )}
        </Card>
      </div>
    </div>
  );
}
