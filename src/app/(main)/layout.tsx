import Header from "@/components/Header";

// Shell for every logged-in page: header on top, the page below it.
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
