import type { Route } from "./+types/home";
import { PublicationFormatter } from "../components/PublicationFormatter";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Publication Formatter" },
    { name: "description", content: "Format your manuscript for target journals" },
  ];
}

export default function Home() {
  return <PublicationFormatter />;
}
