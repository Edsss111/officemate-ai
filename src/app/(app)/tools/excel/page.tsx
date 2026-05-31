import { PageHeader } from "@/components/layout/page-header";
import { ExcelFormulaTool } from "@/components/tools/excel-formula-tool";

export default function ExcelToolPage() {
  return (
    <>
      <PageHeader
        title="Excel Formula Generator"
        description="Describe what you need in plain English — get a formula and explanation."
      />
      <ExcelFormulaTool />
    </>
  );
}
