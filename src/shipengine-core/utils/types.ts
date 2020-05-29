import { OrderApp, CarrierApp, AppType } from '@shipengine/integration-platform-sdk';

export type App = CarrierApp | OrderApp;

export type AppTypes = AppType.Carrier | AppType.Order;

export enum DeploymentStatus {
  Queued = "queued",
  Building = "building",
  Deploying = "deploying",
  Running = "running",
  Terminated = "terminated",
  Error = "error"
}

export type DeploymentStatusObj = {
  package: {
    name: string;
    download: string;
  },
  deployId: string;
  status: DeploymentStatus;
  createdAt: string;
  updatedAt: string;
}