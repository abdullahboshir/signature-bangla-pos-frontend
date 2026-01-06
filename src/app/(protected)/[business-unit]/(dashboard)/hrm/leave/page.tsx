import LeaveList from "@/components/modules/hrm/LeaveList"

export default function LeavePage({ params }: { params: { 'business-unit': string } }) {
    return <LeaveList businessUnitId={params['business-unit']} />
}
