import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Aceda à sua conta na plataforma Alfaenu",
};

export default function SignIn() {
  return <SignInForm />;
}
