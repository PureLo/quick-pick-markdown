import * as vscode from 'vscode';

function insertSnippet(snippet: string) {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    editor.insertSnippet(new vscode.SnippetString(snippet));
  }
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('quickPick.insertTable', () => {
      insertSnippet('| Header 1 |Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |');
    }),
    vscode.commands.registerCommand('quickPick.insertCodeBlock', () => {
      insertSnippet('```$1\n$0\n```');
    }),
    vscode.commands.registerCommand('quickPick.insertTodoList', () => {
      insertSnippet('- [ ] Task 1\n- [ ] Task 2');
    }),
    vscode.commands.registerCommand('quickPick.insertOrderedList', () => {
      insertSnippet('1. Item 1\n2. Item 2');
    }),
    vscode.commands.registerCommand('quickPick.insertUnorderedList', () => {
      insertSnippet('- Item 1\n- Item 2');
    }),
    vscode.commands.registerCommand('quickPick.insertCalendar', () => {
      insertSnippet('<!-- Calendar Placeholder -->');
    }),
    vscode.commands.registerCommand('quickPick.insertHeader', () => {
      insertSnippet('# Header 1\n## Header 2\n### Header 3');
    }),
    vscode.commands.registerCommand('quickPick.insertImage', () => {
      insertSnippet('![alt text]($1)');
    }),
    vscode.commands.registerCommand('quickPick.insertLink', () => {
      insertSnippet('[link text]($1)');
    }),
    vscode.commands.registerCommand('quickPick.insertHighlightBlock', () => {
      insertSnippet('> [!NOTE]\n> Highlighted block');
    }),
    vscode.commands.registerCommand('quickPick.insertFile', () => {
      insertSnippet('[filename.ext]($1)');
    }),
    vscode.commands.registerCommand('quickPick.insertSubfield', () => {
      insertSnippet('---\n**Subfield**\n---');
    }),
    vscode.commands.registerCommand('quickPick.showQuickPickMenu', async () => {
      const items = [
        { label: 'Table', snippet: '| Header 1 |Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |' },
        { label: 'Code Block', snippet: '```$1\n$0\n```' },
        { label: 'TODO List', snippet: '- [ ] Task 1\n- [ ] Task 2' },
        { label: 'Ordered List', snippet: '1. Item 1\n2. Item 2' },
        { label: 'Unordered List', snippet: '- Item 1\n- Item 2' },
        { label: 'Calendar', snippet: '<!-- Calendar Placeholder -->' },
        { label: 'Header', snippet: '# Header 1\n## Header 2\n### Header 3' },
        { label: 'Image', snippet: '![alt text]($1)' },
        { label: 'Link', snippet: '[link text]($1)' },
        { label: 'Highlight Block', snippet: '> [!NOTE]\n> Highlighted block' },
        { label: 'File', snippet: '[filename.ext]($1)' },
        { label: 'Subfield', snippet: '---\n**Subfield**\n---' }
      ];
      const pick = await vscode.window.showQuickPick(items.map(i => i.label), { placeHolder: 'Select a markdown snippet to insert...' });
      if (!pick) return;
      const selected = items.find(i => i.label === pick);
      if (selected) {
        insertSnippet(selected.snippet);
      }
    })
  );

  // 注册markdown下的/补全
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      { language: 'markdown' },
      {
        provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
          const line = document.lineAt(position);
          const text = line.text.substring(0, position.character);

          // 匹配 Notion 风格：行首或空格后跟/和可选命令
          const match = text.match(/(?:^|\s)\/(\w*)$/);
          if (!match) {
            return undefined;
          }
          const input = match[1].toLowerCase();
          const allItems = [
            { label: 'Table', insertText: '| Header 1 |Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |', detail: 'Markdown Table', filter: 'table' },
            { label: 'Code Block', insertText: '```$1\n$0\n```', detail: 'Code Block', filter: 'code' },
            { label: 'TODO List', insertText: '- [ ] Task 1\n- [ ] Task 2', detail: 'TODO List', filter: 'todo' },
            { label: 'Ordered List', insertText: '1. Item 1\n2. Item 2', detail: 'Ordered List', filter: 'ordered' },
            { label: 'Unordered List', insertText: '- Item 1\n- Item 2', detail: 'Unordered List', filter: 'unordered' },
            { label: 'Calendar', insertText: '<!-- Calendar Placeholder -->', detail: 'Calendar', filter: 'calendar' },
            { label: 'Header', insertText: '# Header 1\n## Header 2\n### Header 3', detail: 'Header (h1-h5)', filter: 'header' },
            { label: 'Image', insertText: '![alt text]($1)', detail: 'Image', filter: 'image' },
            { label: 'Link', insertText: '[link text]($1)', detail: 'Link', filter: 'link' },
            { label: 'Highlight Block', insertText: '> [!NOTE]\n> Highlighted block', detail: 'Highlight Block', filter: 'highlight' },
            { label: 'File', insertText: '[filename.ext]($1)', detail: 'File', filter: 'file' },
            { label: 'Subfield', insertText: '---\n**Subfield**\n---', detail: 'Subfield', filter: 'subfield' }
          ];
          // 过滤建议
          const filtered = allItems.filter(i => i.label.toLowerCase().includes(input) || i.filter.includes(input));
          return filtered.map(i => {
            const item = new vscode.CompletionItem(i.label, vscode.CompletionItemKind.Snippet);
            item.insertText = new vscode.SnippetString(i.insertText);
            item.detail = i.detail;
            // 替换/xxx为片段
            item.range = new vscode.Range(position.line, text.lastIndexOf('/') , position.line, position.character);
            return item;
          });
        }
      },
      '/' // 触发字符
    )
  );

  // 监听markdown文档输入/时弹出QuickPick菜单
  vscode.workspace.onDidChangeTextDocument(e => {
    const editor = vscode.window.activeTextEditor;
    if (
      editor &&
      editor.document.languageId === 'markdown' &&
      e.document === editor.document
    ) {
      const change = e.contentChanges[0];
      if (change && change.text === '/') {
        vscode.commands.executeCommand('quickPick.showQuickPickMenu');
      }
    }
  });
}

export function deactivate() {} 