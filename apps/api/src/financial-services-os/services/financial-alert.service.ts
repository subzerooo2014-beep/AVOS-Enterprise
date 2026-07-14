import { Injectable } from "@nestjs/common"; @Injectable() export class FinancialAlertService { create(input:any){return {id:`financial_alert_${Date.now()}`,...input,status:"OPEN"};} }
