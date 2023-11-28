import { AstNode, DefaultScopeComputation, LangiumDocument, LangiumServices, PrecomputedScopes } from "langium";

export class ReqSpecScopeComputation extends DefaultScopeComputation {

    constructor(services: LangiumServices) {
        super(services)
    }

    protected override processNode(node: AstNode, document: LangiumDocument<AstNode>, scopes: PrecomputedScopes): void {
        // TODO - Implement this function to allow scopes for goal & requirement 
        // x-references to be referenced from any block level
        
        // TODO - After implementation TODO above, inject into reqspec module
    }
}

