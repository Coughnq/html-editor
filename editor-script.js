document.addEventListener('DOMContentLoaded', () => {
    const fontFamily = document.getElementById('fontFamily');
    const fontSize = document.getElementById('fontSize');
    const textColor = document.getElementById('textColor');
    const backgroundColor = document.getElementById('backgroundColor');
    const editor = document.getElementById('editor');

    // Font Family Change
    fontFamily.addEventListener('change', () => {
        document.execCommand('fontName', false, fontFamily.value);
    });

    // Font Size Change
    fontSize.addEventListener('change', () => {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        if (range.collapsed) {
            editor.style.fontSize = fontSize.value;
            return;
        }

        const span = document.createElement('span');
        span.style.fontSize = fontSize.value;
        const selectedFragment = range.extractContents();
        span.appendChild(selectedFragment);
        range.insertNode(span);
    });

    // Text Color Change
    textColor.addEventListener('change', () => {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        if (range.collapsed) {
            editor.style.color = textColor.value;
            return;
        }

        document.execCommand('foreColor', false, textColor.value);
    });

    // Background Color Change
    backgroundColor.addEventListener('change', () => {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        if (range.collapsed) {
            editor.style.backgroundColor = backgroundColor.value;
            return;
        }

        document.execCommand('hiliteColor', false, backgroundColor.value);
    });

    // Style Functions
    window.applyStyle = (style) => {
        document.execCommand(style, false, null);
    };

    // Alignment Functions
    window.applyAlignment = (alignment) => {
        document.execCommand('justify' + alignment.charAt(0).toUpperCase() + alignment.slice(1), false, null);
    };

    // Export Function
    window.exportHTML = () => {
        const htmlOutput = document.getElementById('htmlOutput');
        const content = editor.innerHTML;
        
        // Basic HTML cleanup
        const cleanHTML = content
            .replace(/<div>/g, '<p>')
            .replace(/<\/div>/g, '</p>')
            .replace(/<p>\s*<\/p>/g, '');
            
        htmlOutput.value = cleanHTML;
        htmlOutput.select();
    };

    // Autosave functionality
    let autosaveTimeout;
    editor.addEventListener('input', () => {
        clearTimeout(autosaveTimeout);
        autosaveTimeout = setTimeout(() => {
            localStorage.setItem('editorContent', editor.innerHTML);
        }, 1000);
    });

    // Load saved content
    const savedContent = localStorage.getItem('editorContent');
    if (savedContent) {
        editor.innerHTML = savedContent;
    }

    // Keyboard shortcuts
    editor.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key.toLowerCase()) {
                case 'b':
                    e.preventDefault();
                    applyStyle('bold');
                    break;
                case 'i':
                    e.preventDefault();
                    applyStyle('italic');
                    break;
                case 'u':
                    e.preventDefault();
                    applyStyle('underline');
                    break;
            }
        }
    });

    // Paste as plain text
    editor.addEventListener('paste', (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
    });
}); 