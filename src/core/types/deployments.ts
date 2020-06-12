export enum DeploymentStatus {
  Queued = "queued",
  Building = "building",
  Deploying = "deploying",
  Running = "running",
  Terminated = "terminated",
  Error = "error",
}

export type Deployment = {
  package: {
    name: string;
    version: string | null;
  };
  deployId: string;
  status: DeploymentStatus;
  createdAt: string;
  updatedAt: string;
};
