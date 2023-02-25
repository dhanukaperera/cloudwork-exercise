import CloudworkService from "@/lib/mock-service"
import type {
  CreateRequest,
  GetAllResponse,
  Work,
  WorkloadTimeout,
} from "@/lib/types"
import { getTimeDiff } from "@/utils/datatime.utils"
import { runInAction, makeAutoObservable } from "mobx"

export class AppController {
  private hasInit = false

  private cloudworkClient = new CloudworkService()

  private workerTimeouts: WorkloadTimeout[] = []

  private fetchedData: GetAllResponse | undefined = undefined

  constructor() {
    makeAutoObservable(this)
  }

  get workloads(): Work[] {
    return this.fetchedData?.workloads || []
  }

  init = () => {
    // react strict-mode in development calls useEffects twice
    if (this.hasInit) return
    this.hasInit = true

    this.fetchedData = {
      workloads: [],
    }
  }

  private createWorkloadTimer = (work: Work): void => {
    const workerDuration = getTimeDiff(work.completeDate)

    const workerTimeout = setTimeout(() => {
      this.updateWorkloadStatus(work)
    }, workerDuration)

    const workloadTimeout: WorkloadTimeout = {
      id: work.id,
      timeout: workerTimeout,
    }
    runInAction(() => {
      this.workerTimeouts.push(workloadTimeout)
    })
  }

  private updateWorkloadStatus = async (work: Work): Promise<void> => {
    try {
      const response = await this.cloudworkClient.getWorkload({ id: work.id })
      const findWorker = this.findWorkload(response.work)

      if (findWorker) {
        runInAction(() => {
          findWorker.status = response.work.status
        })
      }
      this.clearWorkloadTimeout(work)
    } catch (e) {
      console.error("updateWorkloadStatus error : " + e)
      alert(e)
    }
  }

  private findWorkload = (work: Work): Work | undefined => {
    return this.workloads.find((w) => w.id === work.id)
  }

  private findWorkerTimeout = (
    workerId: number
  ): WorkloadTimeout | undefined => {
    return this.workerTimeouts.find((wt) => wt.id === workerId)
  }

  private clearWorkloadTimeout = (work: Work): void => {
    if (work.status === "CANCELED") {
      const workerTimer = this.findWorkerTimeout(work.id)
      if (workerTimer) {
        clearTimeout(workerTimer.timeout)
      }
    }

    const index = this.workerTimeouts.findIndex((wt) => wt.id === work.id)
    if (index !== -1) {
      runInAction(() => {
        this.workerTimeouts.splice(index, 1)[0]
      })
    }
  }

  createWorkload = async (params: CreateRequest): Promise<void> => {
    try {
      const response = await this.cloudworkClient.create(params)
      runInAction(() => {
        this.fetchedData?.workloads.push(response.work)
      })
      this.createWorkloadTimer(response.work)
    } catch (e) {
      console.error("createWorkload error : " + e)
      alert(e)
    }
  }

  cancelWorkload = async (work: Work) => {
    try {
      const response = await this.cloudworkClient.cancelWorkload({
        id: work.id,
      })

      const findWorker = this.findWorkload(response.work)
      if (findWorker) {
        runInAction(() => {
          findWorker.status = response.work.status
        })
      }
      this.clearWorkloadTimeout(work)
    } catch (e) {
      console.error("cancelWorkload error : " + e)
      alert(e)
    }
  }
}

export default AppController
