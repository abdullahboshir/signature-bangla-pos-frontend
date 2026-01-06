import AttendanceTracker from "@/components/modules/hrm/AttendanceTracker"

export default function AttendancePage({ params }: { params: { 'business-unit': string } }) {
    return <AttendanceTracker businessUnitId={params['business-unit']} />
}
