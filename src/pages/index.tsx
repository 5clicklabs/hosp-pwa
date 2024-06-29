import AddToHomeScreenPrompt from "@/components/add-to-homescreen-prompt";

export default function Home() {
  return (
    <>
      <h1 className="text-3xl font-bold underline">
        Hello world!
        <AddToHomeScreenPrompt />
      </h1>
    </>
  );
}
