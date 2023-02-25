import { makeAutoObservable, runInAction } from "mobx"
import { observer, useLocalObservable } from "mobx-react-lite"

interface WorkloadFormProps {
  onSubmit: (params: { complexity: number }) => Promise<unknown>
}

export const WorkloadForm = observer<WorkloadFormProps>((props) => {
  const formController = useLocalObservable(
    () => new WorkloadFormController(props.onSubmit)
  )

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        formController.submit()
      }}
    >
      <div>
        <label>
          Complexity: {formController.complexity}
          <br />
          <input
            value={formController.complexity}
            onChange={(e) => {
              runInAction(() => {
                formController.complexity = Number(e.target.value)
              })
            }}
            type="range"
            min="1"
            max="10"
          />
        </label>
      </div>

      <div>
        <button type="submit" disabled={formController.loading}>
          {formController.loading ? "Starting…" : "Start work"}
        </button>
      </div>
    </form>
  )
})

export default WorkloadForm

class WorkloadFormController {
  private createWorkload: WorkloadFormProps["onSubmit"]

  loading = false
  complexity = 1

  constructor(createWorkload: WorkloadFormProps["onSubmit"]) {
    this.createWorkload = createWorkload
    makeAutoObservable(this)
  }

  private reset = () => {
    this.complexity = 1
    this.loading = false
  }

  private startLoading = () => {
    this.loading = true
  }

  private endLoading = () => {
    this.loading = false
  }

  submit = async () => {
    this.startLoading()
    try {
      await this.createWorkload({ complexity: this.complexity })
      this.reset()
    } catch (error) {
      window.alert("Failed to submit workload")
      console.error("Failed to submit workload", error)
    }
    this.endLoading()
  }
}
