
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StyleControlsProps {
    data: any;
    onChange: (newData: any) => void;
}

export const StyleControls = ({ data, onChange }: StyleControlsProps) => {
    const styles = data.styles || {};

    const updateStyle = (key: string, value: any) => {
        onChange({ styles: { ...styles, [key]: value } });
    };

    return (
        <div className="space-y-3 pt-4 border-t mt-4">
            <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Block Styles</h4>

            <div className="grid grid-cols-2 gap-2">
                <div>
                    <Label className="text-xs">Padding Top (px)</Label>
                    <Input
                        type="number"
                        value={styles.paddingTop || 20}
                        onChange={(e) => updateStyle('paddingTop', parseInt(e.target.value))}
                        className="h-7 text-xs"
                    />
                </div>
                <div>
                    <Label className="text-xs">Padding Bottom</Label>
                    <Input
                        type="number"
                        value={styles.paddingBottom || 20}
                        onChange={(e) => updateStyle('paddingBottom', parseInt(e.target.value))}
                        className="h-7 text-xs"
                    />
                </div>
            </div>

            <div>
                <Label className="text-xs">Custom Height (px) <span className="text-[10px] text-muted-foreground">(Optional)</span></Label>
                <Input
                    type="number"
                    placeholder="Auto"
                    value={styles.height || ''}
                    onChange={(e) => updateStyle('height', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="h-7 text-xs"
                />
            </div>

            <div>
                <Label className="text-xs">Background Color</Label>
                <div className="flex gap-2">
                    <Input
                        type="color"
                        value={styles.backgroundColor || '#ffffff'}
                        onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                        className="w-10 h-7 p-0 border-none px-1"
                    />
                    <Input
                        type="text"
                        value={styles.backgroundColor || '#ffffff'}
                        onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                        className="flex-1 h-7 text-xs"
                    />
                </div>
            </div>

            <div>
                <Label className="text-xs">Container Width</Label>
                <Select
                    value={styles.container || 'boxed'}
                    onValueChange={(val) => updateStyle('container', val)}
                >
                    <SelectTrigger className="h-7 text-xs">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="boxed">Boxed (Center 1200px)</SelectItem>
                        <SelectItem value="full">Full Width</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};
