import moment from "moment"
import type {
  CancelRequest,
  CancelResponse,
  CreateRequest,
  CreateResponse,
  GetAllRequest,
  GetAllResponse,
  Work,
  WorkId,
  WorkStatus,
} from "./types"

interface Workload {
  work: Work
  timer: NodeJS.Timeout
}

export class CloudworkService {
  private workloads: Record<WorkId, Workload> = {}
  private failCounter = 0

  private sleep = (durationMs = 500) =>
    new Promise((resolve) => setTimeout(resolve, durationMs))

  create = async ({ complexity }: CreateRequest): Promise<CreateResponse> => {
    // sleep to act like a network
    await this.sleep()

    // randomly fail 25% of the time
    if (this.failCounter++ % 4 === 0) throw new Error("Random error!")

    // calculate work duration from complexity
    const seconds = complexity * 1000
    const completeDate = moment().add(complexity, "second").toDate()

    // build work object
    const id: WorkId = Object.keys(this.workloads).length + 1
    const status: WorkStatus = "WORKING"
    const work: Work = {
      id,
      complexity,
      status,
      completeDate,
    }

    // do the work
    const timer = setTimeout(() => {
      internalWork.work.status = work.id % 2 ? "FAILURE" : "SUCCESS"
    }, seconds)

    // build internal state
    const internalWork: Workload = {
      work,
      timer,
    }

    this.workloads[id] = internalWork

    return { work }
  }

  getWorkload = async ({ id }: CancelRequest): Promise<CancelResponse> => {
    await this.sleep()
    const workload = this.workloads[id]

    if (!workload) throw new Error("Workload not found")

    return {
      work: workload.work,
    }
  }

  getAllWorkloads = async (params?: GetAllRequest): Promise<GetAllResponse> => {
    return {
      workloads: Object.values(this.workloads).map((workload) => workload.work),
    }
  }

  cancelWorkload = async ({ id }: CancelRequest): Promise<CancelResponse> => {
    await this.sleep()

    const workload = this.workloads[id]
    if (!workload) throw new Error("Workload not found")

    if (workload.work.status !== "WORKING")
      throw new Error("Workload cannot be canceled")

    clearTimeout(workload.timer)
    workload.work.status = "CANCELED"

    return { work: workload.work }
  }
}

export default CloudworkService
