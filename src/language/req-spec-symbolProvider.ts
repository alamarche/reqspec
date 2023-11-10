import {DefaultDocumentSymbolProvider, LangiumServices} from 'langium'
import { SymbolKind } from 'vscode-languageserver-types'

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


