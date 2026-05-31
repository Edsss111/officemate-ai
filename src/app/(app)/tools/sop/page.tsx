import { PageHeader } from "@/components/layout/page-header";
import { SopGeneratorTool } from "@/components/tools/sop-generator-tool";

export default function SopToolPage() {
  return (
    <>
      <PageHeader
        title="SOP Generator"
        description="Create structured standard operating procedures for your team."
      />
      <SopGeneratorTool />
    </>
  );
}
