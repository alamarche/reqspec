import { expandToString } from "langium";
import { v4 } from "uuid";
import { CompletionItem, CompletionItemKind, InsertTextFormat } from "vscode-languageserver";
import { ReqSpecAstType } from "./generated/ast";

type ReqspecNodes = keyof ReqSpecAstType | "AstNode" | "Entry"

export type SnippetContexts = {
    [k in keyof ReqSpecAstType | "AstNode" | "Entry"]?: string
}

export type SnippetCompletionItem = CompletionItem & {context: ReqspecNodes[]}

export const snippets: CompletionItem[] = [
    {
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
        insertTextFormat: InsertTextFormat.Snippet
    },
    {
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
        insertText: expandToString`
            stakeholder \${1:varName} {
                id ${v4()}
                name "\${2:person name}"
                title "\${3:business title}"
                role "\${4:project role}"
                email "\${5:email@address.com}"
            }`,
        documentation: 'Define a new stakeholder',
        insertTextFormat: InsertTextFormat.Snippet
    },
    {
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
        insertTextFormat: InsertTextFormat.Snippet
    },
    {
        label: '(new) component',
        kind: CompletionItemKind.Snippet,
        insertText: expandToString`
            comp \${1:name} : "\${2:title}" {
                id ${v4()}
                desc "\${3:description}"
            }`,
        documentation: 'Define a new component',
        insertTextFormat: InsertTextFormat.Snippet
      },
]

export const nodeSnippetAlloc: SnippetContexts = {

}