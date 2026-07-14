import { Injectable } from "@nestjs/common"; @Injectable() export class GrowthAlertService { create(input:any){return {id:`growth_alert_${Date.now()}`,...input,status:"OPEN"};} }
