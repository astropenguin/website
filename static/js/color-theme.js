// Toggle dark/light color theme

const colorTheme = "color-theme"
const darkTheme = "dark-theme"
const lightTheme = "light-theme"
const darkCSS = "dark-theme.css"
const lightCSS = "light-theme.css"


const getStyleSheet = filename => {
    let sheets = document.styleSheets;

    for (let i = 0; i < sheets.length; i++) {
        let sheet = sheets[i];

        if (!("href" in sheet)) {
            continue;
        }

        if (!sheet.href) {
            continue;
        }

        if (sheet.href.endsWith(filename)) {
            return sheet;
        }
    }
}


const toggleColorTheme = () => {
    let sheet = getStyleSheet(lightCSS);

    if (window.localStorage.getItem(colorTheme) == darkTheme) {
        window.localStorage.setItem(colorTheme, lightTheme);
        sheet.disabled = false;
    } else {
        window.localStorage.setItem(colorTheme, darkTheme);
        sheet.disabled = true;
    }
}


if (!window.localStorage.getItem(colorTheme)) {
    window.localStorage.setItem(colorTheme, lightTheme);
}


if (window.localStorage.getItem(colorTheme) == darkTheme) {
    let sheet = getStyleSheet(lightCSS);
    sheet.disabled = true
}

