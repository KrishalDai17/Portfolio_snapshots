import PublicNav from "@/components/navigation/public-nav";
import PublicFooter from "@/components/navigation/public-footer";
import CustomCursor from "@/components/public/custom-cursor";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CustomCursor />
      <PublicNav />
      {children}
      <PublicFooter />
    </>
  );
}
