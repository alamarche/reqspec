import { AstNode, ValidationAcceptor, ValidationChecks, Reference, Properties } from 'langium';
// import { Category, CompFunction, Developer, Goal, GoalDocument, GoalSet, ReqSpecAstType, Requirement, RequirementDocument, RequirementSet } from './generated/ast';
import { Goal, ReqSpecAstType, Requirement } from './generated/ast';

import type { ReqSpecServices } from './req-spec-module';

export namespace ReqSpecIssueCodes {
    export const CapitalLetter = 'first-letter-capital'
    export const SelfReference = 'self-reference'
    export const DuplicateReference = 'dupe-reference'
}

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: ReqSpecServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.ReqSpecValidator;

    const checks: ValidationChecks<ReqSpecAstType> = {
        AstNode:  validator.checkStartsWithCapital,
        Requirement: [
            validator.checkSelfReference<Requirement>,
            validator.checkDuplicateReference<Requirement>
        ],
        Goal: [
            validator.checkSelfReference<Goal>,
            validator.checkDuplicateReference<Goal>
        ]
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

/**
 * 
 * @param refs An array of cross-references from any grammar-element property
 * @returns A list of cross-reference names that are duplicate
 */
function _countReferences(refs: Array<Reference<AstNode>>): boolean {

    // Create set of unique AstNode references
    let refNames = refs.map((ref) => ref.$nodeDescription!.name)
    let set: Set<string> = new Set(refNames)

    if ( refs.length === set.size || refs.length === 0) return false // exit if all unique or no references supplied

    return true
}

interface Named {
    name: string 
}

interface ReqGoalRefs extends AstNode, Named {
    decomposes?: Array<Reference>
    evolves?: Array<Reference>
    inherits?: Array<Reference>
    refines?: Array<Reference>
    conflicting?: Array<Reference>
}

const arrayReferences = [
    'decomposes', 'evolves', 'inherits', 'refines', 'conflicting'
] as (keyof Omit<ReqGoalRefs, keyof AstNode | 'name'>)[]

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
        
        arrayReferences.forEach(refType => {
            if ( item[refType] && _checkSelfReference(item, item[refType]!) ) {
                var relation = refType.slice(0,-1)
                accept('error', `${item.$type} '${item.name}' cannot ${relation} itself`, 
                       { node: item, property: refType as Properties<T>, code: ReqSpecIssueCodes.SelfReference } 
                )
            }
        })
        
    }

    checkDuplicateReference<T extends ReqGoalRefs>(item: T, accept: ValidationAcceptor): void {
        
        arrayReferences.forEach(refType => {
            if ( item[refType] && _countReferences(item[refType]!) === true ) {
            
                accept('error', 
                    `'Redundant cross-reference in 'decomposes' attribute`,
                    { node: item, property: 'decomposes' as Properties<T>, code: ReqSpecIssueCodes.SelfReference }
                )
            }
        })
    }   


}
