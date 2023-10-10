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
        
        /* List of properties we want to include in the hover content
         *  TODO - implement how to fetch x-references */
        let properties = {
            "$type": "Type",
            // "name": "Identifier",
            "id": "Unique ID",
            "personName": "Name",
            "title": "Title",
            "description": "Description",
            "categories": "Categories",
            "owner": "Owner",
            // "mitigatedHazards",
            // "decomposesReqs",
            // "evolvesReqs",
            // "inheritsReqs",
            // "referencedRequirements"
        }
        
        let content: string = ""
        let keys:string[] = Object.keys(node)   // of the target node
        let vals:string[] = Object.values(node) // of the target node
        
        for (var [key, prettyName] of Object.entries(properties) ) {
            
            let keyIndex = keys.indexOf(key)
            let val = vals[keyIndex]
            
            if (keyIndex > -1) {
                if (val.length <= 0) {
                    continue
                }
                content = content.concat(`* **${prettyName}**: ${val}\n`)
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