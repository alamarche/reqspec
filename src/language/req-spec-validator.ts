import { AstNode, ValidationAcceptor, ValidationChecks, Reference, Properties } from 'langium';
// import { Category, CompFunction, Developer, Goal, GoalDocument, GoalSet, ReqSpecAstType, Requirement, RequirementDocument, RequirementSet } from './generated/ast';
import { Goal, ReqSpecAstType, Requirement } from './generated/ast';

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
        Requirement: validator.checkSelfReference<Requirement>,
        Goal: validator.checkSelfReference<Goal>
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
    name: string
    decomposes?: Array<Reference>
    evolves?: Array<Reference>
    inherits?: Array<Reference>
    refines?: Array<Reference>
    conflicting?: Array<Reference>
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

    /**
     * Ensures that Requirement and Goal type references 
     * 
     * TODO - This really should defined from a generalized function. Lots of repetition. Just struggling with the TS typing
     * 
     * @param item Requirement or Goal type
     * @param accept 
     */
    checkSelfReference<T extends ReqGoalRefs>(item: T, accept: ValidationAcceptor): void { //<T extends AstNode & {name: string}>
        
        if ( item.decomposes && _checkSelfReference(item, item.decomposes) ) // TODO - type casting shouldn't be needed
            accept('error', `${item.$type} '${item.name}' cannot decompose itself`, 
            { node: item, property: 'decomposes' as Properties<T>, code: ReqSpecIssueCodes.SelfReference } )
        
        if ( item.evolves && _checkSelfReference(item, item.evolves) ) // TODO - type casting shouldn't be needed
            accept('error', `${item.$type} '${item.name}' cannot evolve itself`, 
            { node: item, property: 'evolves' as Properties<T>, code: ReqSpecIssueCodes.SelfReference } )

        if ( item.refines && _checkSelfReference(item, item.refines) ) // TODO - type casting shouldn't be needed
            accept('error', `${item.$type} '${item.name}' cannot refine itself`, 
            { node: item, property: 'inherits' as Properties<T>, code: ReqSpecIssueCodes.SelfReference } )

        if ( item.inherits && _checkSelfReference(item, item.inherits) ) // TODO - type casting shouldn't be needed
            accept('error', `${item.$type} '${item.name}' cannot inherit from itself`, 
            { node: item, property: 'refines' as Properties<T>, code: ReqSpecIssueCodes.SelfReference } )
    
        if ( item.conflicting && _checkSelfReference(item, item.conflicting) ) // TODO - type casting shouldn't be needed
            accept('error', `${item.$type} '${item.name}' cannot inherit from itself`, 
            { node: item, property: 'conflicting' as Properties<T>, code: ReqSpecIssueCodes.SelfReference } )
    }
        


}
