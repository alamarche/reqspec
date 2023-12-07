import * as vscode from "vscode"
import { GenerateOptions, generateAction } from "../cli/main"
import { NeedsObject } from "../cli/sphinx-needs-generator"

// Consider adding commands for syncng project to project.
const commandMap = new Map<string, Function>([
    ['reqspec.export.sphinxNeeds.fileToExhaustive', sphinxCmdHandler],  // Export contents of reqspec file to SphinxNeeds
    ['reqspec.export.sphinxNeeds.fileToMenu', () => {}],                // Export contents of reqspec file to SphinxNeeds via menu
    ['reqspec.export.sphinxNeeds.workspaceToExhaustive', () => {}],     // Export contents of reqspec workspace to SphinxNeeds
    ['reqspec.export.sphinxNeeds.workspaceToMenu', () => {}],           // Export contents of reqspec workspace to SphinxNeeds via menu
    ['reqspec.import.sphinxNeeds.importFileExhaustive', () => {}],      // Import contents of SphinxNeeds workspace to reqspec
    ['reqspec.import.sphinxNeeds.importFileMenu', () => {}],            // Import contents of SphinxNeeds workspace to reqspec via menu
    ['reqspec.import.sphinxNeeds.importDirectoryExhaustive', () => {}], // Import contents of SphinxNeeds directory to reqspec
    ['reqspec.import.sphinxNeeds.importDirectoryMenu', () => {}],       // Import contents of SphinxNeeds directory to reqspec via menu
    ['reqspec.sync.sphinxNeeds.documentToDocument', () => {}],          // Synchronize contents of SphinxNeeds file to reqspec document
    ['reqspec.sync.sphinxNeeds.itemToItem', () => {}],                  // Synchronize a work item from Sphinx Needs with ReqSpec item
    ['reqspec.sync.sphinxNeeds.projectToProject', () => {}],            // Synchronize Sphinx Needs project with ReqSpec project
    ['reqspec.export.polarion.fileToWorkItems', () => {}],              // Export work items in ReqSpec file to Polarion work items
    ['reqspec.export.polarion.fileToDocument', () => {}],               // Export ReqSpec GoalDocument or RequirementDocument to Polarion doc.
    ['reqspec.import.polarion.workItemsToFile', () => {}],              // Import Polarion work items into a ReqSpec file
    ['reqspec.import.polarion.documentToFile', () => {}],               // Import Polarion document into a ReqSpec GoalDocument or RequirementDocument, etc.
    ['reqspec.sync.polarion.documentToDocument', () => {}],             // Synchronize Polarion document with a ReqSpec GoalDocument or RequirementDocument
    ['reqspec.sync.polarion.itemToItem', () => {}],                     // Synchronize selected reqspec work items and documents with their Polarion equivalents
    ['reqspec.sync.polarion.projectToProject', () => {}],               // Synchronize all reqspec work items and documents with their Polarion equivalents
    ['reqspec.format.formatFile', () => {}],                            // Command to format reqspec file - maybe enable upon save?
    ['reqspec.format.formatBlock', () => {}],                           // Command to format current reqspec block
    ['reqspec.format.formatLine', () => {}],                            // Command to format current reqspec line
])

const quickFixMap = new Map<string, Function>([
    ['reqspec.quickfix.capitalizeNode', () => {}],                      // Quick-fix to ensure all nodes have a capital first letter
    ['reqspec.quickfix.moveBlockToFile', () => {}],                     // Quick-fix to move items between files
])

const fullCommandMap = new Map([...commandMap, ...quickFixMap])

const sphinxNeedsCmdInput = async (): Promise<
    [string | undefined, 
    string | undefined, 
    GenerateOptions,]> => 
{

    // Get user input of filepath
    let path = await vscode.window.showInputBox(
        {
            title: "Filepath for conversion",
            placeHolder: '${workspaceFolder}',
            prompt: "Enter the location of the file to be converted",
            ignoreFocusOut: true
        }
    )
    
    // Get user input of reqspec type to convert
    let type = await vscode.window.showInputBox(
        {
            title: "Type for conversion",
            value: 'Requirement',
            prompt: "Enter the type of ReqSpec artifacts to be converted (Requirement or Goal)",
            ignoreFocusOut: true,
            validateInput:async (val:string): Promise<string|undefined> => {
                if (val === "Goal" || val === "Requirement") return undefined
                else return "Must provide a string of either \'Goal\' or \'Requirement\'"
            }
        }
    )
    
    let opts:GenerateOptions = {}

    // Get user input of destination (if needed)
    let dest = await vscode.window.showInputBox(
        {
            title: "Filepath for generated output",
            placeHolder: 'Path to .rst file here (optional)',
            prompt: "Enter the location of the file to be generated",
            ignoreFocusOut: true
        }
    )
    if (dest !== undefined) {
        if (dest.length !== 0) opts = {destination: dest as string}
    }

    return [
        path, 
        type, 
        opts,
    ]
}

export async function sphinxCmdHandler() {
    
    let [path, type, opts] = await sphinxNeedsCmdInput()

    if (path !== undefined && type !== undefined) {
        generateAction(path, type as NeedsObject, opts)
    } else {
        console.log("Invalid parameters supplied")
    }
}

export function registerCommands(context: vscode.ExtensionContext): void {
    
    fullCommandMap.forEach((func, cmdID) => {
        context.subscriptions.push(vscode.commands.registerCommand(cmdID, func as any))
    })
}
