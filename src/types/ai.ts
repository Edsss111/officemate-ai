export type EmailTone =
  | "professional"
  | "friendly"
  | "firm"
  | "apologetic"
  | "persuasive";

export type EmailWriterOutput = {
  subject: string;
  body: string;
  alternatives: Array<{ subject: string; body: string }>;
};

export type ExcelFormulaOutput = {
  formula: string;
  explanation: string;
  alternative: string;
  example: string;
};

export type SopGeneratorOutput = {
  objective: string;
  scope: string;
  responsibilities: string[];
  procedure: string[];
  approvalBlock: string;
};
