import fs from 'fs';
import { CompositeGeneratorNode, Reference, expandToString, toString } from 'langium';
import path from 'path';
import { Goal, Model, Requirement } from '../language/generated/ast';
import { extractDestinationAndName } from './cli-util';

export type NeedsObject = "Goal" | "Requirement" 

/**
 * generateSphinxNeedsObjects takes a ReqSpec file and exports all of the `AstNode`s matching the specified `type` to SphinxNeeds format 
 * 
 * @param model A given ReqSpec document bearing the items to be exported
 * @param type The types of nodes to export - literals are member of NeedsObject
 * @param filePath 
 * @param destination 
 * @returns destination of the Sphinx-Needs file written
 */
export function generateSphinxNeedsObjects(model: Model, type: NeedsObject = "Requirement", filePath: string, destination?: string): string {
    const data = extractDestinationAndName(filePath, destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.rst`;

    const fileNode = new CompositeGeneratorNode();

    // Function to gather references for a given node's property and assemble them into SphinxNeeds format
    let arrayRefStringer = (array: Array<any>, tag:string) => {
        if (array === undefined || array === null) return           // Guard against undefined or null object passed
        if (!Object.hasOwn(array, 'length')) return                 // Guard against empty array
        return `${array.length ? `\t:${tag}: ` + (array as Reference[]).map(val => val.$nodeDescription!!.name).join(', ') + '\n' : ''}`
    }

    // For each item in the supplied reqspec file that matches `type`
    model.items.forEach(item => {
        if (item.$type === type) {
            switch (item.$type) { // if a given model item is the type we are seeking
                case "Goal": 
                    let goal = item as Goal
                    fileNode.append(expandToString`
                        .. need:: ${goal.title ?? 'Placeholder Title'}
                            :id: ${goal.name}
                            ${arrayRefStringer(goal.categories, 'tags')}
                            ${arrayRefStringer(goal.references, 'referencedGoals')}
                            ${arrayRefStringer(goal.evolves, 'evolves')}
                            ${arrayRefStringer(goal.refines, 'refines')}
                            ${arrayRefStringer(goal.conflicting, 'conflictsWith')}`
                    )
                    break
                case "Requirement":
                    let req = item as Requirement
                    fileNode.append(expandToString`
                        .. req:: ${req.title ?? 'Placeholder Title'}
                            :id: ${req.name}
                            ${arrayRefStringer(req.categories, 'tags')}
                            ${arrayRefStringer(req.references, 'referencedGoals')}
                            ${arrayRefStringer(req.evolves, 'evolves')}
                            ${arrayRefStringer(req.refines, 'refines')}
                            ${arrayRefStringer(req.inherits, 'inherits')}
                            ${arrayRefStringer(req.mitigatedHazards, 'mitigates')}
                            ${arrayRefStringer(req.decomposes, 'decomposes')}`
                    )
                    break
            }
        }
    })

    // Write to file & return destination of the file
    if (!fs.existsSync(data.destination)) {
        fs.mkdirSync(data.destination, { recursive: true });
    }
    fs.writeFileSync(generatedFilePath, toString(fileNode));
    return generatedFilePath;
}

