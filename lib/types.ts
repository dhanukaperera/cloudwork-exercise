export type WorkStatus = "WORKING" | "SUCCESS" | "FAILURE" | "CANCELED"

export type WorkId = number

export interface Work {
  id: WorkId
  complexity: number
  completeDate: Date
  status: WorkStatus
}

export interface CreateRequest {
  complexity: number
}

export interface CreateResponse {
  work: Work
}

export interface GetRequest {
  id: WorkId
}

export interface GetResponse {
  work: Work
}

export interface GetAllRequest {}

export interface GetAllResponse {
  workloads: Work[]
}

export interface CancelRequest {
  id: WorkId
}

export interface CancelResponse {
  work: Work
}
export interface WorkloadTimeout {
  id: number
  timeout: NodeJS.Timeout
}
