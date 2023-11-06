import { AstNode, ValidationAcceptor, ValidationChecks, Reference, Properties } from 'langium';
// import { Category, CompFunction, Developer, Goal, GoalDocument, GoalSet, ReqSpecAstType, Requirement, RequirementDocument, RequirementSet } from './generated/ast';
import { ReqSpecAstType, Requirement } from './generated/ast';

import type { ReqSpecServices } from './req-spec-module';

export namespace ReqSpecIssueCodes {
    export const CapitalLetter = 'first-letter-capital'
    export const SelfReference = 'self-reference'
}

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: ReqSpecServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.ReqSpecValidator;

    const checks: ValidationChecks<ReqSpecAstType> = {
        AstNode:  validator.checkStartsWithCapital,
        Requirement: validator.checkSelfReference<Requirement>
    };

    registry.register(checks, validator);
}

function _checkSelfReference<T extends AstNode>(self:T, refs: Array<Reference<T>>) {
    
    let nSelf = self as unknown as AstNode & {name:string}
    let nRefs = refs as Array<Reference<T & {name:string}>>

    for (const ref of nRefs) {
        if (ref.ref && nSelf.name === ref.ref.name) return true
    }
    return false
}

interface ReqGoalRefs extends AstNode {
    decomposes?: Array<Reference>
    evolves?: Array<Reference>
    inherits?: Array<Reference>
    refines?: Array<Reference>
}

/**
 * Implementation of custom validations.
 */
export class ReqSpecValidator {

    checkStartsWithCapital(item: AstNode, accept: ValidationAcceptor): void {
        
        let newItem = item as AstNode & {name:string}

        if (newItem.name) {
            const firstChar = newItem.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', `${item.$type} name should start with a capital.`, 
                { node: item, property: 'name', code: ReqSpecIssueCodes.CapitalLetter});
            }
        }
    }

    checkSelfReference<T extends ReqGoalRefs, AstNode>(item: T, accept: ValidationAcceptor): void { //<T extends AstNode & {name: string}>
        
        const keys: keyOmit<keyof ReqGoalRefs, keyof AstNode>[] = ["decomposes", "evolves", "inherits", "refines"]

            for (const k of keys) {
                if ( item[k as keyof ReqGoalRefs] && _checkSelfReference(item, item[k as keyof T] as Array<Reference<T>>) ) // TODO - type casting shouldn't be needed
                    accept('error', `${item.$type} cannot decompose itself`, 
                    { node: item, property: 'decomposes' as Properties<T>, code: ReqSpecIssueCodes.SelfReference } )
                }
    }

    // checkGoalSelfReference(goal: Goal, accept: ValidationAcceptor): void {

    // }

}
