import { Injectable } from "@nestjs/common"; @Injectable() export class HealthCenterService { status(){return {success:true,system:"AVOS Enterprise Platform Runtime",status:"healthy"};} }
