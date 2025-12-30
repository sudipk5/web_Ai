
export enum DeploymentStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  BUILDING = 'BUILDING',
  DEPLOYING = 'DEPLOYING',
  READY = 'READY',
  FAILED = 'FAILED'
}

export interface ProjectAnalysis {
  framework: string;
  confidence: number;
  buildCommands: string[];
  suggestedDistDir: string;
  summary: string;
  generatedPreview?: string;
}

export interface DeploymentRecord {
  id: string;
  name: string;
  url: string;
  customDomain?: string;
  framework: string;
  createdAt: number;
  status: DeploymentStatus;
  previewUrl?: string;
  htmlContent?: string; // Store raw HTML for export
}
