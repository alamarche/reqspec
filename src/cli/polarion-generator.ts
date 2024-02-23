import { PathLike, readdirSync } from "fs";
import { join, resolve } from "path";


export function workspaceToPolarionXML() {

}

export function workspaceToPolarionREST() {

}

/**
 * Get all the reqspec files in a given directory
 * 
 * @param path path of the directory to look for reqspec files
 * @param omit regexp of files or directories to omit, even if regexp
 * @param recursive whether or not to search for deeper files
 */
export function getReqspecFiles(path: PathLike, omit: RegExp | string | undefined, recursive:boolean=true): PathLike[] {

    let reqspecPaths:PathLike[] = []

    // Convert PathLike to string
    let strpath:string = ""
    if (typeof path != 'string') strpath = path.toString()
    else strpath = path 

    const dirContents = readdirSync(resolve(strpath), {withFileTypes:true})

    for (const [_, entry] of dirContents.entries()) {

        let additionalPaths: PathLike[] = []             // paths to be added on each iteration
        let entryPath:string = join(strpath, entry.name) // assemble path to directory entry

        if (omit !== undefined && entryPath.match(omit)) { // omit files that match the regexp pattern
            continue
        }
        
        if (recursive && entry.isDirectory()) 
            additionalPaths = getReqspecFiles(entryPath, omit, recursive)

        else if (entry.name.endsWith('.reqspec'))
            additionalPaths = [entryPath]

        reqspecPaths.push(... additionalPaths)
    }

    return reqspecPaths
}

export function gatherReqSpecNodes() {

}