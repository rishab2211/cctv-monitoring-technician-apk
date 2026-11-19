/**
 * @file types/index.ts
 * @description Types for Technician Mobile App (Onboarding, GB28181 Pairing, Jobs)
 */

export type JobStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  notes?: string;
}

export interface GB28181ConfigPayload {
  type: 'GB28181_CONFIG';
  sipServer: string;
  sipPort: number;
  serverDomain: string;
  serverId: string;
  deviceId: string;
  password: string;
  serialNumber?: string;
}

export interface InstallationJob {
  _id: string;
  jobCode: string;
  customerName: string;
  customerPhone: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  status: JobStatus;
  cameraModel: string;
  cameraSerial?: string;
  checklist: ChecklistItem[];
  photos: string[];
  signature?: string;
  scheduledAt: string;
  completedAt?: string;
}

export interface ApiResponse<T = any> {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T;
}
