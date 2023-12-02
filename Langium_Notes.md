# Langium Notes

##  Scope
A scope describes what targe elements are visible from a specific cross-reference context.
```typescript
**/**
 * A scope describes what target elements are visible from a specific cross-reference context.
 */**
export interface Scope {

    /**
     * Find a target element matching the given name. If no element is found, `undefined` is returned.
     * If multiple matching elements are present, the selection of the returned element should be done
     * according to the semantics of your language. Usually it is the element that is most closely defined.
     *
     * @param name Name of the cross-reference target as it appears in the source text.
     */
    getElement(name: string): AstNodeDescription | undefined;

    /**
     * Create a stream of all elements in the scope. This is used to compute completion proposals to be
     * shown in the editor.
     */
    getAllElements(): Stream<AstNodeDescription>;

}
```

StreamScope is the default implementation of the Scope interface - provides an outerScope that contains the next level of elements scoped if the target element isn't found in the current stream:

```typescript
/**
 * The default scope implementation is based on a `Stream`. It has an optional _outer scope_ describing
 * the next level of elements, which are queried when a target element is not found in the stream provided
 * to this scope.
 */
export class StreamScope implements Scope {
    readonly elements: Stream<AstNodeDescription>;
    readonly outerScope?: Scope;
    readonly caseInsensitive?: boolean;

    constructor(elements: Stream<AstNodeDescription>, outerScope?: Scope, options?: ScopeOptions) {
        this.elements = elements;
        this.outerScope = outerScope;
        this.caseInsensitive = options?.caseInsensitive;
    }

    getAllElements(): Stream<AstNodeDescription> {
        if (this.outerScope) {
            return this.elements.concat(this.outerScope.getAllElements());
        } else {
            return this.elements;
        }
    }

    getElement(name: string): AstNodeDescription | undefined {
        const local = this.caseInsensitive
            ? this.elements.find(e => e.name.toLowerCase() === name.toLowerCase())
            : this.elements.find(e => e.name === name);
        if (local) {
            return local;
        }
        if (this.outerScope) {
            return this.outerScope.getElement(name);
        }
        return undefined;
    }
}
```
StreamScope objects are only used (by default) in the ScopeProvider service.
## ScopeProvider (Service)
 A language-specific (i.e. varies between different defined languages) service for describing the elements visible in a specific cross-reference context (which element you're typing within).
* Basically determines whether a given reference 
* Default Langium implementation is DefaultScopeProvider - automatically provided to the program if you don't provide your own. Uses `StreamScope` objects
	* Default impl follows traditional variable namespacing. (e.g. inner-most nested objects can access toward the root, but cannot access its siblings and their nested objects)

## ScopeComputation (Service)
Language-specific service for precomputing global **AND** local scopes. The service methods are executed as the first and second phase in the `DocumentBuilder` (see [Document Lifecycle | Langium](https://langium.org/docs/document-lifecycle/)).
```typescript
/**
 * Language-specific service for precomputing global and local scopes. The service methods are executed
 * as the first and second phase in the `DocumentBuilder`.
 */
export interface ScopeComputation {

    /**
     * Creates descriptions of all AST nodes that shall be exported into the _global_ scope from the given
     * document. These descriptions are gathered by the `IndexManager` and stored in the global index so
     * they can be referenced from other documents.
     *
     * _Note:_ You should not resolve any cross-references in this service method. Cross-reference resolution
     * depends on the scope computation phase to be completed (`computeScope` method), which runs after the
     * initial indexing where this method is used.
     *
     * @param document The document from which to gather exported AST nodes.
     * @param cancelToken Indicates when to cancel the current operation.
     * @throws `OperationCanceled` if a user action occurs during execution
     */
    computeExports(document: LangiumDocument, cancelToken?: CancellationToken): Promise<AstNodeDescription[]>;

    /**
     * Precomputes the _local_ scopes for a document, which are necessary for the default way of
     * resolving references to symbols in the same document. The result is a multimap assigning a
     * set of AST node descriptions to every level of the AST. These data are used by the `ScopeProvider`
     * service to determine which target nodes are visible in the context of a specific cross-reference.
     *
     * _Note:_ You should not resolve any cross-references in this service method. Cross-reference
     * resolution depends on the scope computation phase to be completed.
     *
     * @param document The document in which to compute scopes.
     * @param cancelToken Indicates when to cancel the current operation.
     * @throws `OperationCanceled` if a user action occurs during execution
     */
    computeLocalScopes(document: LangiumDocument, cancelToken?: CancellationToken): Promise<PrecomputedScopes>;

}
```
ScopeComputation can be used to:
* Customize which elements can be cross-referenced globally and with what names (which element you are referencing from)
* e.g. in ReqSpec

