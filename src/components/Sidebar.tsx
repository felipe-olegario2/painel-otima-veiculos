"use client";

import { NavLink, Stack, Text } from "@mantine/core";
import {
  IconDashboard,
  IconCar,
  IconPlus,
  IconUsers,
  IconLogout,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-r-2 border-gray-100 w-64 min-h-screen px-6 py-8 shadow-md">
      <Text size="xl" fw={700} mb="lg">
        Painel Ótima Veículos
      </Text>

      <Stack gap="xs">
        <NavLink
          label="Dashboard"
          component={Link}
          href="/dashboard"
          leftSection={<IconDashboard size={18} />}
          active={pathname === "/dashboard"}
        />
        <NavLink
          label="Cadastrar Carro"
          component={Link}
          href="/cars/create"
          leftSection={<IconPlus size={18} />}
          active={pathname === "/cars/create"}
        />
        <NavLink
          label="Contatos"
          component={Link}
          href="/contacts"
          leftSection={<IconUsers size={18} />}
          active={pathname === "/contacts"}
        />
        <NavLink
          label="Sair"
          leftSection={<IconLogout size={18} />}
          onClick={() => signOut({ callbackUrl: "/" })}
          color="red"
        />
      </Stack>
    </aside>
  );
}
