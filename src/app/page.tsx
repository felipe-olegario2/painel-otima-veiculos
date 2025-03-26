"use client";

import { useState } from "react";
import { TextInput, PasswordInput, Button, Card, Title, Text } from "@mantine/core";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = async () => {
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password: senha,
    });

    if (res?.ok) {
      router.push("/dashboard");
    } else {
      setErro("Credenciais inválidas.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card shadow="sm" padding="lg" radius="md" className="w-full max-w-md">
        <Title order={3} className="mb-4 text-center">Login - Ótima Veículos</Title>

        <TextInput
          label="E-mail"
          placeholder="admin@otima.com"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          required
        />

        <PasswordInput
          label="Senha"
          placeholder="••••••"
          value={senha}
          onChange={(e) => setSenha(e.currentTarget.value)}
          required
          className="mt-3"
        />

        {erro && <Text c="red" size="sm" mt={10}>{erro}</Text>}

        <Button fullWidth className="mt-5 bg-blue-600 text-white" onClick={handleLogin}>
          Entrar
        </Button>
      </Card>
    </div>
  );
}
