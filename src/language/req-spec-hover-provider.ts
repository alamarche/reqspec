import {AstNode, AstNodeHoverProvider, GenericAstNode, LangiumServices, MaybePromise, Reference, isReference} from 'langium'
import { Hover } from 'vscode-languageserver-types'

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