import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AuditLogDetailsModalProps {
    log: any;
    isOpen: boolean;
    onClose: () => void;
}

export function AuditLogDetailsModal({ log, isOpen, onClose }: AuditLogDetailsModalProps) {
    if (!log) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl h-[80vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        Audit Details
                        <Badge variant={log.responseStatus >= 400 ? "destructive" : "default"}>
                            {log.responseStatus || 'N/A'}
                        </Badge>
                    </DialogTitle>
                    <DialogDescription>
                        Request ID: {log._id} | Duration: {log.duration ? `${log.duration}ms` : 'N/A'}
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="overview" className="h-full">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="changes">Changes (Diff)</TabsTrigger>
                        <TabsTrigger value="payload">Payload</TabsTrigger>
                        <TabsTrigger value="metadata">Metadata</TabsTrigger>
                    </TabsList>

                    <ScrollArea className="h-[60vh] mt-4 border rounded-md p-4">
                        <TabsContent value="overview" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Action</h4>
                                    <p>{log.action}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Module</h4>
                                    <p>{log.module}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Actor</h4>
                                    <p>{log.actor?.role} ({log.actor?.ip})</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Target</h4>
                                    <p>{log.target?.resource}: {log.target?.resourceId}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
                                    <p>{new Date(log.timestamp).toLocaleString()}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Device</h4>
                                    <p>{log.metadata?.device || log.metadata?.userAgent || 'Unknown'}</p>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="changes">
                            {log.changes?.diffs ? (
                                <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-auto text-xs">
                                    {JSON.stringify(log.changes.diffs, null, 2)}
                                </pre>
                            ) : (
                                <div className="text-center text-muted-foreground py-8">No changes recorded</div>
                            )}
                        </TabsContent>

                        <TabsContent value="payload">
                            {log.requestPayload ? (
                                <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-auto text-xs">
                                    {JSON.stringify(log.requestPayload, null, 2)}
                                </pre>
                            ) : (
                                <div className="text-center text-muted-foreground py-8">No payload data</div>
                            )}
                        </TabsContent>

                        <TabsContent value="metadata">
                            <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-auto text-xs">
                                {JSON.stringify(log.metadata, null, 2)}
                            </pre>
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
