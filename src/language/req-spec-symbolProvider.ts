import {AstNode, AstNodeHoverProvider, DefaultDocumentSymbolProvider, LangiumServices, MaybePromise} from 'langium'
import { Hover, SymbolKind } from 'vscode-languageserver-types'
// import { Requirement } from './generated/ast'

export class ReqSpecSymbolProvider extends DefaultDocumentSymbolProvider {

    constructor(services: LangiumServices) {
        super(services)
    }
    
    protected override getSymbolKind(type: string): SymbolKind {
        
        switch(type.toLowerCase()) {
            case "component": return SymbolKind.Class
            case "hazard": return SymbolKind.Event
            case "requirement": return SymbolKind.Constant
            case "requirementset": return SymbolKind.Array
            case "requirementdocument": return SymbolKind.File
            case "goal": return SymbolKind.Constant
            case "goalset": return SymbolKind.Array
            case "goaldocument": return SymbolKind.File
            case "stakeholder": return SymbolKind.Namespace
            case "developer": return SymbolKind.Namespace
            default: return SymbolKind.Field
        }
    }

}

export class ReqSpecNodeHoverProvider extends AstNodeHoverProvider {

    constructor(services: LangiumServices) {
        super(services)
    }
    
    protected override getAstNodeHoverContent(node: AstNode): MaybePromise<Hover | undefined> {
        
        // let nodeStream = streamContents(node)
        let propertiesOfInterest = [
            '$type',
            'name',
            'description',
            'categories',
            'owner',
            // 'mitigatedHazards',
            // 'decomposesReqs',
            // 'evolvesReqs',
            // 'inheritsReqs',
            // 'referencedRequirements'
        ]
        
        // let newNode = node as GenericAstNode
        let content: string = ''
        let keys = Object.keys(node)
        let vals = Object.values(node)
        
        for (var index in keys) {
            let key = keys[index]
            let val:string = vals[index]

            if ((val.length) <= 0) {
                continue
            }
            
            if (propertiesOfInterest.indexOf(key) > -1) {
                content = content.concat(`${key}: ${val}\n\n`)
            }
        }

        return {
            contents: {
                kind: 'markdown',
                value: content
            }
        }
    }

}