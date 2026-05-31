import { PageHeader } from "@/components/layout/page-header";
import { EmailWriter } from "@/components/tools/email-writer";

export default function EmailToolPage() {
  return (
    <>
      <PageHeader
        title="Email Writer"
        description="Generate professional emails with subject lines and alternative versions."
      />
      <EmailWriter />
    </>
  );
}
