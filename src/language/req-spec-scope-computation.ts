import { AstNode, AstNodeDescription, DefaultScopeComputation, LangiumDocument, LangiumServices, streamAllContents } from "langium";
import { CancellationToken } from "vscode-languageclient";

export class ReqSpecScopeComputation extends DefaultScopeComputation {

    constructor(services: LangiumServices) {
        super(services)
    }
    
    override async computeExports(document: LangiumDocument<AstNode>, cancelToken?: CancellationToken | undefined): Promise<AstNodeDescription[]> {
        return this.computeExportsForNode(
            document.parseResult.value, document, streamAllContents, cancelToken
        )
    }
    
    // override async computeLocalScopes(document: LangiumDocument<AstNode>, cancelToken?: CancellationToken | undefined): Promise<PrecomputedScopes> {
        
    // }
}

