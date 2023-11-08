import * as vscode from "vscode"
import { GenerateOptions, generateAction } from "../cli/main"
import { NeedsObject } from "../cli/generator"

const sphinxNeedsCmd = 'reqspec.toSphinxNeeds'
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
    context.subscriptions.push(vscode.commands.registerCommand(sphinxNeedsCmd, sphinxCmdHandler))
}
