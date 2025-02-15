'use strict';

import * as vscode from 'vscode';
import { EtherscanDomainChainMapper } from '../common/sourceCodeDownloader/etherscanSourceCodeDownloader';

export class SettingsService {

    public static getPackageDefaultDependenciesDirectories(): string[] {
        const packageDefaultDependenciesDirectory = vscode.workspace.getConfiguration('seismic').get<string|string[]>('packageDefaultDependenciesDirectory');
        if (typeof packageDefaultDependenciesDirectory === 'string') {return [<string>packageDefaultDependenciesDirectory]; }
        return <string[]>packageDefaultDependenciesDirectory;
    }

    public static getPackageDefaultDependenciesContractsDirectory(): string[] {
        const packageDefaultDependenciesContractsDirectory = vscode.workspace.getConfiguration('seismic').get<string|string[]>('packageDefaultDependenciesContractsDirectory');
        if (typeof packageDefaultDependenciesContractsDirectory === 'string') {return [<string>packageDefaultDependenciesContractsDirectory]; }
        return <string[]>packageDefaultDependenciesContractsDirectory;
    }

    public static getCompilerOptimisation(): number {
        return vscode.workspace.getConfiguration('seismic').get<number>('compilerOptimization');
    }

    public static getEVMVersion(): string {
        return vscode.workspace.getConfiguration('seismic').get<string>('evmVersion');
    }

    public static getViaIR(): boolean {
        return vscode.workspace.getConfiguration('seismic').get<boolean>('viaIR');
    }


    public static getRemappings(): string[] {
        return vscode.workspace.getConfiguration('seismic').get<string[]>('remappings');
    }

    public static getRemappingsWindows(): string[] {
        return vscode.workspace.getConfiguration('seismic').get<string[]>('remappingsWindows');
    }

    public static getRemappingsUnix(): string[] {
        return vscode.workspace.getConfiguration('seismic').get<string[]>('remappingsUnix');
    }

    public static getMonoRepoSupport(): boolean {
        return vscode.workspace.getConfiguration('seismic').get<boolean>('monoRepoSupport');
    }

    public static getExplorerEtherscanBasedApiKey(server: string): string {

        const key = EtherscanDomainChainMapper.getApiKeyMappings()[server];
        return vscode.workspace.getConfiguration('seismic').get<string>(key);
    }

}
