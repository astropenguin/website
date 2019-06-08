// Delete custom style of webkit scroll bar

const deleteRulesOfScrollBar = sheet => {
    for (let i = 0; i < sheet.rules.length; i++) {
        let rule = sheet.rules[i]

        if (/::-webkit-scrollbar/.test(rule.selectorText)) {
            sheet.deleteRule(i--);
        }
    }
}

[].slice.call(document.styleSheets).forEach(sheet => {
    try {
        deleteRulesOfScrollBar(sheet)
    } catch(error) {
        // pass
    }
})
