import { Injectable } from "@nestjs/common"; @Injectable() export class RuntimeAlertService { create(input:any){return {id:`runtime_alert_${Date.now()}`,...input,status:"OPEN"};} }
