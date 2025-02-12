'use strict';
import SoliumService from './solium';
import * as vscode from 'vscode';
import * as workspaceUtil from '../../client/workspaceUtil';

export function lintAndfixCurrentDocument() {
    const linterType = vscode.workspace.getConfiguration('seismic').get<string>('linter');
    if (linterType === 'solium') {
        const soliumRules = vscode.workspace.getConfiguration('seismic').get<string>('soliumRules');
        const linter = new SoliumService(
            workspaceUtil.getCurrentProjectInWorkspaceRootFsPath(), soliumRules, null);
        const editor = vscode.window.activeTextEditor;
        const sourceCode =  editor.document.getText();
        const fullRange = new vscode.Range(
            editor.document.positionAt(0),
            editor.document.positionAt(sourceCode.length),
        );

        const result = linter.lintAndFix(sourceCode);
        const edit = new vscode.WorkspaceEdit();
        edit.replace(editor.document.uri, fullRange, result.fixedSourceCode);
        return vscode.workspace.applyEdit(edit);
    }
}
