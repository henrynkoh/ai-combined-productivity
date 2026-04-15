import { HomeLanding } from "@/components/home/HomeLanding";
import { week } from "@/data/week";

export default function HomePage() {
  return <HomeLanding week={week} />;
}
