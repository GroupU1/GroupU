import HomePage from "@/components/home/home-page";
import LoginPage from "@/components/login/login";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return <LoginPage authContent={<HomePage />} />;
}
