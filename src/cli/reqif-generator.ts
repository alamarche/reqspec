import { AstNode } from "langium";
import { Model } from "../language/generated/ast";

// Meant to export very basic nodes from ReqSpec format to ReqIF
export function basicNodeToReqIF(model: Model, items: AstNode | AstNode[], filepath:string, destination?:string) {

}

// Meant to export the contents & references of a ReqSpec GoalDocument or RequirementDocument to ReqIF
export function documentNodeToReqIF() {

}

// Meant to export the contents & references of a ReqSpec file to ReqIF
export function fileToReqIF() {

}

// Meant to export the contents & references of a ReqSpec workspace/directory to ReqIF
export function directoryToReqIF() {

}