// Debug script to test selection in browser console
// Paste this into browser console on the running app

console.log('🔧 Selection Debug Script Loaded');

// Test if elements exist
const editableElements = document.querySelectorAll('[data-editable]');
const repeatableElements = document.querySelectorAll('[data-repeatable]');

console.log(`Found ${editableElements.length} editable elements`);
console.log(`Found ${repeatableElements.length} repeatable elements`);

// Test selection function
function testSelection() {
    const firstEditable = editableElements[0];
    if (firstEditable) {
        console.log('Testing selection on:', firstEditable);
        
        // Manually apply selection attributes
        firstEditable.setAttribute('data-selected', 'true');
        firstEditable.setAttribute('data-selection-type', 'text');
        
        console.log('Applied selection attributes');
        console.log('Element classes:', firstEditable.className);
        console.log('Element data attributes:', Array.from(firstEditable.attributes).filter(attr => attr.name.startsWith('data-')));
    } else {
        console.log('No editable elements found');
    }
}

// Test clear selection
function testClearSelection() {
    document.querySelectorAll('[data-selected]').forEach(el => {
        el.removeAttribute('data-selected');
        el.removeAttribute('data-selection-type');
        console.log('Cleared selection from:', el);
    });
}

// Make functions globally available
window.testSelection = testSelection;
window.testClearSelection = testClearSelection;

console.log('🔧 Use testSelection() and testClearSelection() to test manually');