# ReqSpec DSL


## Overview
The ReqSpec DSL is a language server developed using [Langium][langium] which aims to move requirements engineering **away** from development within industry-standard, heavy-weight solutions such as [Polarion][polarion], [Rational Doors][doors], [Dassault Reqtify][def], and [Jama][reqtify] and toward a solution that:
* **Is lightweight and remains within the requirement engineer's control**
  * Configurations and pages in webserver-based solutions such as Doors and Polarion are often at the mercy of the IT group hosting them. Instances can become cripplingly slow depending on userload, complexity of projects, and the resources afforded to the server.
  * can offer administrative privileges to users, but this is often at the mercy of a managing IT group to define. WhenFurthermore, companies may constrain systems engineers to use specific templates, types and 
* **Minimizes user input (particularly clicks & cursor movement) to produce content**
  * Systems engineering and architectural models are often deep, complex structures that involve many entities (e.g. think of how many logical parts are in a car). Particularly for novel systems, this involves a lot of user input. The ability to quickly define entities, resolve references, and elaborate upon them without extraneous input is critical to software usability. This is particularly a problem with solutions such as [Capella][capella], to the point where add-ons have been privately developed by users [to try to accommodate the shortcomings of the base software][pycapellambse]
* **Supports modern IDEs, typical functionalities, and typical language conventions**
  * The concepts addressed by existing open source solutions (such as [OSATE][osate]) are quite good, but their development environments are coded in a language or framework that is not accessible for typical SWE or engineering graduates (e.g. Java, Eclipse IDE, Eclipse RCP). This effort is compounded by the fact that a tremendous amount of open source systems engineering software over the past decade or two has been developed with Eclipse EMF, which can autogenerate a great deal of boilerplate Java code from a metamodel. New solutions need to be done using modern languages with modern features. See [Completed Features](#completed-features) or [Targeted Features](#targeted-features).
  * In the case of [OSATE][osate] and other solutions leveraging Xtext and Eclipse, language servers easily breakdown upon a single detected error or offer an incomplete feature set (e.g. autocompletion failures, reference resolution, hover properties).
  * Supporting modern IDEs also enables a central development environment that can be augmented with add-ons developed by 3rd parties, reducing the need to switch between software. 
  * [ReqSpec ALISA][reqspec_paper] and the [AADL][aadl] offer good grammars for definition of systems engineering models, but the syntax is often esoteric in the context of the majority of programming languages. `[]` brackets are used to indicate blocks in ReqSpec ALISA, where modern languages typically leverage those tokens to define lists or arrays. Rather than using `{}` to scope blocks in AADL, `end <ID-HERE>` is used, which is less visual and more input-intensive 
* **Is entirely FLOSS**
  * Sharing of architecture, needs, and requirements across organizations and departments is a vital part of systems engineering. ReqIF has been used as a mechanism to convey some of this information, but there remain limited SW offerings for small or new organizations to get started in requirements analysis without paying for either expensive or maintenance-heavy offerings.
  * No "Freemium" content - often "free" requirements/architecture development SW hides features behind paywalls or otherwise not publicly offer features described in published literature.
  * Due to the limited affordable SW offerings for requirements/architecture development, it is difficult for engineers with limited post-graduate exposure to systems engineering concepts to understand these activities without incurring significant expense on projects with non-personal applications. This holds back the development of capable systems engineers, and therefore the industry.
* **Is extensible by the user**
  * To be elaborated.
* **Prioritize and centralize documentation for relevant audiences**
  * Many existing solutions (particularly Obeo solutions), despite being technically rich, offer incomplete documentation, documentation that is decentralized across many publishing services, documentation with broken links, or documentation that solely targets SWE developers. Broken and incomplete documentation leads to exceptional frustration, and general engineering education does not significantly prioritize software education to the point where only developer-focused documentation is acceptable.
* **Prioritizes interaction with other systems toolchains**
  * Requirements and architecture refinement are one piece of a systems engineering puzzle. 
* **Offers multiple layers of complexity depending on user needs**
  * ReqSpec is intended to be sufficiently flexible such that users can select features appropriate to develop their system.
* **Source files offer intelligible diffs**
  * Text files in ReqSpec format are the source of truth for the model. Use of ReqSpec in combination with `git` (and common toolchains like `git blame`) provide an easy way to understand what's changed between versions and commits for a given project
  * A [JSON Schema][jsonSchema] could easily be produced rather than a DSL as well depending on readability at a glance and user feedback 😀

### Influences
ReqSpec is heavily influenced by:
* [The ReqSpec ALISA extension to AADL][reqspec_paper]
* [The AADL itself][aadl]
* [NASA Advocate][nasaAdvocate]
* [Sphinx Needs][sphinxNeeds]
* [PolarSys Capella][capella]

### Why not use one of the influences?
Namely because none of the above solutions (in the author's opinion) satisfies the high-level needs in the overview section. The solutions that come closest include:
* **Sphinx Needs**
  * **Pros** - Excellent and broadly speaking the right idea, but marries requirements development with Sphinx content (e.g. still views requirements as being defined within a document). It offers a tremendous deal of flexibility to users in defining their own types, how types relate to each other, etc.
  * **Cons** - It's main failings lie in language server support. Sphinx Needs offers a [VSCode language server extension][sphNeedsVscode] to support its contributed language server features, but at the time of writing this extension barely functions (for the author) and relies on the user to generate a json file bearing the requirements/needs entities and reinstall the extension to get references to resolve without error. 
* **Capella**
  * **Pros** - Contains a lot of good architectural definition practices, contains a free extension for definition of extra properties. Helps guide the user (after significant reading) on the process to create a complete model 
  * **Cons** - Carpal-tunnel hell, extremely time-intensive to develop and maintain models due to graphical modelling, and very complex, uneditable base metamodel. Desperately needs text-based model definition with auto-layout of graphical nodes (e.g. ELK).

## Short-term vision
Create VSCode extension that does the following:

* Implement grammar and generate language server extension with automatically-generated LangiumServices
  * Autocompletion
  * Reference resolution
  * Basic validation (e.g. for expected tokens)
  * Refactoring
  * Syntax highlighting
  * Snippet completion
  * Bracket matching
  * Bracket autoclosing
  * Bracket autosurrounding
  * Comment toggling
  * Auto indentation
  * Folding (by markers)
* Provide language-specific LSP services
  * HoverProvider
  * SnippetCompletion
  * CodeLens
  * CodeFormatting (on save, file close, etc.)
  * Provide custom validation rules
* Provide export to ReqIF, Sphinx-Needs, & Polarion (if ReqIF not sufficient)

## Long-term vision
* To be elaborated

## Completed features
* Implemented first pass of grammar and generated language server extension with automatically-generated LangiumServices

## Contributing
This project is currently in the proof-of-concept phase of development. Contributions are currently not accepted, but will eventually be opened up. Feedback and bug reports are welcome at any time.


[langium]: https://langium.org
[polarion]: https://www.plm.automation.siemens.com/global/en/products/polarion/
[doors]: https://www.ibm.com/docs/en/engineering-lifecycle-management-suite/doors/9.7.2?topic=engineering-requirements-management-doors-overview
[def]: https://www.3ds.com/products-services/catia/products/reqtify/
[reqtify]: https://www.jamasoftware.com/solutions/requirements-management/
[reqspec_paper]: https://insights.sei.cmu.edu/documents/1263/2016_005_001_464378.pdf
[nasaAdvocate]: https://sma.nasa.gov/news/articles/newsitem/2020/09/22/new-tool-for-developing-safety-assurance-cases
[sphinxNeeds]: https://www.sphinx-needs.com/
[capella]: https://eclipse.dev/capella/
[aadl]: http://www.openaadl.org/
[osate]: https://github.com/osate/osate2
[pycapellambse]: https://github.com/DSD-DBS/py-capellambse
[jsonSchema]: https://json-schema.org/
[sphNeedsVscode]: https://github.com/useblocks/sphinx-needs-vscode