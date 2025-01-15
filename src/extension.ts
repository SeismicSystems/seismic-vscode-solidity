'use strict';
import * as path from 'path';
import * as vscode from 'vscode';
import { compileAllContracts } from './client/compileAll';
import { Compiler } from './client/compiler';
import { compileActiveContract, initDiagnosticCollection } from './client/compileActive';
import {
    generateNethereumCodeSettingsFile, codeGenerateNethereumCQSCsharp, codeGenerateNethereumCQSFSharp, codeGenerateNethereumCQSVbNet,
    codeGenerateNethereumCQSCSharpAll, codeGenerateNethereumCQSFSharpAll, codeGenerateNethereumCQSVbAll, autoCodeGenerateAfterCompilation,
    codeGenerateCQS, codeGenerateAllFilesFromAbiInCurrentFolder, codeGenerateAllFilesFromNethereumGenAbisFile,
} from './client/codegen';
import { LanguageClientOptions, RevealOutputChannelOn } from 'vscode-languageclient';
import {
    LanguageClient,
    ServerOptions,
    TransportKind,
  } from 'vscode-languageclient/node';

import { lintAndfixCurrentDocument } from './server/linter/soliumClientFixer';
// tslint:disable-next-line:no-duplicate-imports
import { workspace, WorkspaceFolder } from 'vscode';
import { formatDocument } from './client/formatter/formatter';
import { compilerType } from './common/solcCompiler';
import * as workspaceUtil from './client/workspaceUtil';
import { AddressChecksumCodeActionProvider, ChangeCompilerVersionActionProvider, SPDXCodeActionProvider } from './client/codeActionProviders/addressChecksumActionProvider';
import { EtherscanContractDownloader } from './common/sourceCodeDownloader/etherscanSourceCodeDownloader';

let diagnosticCollection: vscode.DiagnosticCollection;
let compiler: Compiler;

export async function activate(context: vscode.ExtensionContext) {
    const ws = workspace.workspaceFolders;
    diagnosticCollection = vscode.languages.createDiagnosticCollection('seismic');
    compiler = new Compiler(context.extensionPath);

    context.subscriptions.push(diagnosticCollection);

    initDiagnosticCollection(diagnosticCollection);
    
    context.subscriptions.push(vscode.commands.registerCommand('seismic.compile.active', async () => {
        const compiledResults = await compileActiveContract(compiler);
        autoCodeGenerateAfterCompilation(compiledResults, null, diagnosticCollection);
        return compiledResults;
    }));

    context.subscriptions.push(vscode.commands.registerCommand('seismic.compile.activeUsingRemote', async () => {
        const compiledResults = await compileActiveContract(compiler, compilerType.remote);
        autoCodeGenerateAfterCompilation(compiledResults, null, diagnosticCollection);
        return compiledResults;
    }));

    context.subscriptions.push(vscode.commands.registerCommand('seismic.compile.activeUsingLocalFile', async () => {
        const compiledResults = await compileActiveContract(compiler, compilerType.localFile);
        autoCodeGenerateAfterCompilation(compiledResults, null, diagnosticCollection);
        return compiledResults;
    }));

    context.subscriptions.push(vscode.commands.registerCommand('seismic.compile.activeUsingNodeModule', async () => {
        const compiledResults = await compileActiveContract(compiler, compilerType.localNodeModule);
        autoCodeGenerateAfterCompilation(compiledResults, null, diagnosticCollection);
        return compiledResults;
    }));


    context.subscriptions.push(vscode.commands.registerCommand('seismic.compile', () => {
        compileAllContracts(compiler, diagnosticCollection);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('seismic.codegenCSharpProject', (args: any[]) => {
        codeGenerateNethereumCQSCsharp(args, diagnosticCollection);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('seismic.compileAndCodegenCSharpProject', async (args: any[]) => {
        const compiledResults = await compileActiveContract(compiler);
        compiledResults.forEach(file => {
            codeGenerateCQS(file, 0, args, diagnosticCollection);
        });
    }));

    context.subscriptions.push(vscode.commands.registerCommand('seismic.codegenNethereumCodeGenSettings', (args: any[]) => {
        generateNethereumCodeSettingsFile();
    }));

    context.subscriptions.push(vscode.commands.registerCommand('seismic.codegenVbNetProject', (args: any[]) => {
        codeGenerateNethereumCQSVbNet(args, diagnosticCollection);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('seismic.compileAndCodegenVbNetProject', async (args: any[]) => {
        const compiledResults = await compileActiveContract(compiler);
        compiledResults.forEach(file => {
            codeGenerateCQS(file, 1, args, diagnosticCollection);
        });
    }));

    context.subscriptions.push(vscode.commands.registerCommand('seismic.codegenFSharpProject', (args: any[]) => {
        codeGenerateNethereumCQSFSharp(args, diagnosticCollection);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('seismic.compileAndCodegenFSharpProject', async (args: any[]) => {
        const compiledResults = await compileActiveContract(compiler);
        compiledResults.forEach(file => {
            codeGenerateCQS(file, 3, args, diagnosticCollection);
        });
    }));

    context.subscriptions.push(vscode.commands.registerCommand('seismic.codegenCSharpProjectAll', (args: any[]) => {
        codeGenerateNethereumCQSCSharpAll(args, diagnosticCollection);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('seismic.codegenVbNetProjectAll', (args: any[]) => {
        codeGenerateNethereumCQSVbAll(args, diagnosticCollection);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('seismic.codegenFSharpProjectAll', (args: any[]) => {
        codeGenerateNethereumCQSFSharpAll(args, diagnosticCollection);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('seismic.codegenCSharpProjectAllAbiCurrent', (args: any[]) => {
        codeGenerateAllFilesFromAbiInCurrentFolder(0, args, diagnosticCollection);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('seismic.codegenVbNetProjectAllAbiCurrent', (args: any[]) => {
        codeGenerateAllFilesFromAbiInCurrentFolder(1, args, diagnosticCollection);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('seismic.codegenFSharpProjectAllAbiCurrent', (args: any[]) => {
        codeGenerateAllFilesFromAbiInCurrentFolder(3, args, diagnosticCollection);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('seismic.codeGenFromNethereumGenAbisFile', (args: any[]) => {
        codeGenerateAllFilesFromNethereumGenAbisFile(args, diagnosticCollection);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('seismic.fixDocument', () => {
        lintAndfixCurrentDocument();
    }));

    context.subscriptions.push(vscode.commands.registerCommand('seismic.compilerInfo', async () => {
        await compiler.outputCompilerInfoEnsuringInitialised();
    }));

    context.subscriptions.push(vscode.commands.registerCommand('seismic.solcReleases', async () => {
        compiler.outputSolcReleases();
    }));

    context.subscriptions.push(vscode.commands.registerCommand('seismic.selectWorkspaceRemoteSolcVersion', async () => {
        compiler.selectRemoteVersion(vscode.ConfigurationTarget.Workspace);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('seismic.downloadRemoteSolcVersion', async () => {
        const root = workspaceUtil.getCurrentWorkspaceRootFolder();
        compiler.downloadRemoteVersion(root.uri.fsPath);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('seismic.downloadVerifiedSmartContractEtherscan', async () => {
        await EtherscanContractDownloader.downloadContractWithPrompts();
    }));

    context.subscriptions.push(vscode.commands.registerCommand('seismic.downloadRemoteVersionAndSetLocalPathSetting', async () => {
        const root = workspaceUtil.getCurrentWorkspaceRootFolder();
        compiler.downloadRemoteVersionAndSetLocalPathSetting(vscode.ConfigurationTarget.Workspace, root.uri.fsPath);
    }));


    context.subscriptions.push(vscode.commands.registerCommand('seismic.selectGlobalRemoteSolcVersion', async () => {
        compiler.selectRemoteVersion(vscode.ConfigurationTarget.Global);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('seismic.changeDefaultCompilerType', async () => {
        compiler.changeDefaultCompilerType(vscode.ConfigurationTarget.Workspace);
    }));

    context.subscriptions.push(
        vscode.languages.registerDocumentFormattingEditProvider('seismic', {
            async provideDocumentFormattingEdits(document: vscode.TextDocument): Promise<vscode.TextEdit[]> {
                return await formatDocument(document, context);
            },
        }));

    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider('seismic', new AddressChecksumCodeActionProvider(), {
            providedCodeActionKinds: AddressChecksumCodeActionProvider.providedCodeActionKinds,
        }),
    );

    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider('seismic', new SPDXCodeActionProvider(), {
            providedCodeActionKinds: SPDXCodeActionProvider.providedCodeActionKinds,
        }),
    );


    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider('seismic', new ChangeCompilerVersionActionProvider(), {
            providedCodeActionKinds: ChangeCompilerVersionActionProvider.providedCodeActionKinds,
        }),
    );

    const serverModule = path.join(__dirname, 'server.js');
    const serverOptions: ServerOptions = {
        debug: {
            module: serverModule,
            options: {
                execArgv: ['--nolazy', '--inspect=6009'],
            },
            transport: TransportKind.ipc,
        },
        run: {
            module: serverModule,
            transport: TransportKind.ipc,
        },
    };

    const clientOptions: LanguageClientOptions = {
        documentSelector: [
            { language: 'solidity', scheme: 'file' },
            { language: 'solidity', scheme: 'untitled' },
        ],
        revealOutputChannelOn: RevealOutputChannelOn.Never,
        synchronize: {
            // Synchronize the setting section 'solidity' to the server
            configurationSection: 'seismic',
            // Notify the server about file changes to '.sol.js files contain in the workspace (TODO node, linter)
            fileEvents: vscode.workspace.createFileSystemWatcher('{**/remappings.txt,**/.solhint.json,**/.soliumrc.json,**/brownie-config.yaml}'),
        },
        initializationOptions: context.extensionPath,
    };

    let clientDisposable;

    if (ws) {
        clientDisposable = new LanguageClient(
            'seismic',
            'Seismic Language Server',
            serverOptions,
            clientOptions).start();
    }
    // Push the disposable to the context's subscriptions so that the
    // client can be deactivated on extension deactivation
    context.subscriptions.push(clientDisposable);
}


