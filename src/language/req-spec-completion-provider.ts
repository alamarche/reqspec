import {AstNodeLocator, CompletionValueItem, DefaultCompletionProvider, LangiumDocument, LangiumDocuments, LangiumServices} from 'langium'
import { Hover, MarkupContent } from 'vscode-languageserver-types'
import { CompletionList, CompletionItem, CompletionParams } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { getAstNodeSummary } from './req-spec-hover-provider'
import { snippets } from './req-spec-code-snippets'

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
        if (list !== undefined) list.items.push(...snippets);
        
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