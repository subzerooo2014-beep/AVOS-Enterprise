import { CreateChangeWindowDto, UpdateChangeWindowStatusDto } from "../dto";
import { RuntimeChangeWindowService } from "../services";
export declare class RuntimeChangeWindowController {
    private readonly changeWindows;
    constructor(changeWindows: RuntimeChangeWindowService);
    create(dto: CreateChangeWindowDto): import("..").GovernanceChangeWindow;
    list(): import("..").GovernanceChangeWindow[];
    get(id: string): import("..").GovernanceChangeWindow;
    updateStatus(id: string, dto: UpdateChangeWindowStatusDto): import("..").GovernanceChangeWindow;
}
