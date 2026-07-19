import { Module } from "@nestjs/common";
import { FactoryEventsModule } from "../events/events.module";
import { FactoryArtifactService } from "./artifact.service";
import { FactoryProjectService } from "./project.service";
import { FactorySnapshotService } from "./snapshot.service";
import { FactoryWorkspaceService } from "./workspace.service";

@Module({
  imports: [FactoryEventsModule],
  providers: [
    FactoryArtifactService,
    FactoryProjectService,
    FactorySnapshotService,
    FactoryWorkspaceService,
  ],
  exports: [
    FactoryArtifactService,
    FactoryProjectService,
    FactorySnapshotService,
    FactoryWorkspaceService,
  ],
})
export class FactoryWorkspaceModule {}
