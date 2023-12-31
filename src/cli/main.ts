import chalk from 'chalk';
import { Command } from 'commander';
import { Model } from '../language/generated/ast';
import { ReqSpecLanguageMetaData } from '../language/generated/module';
import { createReqSpecServices } from '../language/req-spec-module';
import { extractAstNode } from './cli-util';
// import { generateJavaScript } from './generator';
import { NodeFileSystem } from 'langium/node';
import { generateSphinxNeedsObjects, NeedsObject } from './generator';

export const generateAction = async (fileName: string, type: NeedsObject, opts: GenerateOptions): Promise<void> => {
    const services = createReqSpecServices(NodeFileSystem).ReqSpec;
    const model = await extractAstNode<Model>(fileName, services);
    const generatedFilePath = generateSphinxNeedsObjects(model, type, fileName, opts.destination);
    console.log(chalk.green(`Sphinx Needs code generated successfully: ${generatedFilePath}`));
};

export type GenerateOptions = {
    destination?: string;
}

export default function(): void {
    const program = new Command();

    program
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        .version(require('../../package.json').version);

    const fileExtensions = ReqSpecLanguageMetaData.fileExtensions.join(', ');
    program
        .command('generate')
        .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
        .argument('[type]', 'Type of ReqSpec objects to export', 'Goal')
        .option('-d, --destination <dir>', 'destination directory of generating')
        .description('generates JavaScript code that prints "Hello, {name}!" for each greeting in a source file')
        .action(generateAction);

    program.parse(process.argv);
}
