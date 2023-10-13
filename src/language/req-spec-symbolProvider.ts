import {AstNode, AstNodeHoverProvider, DefaultCompletionProvider, DefaultDocumentSymbolProvider, LangiumDocument, LangiumServices, MaybePromise} from 'langium'
import { Hover, SymbolKind } from 'vscode-languageserver-types'
import { CompletionList, CompletionItem, CompletionParams, CompletionItemKind, InsertTextFormat } from 'vscode-languageserver'
import { v4 } from 'uuid'
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
        let [keys, vals] = Object.entries(node)   // of the target node
        
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

type Suggestions = Promise<CompletionList | undefined>

/**
 * Prototype code below is courtesy of github.com/rhumbertgz
 * See https://github.com/eclipse-langium/langium/discussions/1118 
 * 
 * TODO - Need to figure out scoping to make sure snippets are only provided when we actually need them
 */
export class ReqSpecCompletionProvider extends DefaultCompletionProvider {
    
    constructor(services: LangiumServices) {
        super(services)
    }

    override async getCompletion(doc: LangiumDocument, params: CompletionParams): Suggestions {
        
        // Get default code completions
        const list = await super.getCompletion(doc, params);

        // Append my custom items
        if (list !== undefined) {
          const snippets: CompletionItem[]  = [
            {
                label: 'requirement (new)',
                kind: CompletionItemKind.Snippet,
                insertText: 'req ${1:name} : \"${2:title}\" {\n' +
                            `\tid ${v4()}\n` +
                            '\tcat ${3:categories}\n' +
                            '\tdesc \"${4:description}\"\n' +
                            '\trationale \"${5:rationale}\"\n' +
                            '}',
                documentation: 'Define a new requirement',
                insertTextFormat: InsertTextFormat.Snippet
            },
            {
                label: 'goal (new)',
                kind: CompletionItemKind.Snippet,
                insertText: 'goal ${1:name} : \"${2:title}\" {\n' +
                              `\tid ${v4()}\n` +
                              '\tcat ${3:categories}\n' +
                              '\tdesc \"${4:description}\"\n' +
                              '\trationale \"${5:rationale}\"\n' +
                              '}',
                documentation: 'Define a new goal',
                insertTextFormat: InsertTextFormat.Snippet
              },
              {
                label: 'id (new)',
                kind: CompletionItemKind.Snippet,
                insertText: `id ${v4()}`,
                documentation: 'Add a UUID',
                insertTextFormat: InsertTextFormat.Snippet
              },
              {
                label: 'stakeholder (new)',
                kind: CompletionItemKind.Snippet,
                insertText: 'stakeholder ${1:varName} {\n' +
                            `\tid ${v4()}\n` +
                            '\tname \"${2:person name}\"\n' +
                            '\ttitle \"${3:business title}\"\n' +
                            '\trole \"${4:project role}\"\n' +
                            '\temail \"${5:email@address.com}\"\n' +
                '}',
                documentation: 'Define a new stakeholder',
                insertTextFormat: InsertTextFormat.Snippet
              },
              {
                label: 'developer (new)',
                kind: CompletionItemKind.Snippet,
                insertText: 'developer ${1:varName} {\n' +
                            `\tid ${v4()}\n` +
                            '\tname \"${2:person name}\"\n' +
                            '\ttitle \"${3:business title}\"\n' +
                            '\trole \"${4:project role}\"\n' +
                            '\temail \"${5:email@address.com}\"\n' +
                '}',
                documentation: 'Define a new developer',
                insertTextFormat: InsertTextFormat.Snippet
              },
              {
                label: 'component (new)',
                kind: CompletionItemKind.Snippet,
                insertText: 'comp ${1:name} : \"${2:title}\" {\n' +
                                `\tid ${v4()}\n` +
                                '\tdesc \"${3:description}\"\n' +
                '}',
                documentation: 'Define a new component',
                insertTextFormat: InsertTextFormat.Snippet
              },
          ]; 
    
          list.items.push(...snippets);
          console.log(snippets[0])
        } 
        
        return list;
      }
    }
