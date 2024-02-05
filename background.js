chrome.runtime.onMessage.addListener(data => {
    const { event, prefs } = data
    switch (event) {
        case 'onAddBirthday':
            handleOnStart(prefs);
            break;
        default: 
            break;
    }
})

const handleOnStart = (prefs) => {
    console.log("On start in background")
    console.log("prefs received:", prefs)
    chrome.storage.local.set(prefs)
}