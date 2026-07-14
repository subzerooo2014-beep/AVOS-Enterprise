import { Injectable } from "@nestjs/common"; @Injectable() export class PaymentGatewayService { providers(){return ["SANDBOX_CARD","SANDBOX_BANK","SANDBOX_WALLET"]; } }
