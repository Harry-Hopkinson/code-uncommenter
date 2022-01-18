import * as vscode from "vscode";
import "typescript";
import {codeUnCommenterCommand } from "./constants";

let statusBarItem: vscode.StatusBarItem;

export function activate({ subscriptions }: vscode.ExtensionContext) {
	
	subscriptions.push(vscode.commands.registerCommand(codeUnCommenterCommand, () => {
		const editor = vscode.window.activeTextEditor;
		const documentFileType = vscode.window.activeTextEditor?.document.languageId;

		if (editor) {
			if (editor.selection.isEmpty) {
				vscode.window.showInformationMessage("Please select text to uncomment.");
				return;
			}
			if (documentFileType === "typescript" || "javascript") {
				for (let i = 0; i < editor.selection.end.line; i++) {
					if (editor.document.lineAt(i).text.trim() === "//" || '/*' || '*/') {
						editor.edit((edit: { delete: (arg0: any) => void; }) => {
							edit.delete(new vscode.Range(i, 0, i, 0));
						});
					}
				}
			}
			else if (documentFileType === "python") {
				for (let i = 0; i < editor.selection.end.line; i++) {
					if (editor.document.lineAt(i).text.trim() === "#" || '"""') {
						editor.edit((edit: { delete: (arg0: any) => void; }) => {
							edit.delete(new vscode.Range(i, 0, i, 0));
						});
					}
				}
			}
		}
	}))

	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarItem.command = codeUnCommenterCommand;
	subscriptions.push(statusBarItem);

	subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBar));
	subscriptions.push(vscode.window.onDidChangeTextEditorSelection(updateStatusBar));
	subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBar));
	updateStatusBar();

}

export function updateStatusBar() : void{
	statusBarItem.text = `$(symbol-number)`;
	statusBarItem.tooltip = "Uncomment Code";
	statusBarItem.show();
}

export function deactivate() {
	statusBarItem.dispose();
}