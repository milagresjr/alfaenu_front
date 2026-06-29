import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Criar Conta",
  description: "Crie a sua conta na plataforma Alfaenu",
};

export default function SignUp() {
  return <SignUpForm />;
}
