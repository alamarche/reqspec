import {AstNode, AstNodeHoverProvider, AstNodeLocator, CompletionValueItem, DefaultCompletionProvider, DefaultDocumentSymbolProvider, GenericAstNode, LangiumDocument, LangiumDocuments, LangiumServices, MaybePromise, Reference, isReference} from 'langium'
import { Hover, MarkupContent, SymbolKind } from 'vscode-languageserver-types'
import { CompletionList, CompletionItem, CompletionParams, CompletionItemKind, InsertTextFormat } from 'vscode-languageserver'
import { v4 } from 'uuid'
import { TextDocument } from 'vscode-languageserver-textdocument'
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

export function getAstNodeSummary(node: AstNode): Hover {
        
    /* List of properties we want to include in the hover content
     *  TODO - implement how to fetch x-references */
    let properties = {
        "$type": "Type",
        // "name": "Identifier",
        "id": "UUID",
        "personName": "Name",
        "title": "Title",
        "description": "Description",
        "categories": "Categories",
        "rationale": "Rationale",
        "owner": "Owner",
        "involvedStakeholders": "Stakeholders",
        "mitigatedHazards": "Mitigated Hazards",
        "referencedHazards": "Referenced Hazards",
        "hazards": "Owned Hazards",
        "functions": "Owned Functions",
        "decomposes": "Decomposes",
        "evolves": "Evolves",
        "inherits": "Inherits",
        "refines": "Refines",
        "conflicting": "Conflicts with",
        "referencedRequirements": "References",
        "referencedGoals": "References",
    }
    
    let content: string = `#### ${(node as GenericAstNode).name}:\n`
    let keys = Object.keys(node)
    let vals = Object.values(node)   // of the target node
    
    for (var [key, prettyName] of Object.entries(properties) ) {
        
        let keyIndex = keys.indexOf(key)
        let val = vals[keyIndex]
        
        if (keyIndex > -1) {
            if (val.length <= 0) {
                continue
            }
            
            if (Array.isArray(val)) {
                content = content.concat(`* **${prettyName}**: `)
                val.forEach((elem) => {
                    let refNode = (elem as Reference).ref as GenericAstNode
                    if (refNode) {
                        elem = refNode as GenericAstNode
                        content = content.concat(`${elem.name}${elem.title ? " (" + elem.title + ")" : ""},` )
                    }  
                })
                content = content.concat('\n')
            } else if (isReference(val)) content = content.concat(`${(val as Reference).$refText}\n`)
            else if (typeof val === "string") content = content.concat(`* **${prettyName}**: ${val}\n`)
        }
    }

    return {
        contents: {
            kind: 'markdown',
            value: content
        }
    }
}

export class ReqSpecNodeHoverProvider extends AstNodeHoverProvider {

    constructor(services: LangiumServices) {
        super(services)
    }
    
    protected override getAstNodeHoverContent(node: AstNode): MaybePromise<Hover | undefined> {

        return getAstNodeSummary(node)
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
    
    // protected readonly references: References
    // protected readonly linker: Linker
    protected readonly langiumDocuments: () => LangiumDocuments
    protected readonly locator: AstNodeLocator

    constructor(services: LangiumServices) {
        super(services)
        // this.linker = services.
        this.langiumDocuments = () => services.shared.workspace.LangiumDocuments
        this.locator = services.workspace.AstNodeLocator
        // this.references = services.references.References
    }

    override async getCompletion(doc: LangiumDocument, params: CompletionParams): Suggestions {
        
        // Get default code completions
        const list = await super.getCompletion(doc, params);

        // Append my custom items
        if (list !== undefined) {
          const snippets: CompletionItem[]  = [
            {
                label: '(new) requirement',
                kind: CompletionItemKind.Snippet,
                insertText: 'req ${1:name} : \"${2:title}\" {\n' +
                            `\tid ${v4()}\n` +
                            '\tcat ${3:categories}\n' +
                            '\tdesc \"${4:description}\"\n' +
                            '\trationale \"${5:rationale}\"\n' +
                            '\tstakeholder ${6:stakeholders}\n' +
                            '}',
                documentation: 'Define a new requirement',
                insertTextFormat: InsertTextFormat.Snippet
            },
            {
                label: '(new) goal',
                kind: CompletionItemKind.Snippet,
                insertText: 'goal ${1:name} : \"${2:title}\" {\n' +
                              `\tid ${v4()}\n` +
                              '\tcat ${3:categories}\n' +
                              '\tdesc \"${4:description}\"\n' +
                              '\trationale \"${5:rationale}\"\n' +
                              '\tstakeholder ${6:stakeholder}\n' +
                              '}',
                documentation: 'Define a new goal',
                insertTextFormat: InsertTextFormat.Snippet
              },
              {
                label: '(new) id',
                kind: CompletionItemKind.Snippet,
                insertText: `id ${v4()}`,
                documentation: 'Add a UUID',
                insertTextFormat: InsertTextFormat.Snippet
              },
              {
                label: '(new) stakeholder',
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
                label: '(new) developer',
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
                label: '(new) component',
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
        } 
        
        return list;
    }
    
    protected override fillCompletionItem(document: TextDocument, offset: number, item: CompletionValueItem): CompletionItem | undefined {
        let label: string;

        if (typeof item.label === 'string') {
            label = item.label;
        } else if ('node' in item) {
            const name = this.nameProvider.getName(item.node);
            if (!name) {
                return undefined;
            }
            label = name;

        } else if ('nodeDescription' in item) {
            label = item.nodeDescription.name;
            let documentation: Hover
            if ('node' in item.nodeDescription && item.nodeDescription.node !== undefined) {
                documentation = getAstNodeSummary(item.nodeDescription.node)
                item.documentation = documentation.contents as MarkupContent
            } else {
                const doc = this.langiumDocuments().getOrCreateDocument(item.nodeDescription.documentUri)
                let node = this.locator.getAstNode(doc.parseResult.value, item.nodeDescription.path)

                if (node !== undefined) {
                    item.documentation = (getAstNodeSummary(node).contents) as MarkupContent
                }
            }
            
        } else {
            return undefined;
        }
        let insertText: string;
        if (typeof item.textEdit?.newText === 'string') {
            insertText = item.textEdit.newText;
        } else if (typeof item.insertText === 'string') {
            insertText = item.insertText;
        } else {
            insertText = label;
        }
        const textEdit = item.textEdit ?? this.buildCompletionTextEdit(document, offset, label, insertText);
        if (!textEdit) {
            return undefined;
        }

        // Copy all valid properties of `CompletionItem`
        const completionItem: CompletionItem = {
            additionalTextEdits: item.additionalTextEdits,
            command: item.command,
            commitCharacters: item.commitCharacters,
            data: item.data,
            detail: item.detail,
            documentation: item.documentation,
            filterText: item.filterText,
            insertText: item.insertText,
            insertTextFormat: item.insertTextFormat,
            insertTextMode: item.insertTextMode,
            kind: item.kind,
            labelDetails: item.labelDetails,
            preselect: item.preselect,
            sortText: item.sortText,
            tags: item.tags,
            textEditText: item.textEditText,
            textEdit,
            label
        };

        return completionItem;
    
    }
}
