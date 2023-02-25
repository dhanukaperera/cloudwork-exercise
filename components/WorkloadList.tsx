import type { Work } from "@/lib/types"
import { observer } from "mobx-react-lite"
import WorkloadItem from "./WorkloadItem"

interface WorkloadListProps {
  workloads: Work[]
  cancelWorkload: (work: Work) => Promise<void>
}

export const WorkloadList = observer<WorkloadListProps>(
  ({ workloads, cancelWorkload }) => {
    return (
      <ul>
        {workloads.map((work) => (
          <li key={work.id}>
            <WorkloadItem work={work} onCancel={() => cancelWorkload(work)} />
          </li>
        ))}
      </ul>
    )
  }
)

export default WorkloadList
