import fs from 'fs';
import { CompositeGeneratorNode, Reference, expandToString, toString } from 'langium';
import path from 'path';
import { Goal, Model, Requirement } from '../language/generated/ast';
import { extractDestinationAndName } from './cli-util';

export type NeedsObject = "Goal" | "Requirement" 

export function generateSphinxNeedsObjects(model: Model, type: NeedsObject = "Requirement", filePath: string, destination: string | undefined): string {
    const data = extractDestinationAndName(filePath, destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.rst`;

    const fileNode = new CompositeGeneratorNode();
    let arrayRefStringer = (array: Array<any>, tag:string) => {
        if (array === undefined || array === null) return
        if (!Object.hasOwn(array, 'length')) return
        return `${array.length ? `\t:${tag}: ` + (array as Reference[]).map(val => val.$nodeDescription!!.name).join(', ') + '\n' : ''}`
    }

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

    if (!fs.existsSync(data.destination)) {
        fs.mkdirSync(data.destination, { recursive: true });
    }
    fs.writeFileSync(generatedFilePath, toString(fileNode));
    return generatedFilePath;
}
