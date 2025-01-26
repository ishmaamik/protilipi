import { EdgeStoreProvider } from "@/lib/edgestore";

export default function Layout({ children }) {
  return <EdgeStoreProvider>{children}</EdgeStoreProvider>;
}
