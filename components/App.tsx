import AppController from "@/state/AppController"
import { observer, useLocalObservable } from "mobx-react-lite"
import { useEffect } from "react"
import WorkloadForm from "./WorkloadForm"
import WorkloadList from "./WorkloadList"

export const App = observer(() => {
  const app = useLocalObservable(() => {
    return new AppController()
  })

  useEffect(() => {
    app.init()
  }, [app])

  return (
    <div>
      <h1>CloudWork</h1>
      <hr />
      <div>
        <h2>Create workload</h2>
        <WorkloadForm onSubmit={app.createWorkload} />
      </div>
      <hr />
      <div>
        <h2>Workloads</h2>
        <WorkloadList
          workloads={app.workloads}
          cancelWorkload={app.cancelWorkload}
        />
      </div>
    </div>
  )
})

export default App
