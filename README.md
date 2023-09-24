## ReqSpec LSP extension for VScode/Theia
A way to develop requirements in a model, associating requirements with architectural elements

### Purpose
1. To provide an open-source language server for a modern IDE that enables the rapid definition of systems architecture.
2. Prioritize the efficiency of textual writing - minimize the amount of clicks/keystrokes the user must do to use the language
     * Influenced by AADL - inefficient blocking
     * Add ability to rapidly traverse code references using IDE
     * Add quick-fixes, operations, etc.
3. Provide operations to allow interoperability with other software toolchains
     * Export architectural features to AADL, SysML, Capella, custom EMF, etc.
     * Import/export requirements artifacts to/from ReqIF or interface with typical requirements tools (e.g. Polarion)
     * 
4. Interface with diagramming library (separate repo)
     * Need a means to visualize the model and frame out diagrams easily

### Elaborations of the contained DSLs
#### Hazard Spec Model
Main purpose of the hazard specification DSL has 3 components:
* Define groups (i.e. libraries) of hazards that can be re-used and imported across projects, different components, functions
* Define individual hazards that can be used 

#### Physical Architecture Model
* Frames out the breakdown of physical & software components within a model 
* References the functional spec model to allocate high-level functions to components

#### Functional Spec Model
* Frames out how functions are globally connected and functional deviations associated?
* **NOTE - This one might just end up being lumped in with the physical architecture model**
* 

#### Requirements Spec Model
* Import/export documents to ReqIF
* Ability to develop requirement templates

#### Property Sets & Constants Model


## Decisions made
* `new` keyword prefix will be used to designate definition statements


## Ideas out of scope for this repository
* A function that takes as input a Capella file and converts it to the concrete syntax of these models

## Links to resources
* [ReqSpec Paper](https://insights.sei.cmu.edu/documents/1263/2016_005_001_464378.pdf)
  * [ReqSpec XText grammar](https://github.com/osate/osate2/blob/master/alisa/org.osate.reqspec/src/org/osate/reqspec/ReqSpec.xtext)
* [DSL Engineering Textbook](http://voelter.de/data/books/markusvoelter-dslengineering-1.0.pdf)
* [Langium Docs](https://langium.org/docs/grammar-language/)
* [Langium Playground](https://langium.org/playground/)
* [npm install docs](https://docs.npmjs.com/cli/v10/commands/npm-install)
* [AADL Error Annex Docs](http://www.openaadl.org/downloads/tutorial_models15/part5-safety.pdf)
* [NASA AdvoCATE User Guide](https://ntrs.nasa.gov/citations/20220009664)
* [Langium doc on importing external repo grammars](https://github.com/eclipse-langium/langium/discussions/899)