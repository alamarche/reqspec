import { expandToString } from "langium";
import { v4 } from "uuid";
import { CompletionItem, CompletionItemKind, InsertTextFormat } from "vscode-languageserver";
import { ReqSpecAstType } from "./generated/ast";

type ReqspecNodes = keyof ReqSpecAstType | "AstNode" | "Entry"

export type SnippetContexts = {
    [k in keyof ReqSpecAstType | "AstNode" | "Entry"]?: string[] // seems redundant with ReqspecNodes, but prevents string methods from leaking in
}

export interface SnippetCompletionItem extends CompletionItem {
    context: ReqspecNodes[] 
    id: string
}

export const snippets: SnippetCompletionItem[] = [
    {
        id: 'req',
        label: '(new) requirement',
        kind: CompletionItemKind.Snippet,
        insertText: expandToString`
            req \${1:name} : "\${2:title}" {
                id ${v4()}
                cat \${3:categories}
                desc "\${4:description}"
                rationale "\${5:rationale}"
                stakeholder \${6:stakeholders}
            }`,
        documentation: 'Define a new requirement',
        insertTextFormat: InsertTextFormat.Snippet,
        context: ["Entry", "RequirementSet"],
    },
    {
        id: 'goal',
        label: '(new) goal',
        kind: CompletionItemKind.Snippet,
        insertText: expandToString`
            goal \${1:name} : "\${2:title}" {
                id ${v4()}
                cat \${3:categories}
                desc "\${4:description}"
                rationale "\${5:rationale}"
                stakeholder \${6:stakeholders}
            }`,
        documentation: 'Define a new goal',
        insertTextFormat: InsertTextFormat.Snippet,
        context: ["Entry", "GoalSet"],
    },
    {
        id: 'id',
        label: '(new) id',
        kind: CompletionItemKind.Snippet,
        insertText: `id ${v4()}`,
        documentation: 'Add a UUID',
        insertTextFormat: InsertTextFormat.Snippet,
        context: ["AstNode"],
    },
    {
        id: 'stk',
        label: '(new) stakeholder',
        kind: CompletionItemKind.Snippet,
        insertText: expandToString`
            stakeholder \${1:varName} {
                id ${v4()}
                name "\${2:person name}"
                title "\${3:business title}"
                role "\${4:project role}"
                email "\${5:email@address.com}"
            }`,
        documentation: 'Define a new stakeholder',
        insertTextFormat: InsertTextFormat.Snippet,
        context: ["Entry"],
    },
    {
        id: 'dev',
        label: '(new) developer',
        kind: CompletionItemKind.Snippet,
        insertText: expandToString`
            developer \${1:varName} {
                id ${v4()}
                name "\${2:person name}"
                title "\${3:business title}"
                role "\${4:project role}"
                email "\${5:email@address.com}"
            }`,
        documentation: 'Define a new developer',
        insertTextFormat: InsertTextFormat.Snippet,
        context: ["Entry"],
    },
    {
        id: 'comp',
        label: '(new) component',
        kind: CompletionItemKind.Snippet,
        insertText: expandToString`
            comp \${1:name} : "\${2:title}" {
                id ${v4()}
                desc "\${3:description}"
            }`,
        documentation: 'Define a new component',
        insertTextFormat: InsertTextFormat.Snippet,
        context: ["Entry", "Component"],
      },
]

export const nodeSnippetAlloc: SnippetContexts = {}

for (const snippet of snippets) {
    if (snippet.context.length <= 0) continue // if there are no contexts, then default to not using it
    for (const context of snippet.context) {
        if ( nodeSnippetAlloc[context] === undefined ) {
            nodeSnippetAlloc[context] = [snippet.id]
        } else if( Array.isArray(nodeSnippetAlloc[context]) ) {
            nodeSnippetAlloc[context] = nodeSnippetAlloc[context]!.concat(snippet.id) 
        }
    }
}