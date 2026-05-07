import { Glass } from "@/components/ui/Glass";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <Glass className="p-8 max-w-md">
        <p className="text-accent-green text-sm">{"> design tokens online"}</p>
        <h1 className="text-3xl mt-2">julien.lerosty</h1>
        <p className="text-fg-muted mt-1">terminal × liquid glass test</p>
      </Glass>
    </main>
  );
}
