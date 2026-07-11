"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowExecutionController = void 0;
const common_1 = require("@nestjs/common");
const create_workflow_definition_dto_1 = require("./dto/create-workflow-definition.dto");
const start_workflow_dto_1 = require("./dto/start-workflow.dto");
const workflow_execution_service_1 = require("./workflow-execution.service");
let WorkflowExecutionController = class WorkflowExecutionController {
    constructor(workflows) {
        this.workflows = workflows;
    }
    createDefinition(dto) {
        return this.workflows
            .createDefinition(dto);
    }
    listDefinitions() {
        return this.workflows
            .listDefinitions();
    }
    getDefinition(id) {
        return this.workflows
            .getDefinition(id);
    }
    start(id, dto) {
        return this.workflows.start(id, dto);
    }
    execute(id) {
        return this.workflows.execute(id);
    }
    listExecutions() {
        return this.workflows
            .listExecutions();
    }
    getExecution(id) {
        return this.workflows
            .getExecution(id);
    }
};
exports.WorkflowExecutionController = WorkflowExecutionController;
__decorate([
    (0, common_1.Post)("definitions"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_workflow_definition_dto_1.CreateWorkflowDefinitionDto]),
    __metadata("design:returntype", void 0)
], WorkflowExecutionController.prototype, "createDefinition", null);
__decorate([
    (0, common_1.Get)("definitions"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WorkflowExecutionController.prototype, "listDefinitions", null);
__decorate([
    (0, common_1.Get)("definitions/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WorkflowExecutionController.prototype, "getDefinition", null);
__decorate([
    (0, common_1.Post)("definitions/:id/start"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, start_workflow_dto_1.StartWorkflowDto]),
    __metadata("design:returntype", void 0)
], WorkflowExecutionController.prototype, "start", null);
__decorate([
    (0, common_1.Post)("executions/:id/run"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WorkflowExecutionController.prototype, "execute", null);
__decorate([
    (0, common_1.Get)("executions"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WorkflowExecutionController.prototype, "listExecutions", null);
__decorate([
    (0, common_1.Get)("executions/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WorkflowExecutionController.prototype, "getExecution", null);
exports.WorkflowExecutionController = WorkflowExecutionController = __decorate([
    (0, common_1.Controller)("production-hardening-v7/mega-pack-6/workflows"),
    __metadata("design:paramtypes", [workflow_execution_service_1.WorkflowExecutionService])
], WorkflowExecutionController);
//# sourceMappingURL=workflow-execution.controller.js.map